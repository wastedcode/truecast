import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { adoptUnledgered, findUnledgered } from "../adopt/index.js";
import { cacheCandidate, promoteCurrent } from "../cache/index.js";
import { type Config, paths, resolveConfig } from "../config/index.js";
import { Ledger } from "../ledger/index.js";
import type { Logger } from "../log/index.js";
import { composeAgentFile, materialize } from "../materialize/index.js";
import { loadPersona } from "../persona/index.js";
import { removeContained } from "../safety/index.js";
import { cachedVersions, personaDirs, runningVersion } from "../state/index.js";
import { type Confirm, gate } from "./consent.js";

/**
 * Inspect + repair the truecast home (R9) — the recovery story for the states that refusals or a crash
 * can leave behind. Read-only by default; `fix` heals the safe issues. Drift and orphans are never
 * auto-destroyed (they may be your edits) — those are reported with a concrete next step.
 */

export type DoctorIssueKind =
  | "drift" // an owned managed file was hand-edited
  | "missing-owned" // an owned managed file vanished
  | "dangling-current" // `current` doesn't resolve but versions are cached
  | "stale-staging" // leftover *.staging-*/*.tmp-* from a crashed write
  | "orphan-cache" // a cached version dir not in the ledger AND not attributable to truecast
  | "unledgered" // provably truecast-shaped state the ledger doesn't track yet (the plugin lane, D4)
  | "stale-surface"; // an owned agent file whose bytes ≠ a fresh render of the running version

export interface DoctorIssue {
  kind: DoctorIssueKind;
  path: string;
  persona?: string | undefined;
  detail: string;
  healable: boolean;
  healed: boolean;
}

export interface DoctorReport {
  issues: DoctorIssue[];
  healthy: boolean;
}

export interface DoctorOptions {
  /** Apply the safe heals (re-point a dangling `current`, remove stale staging files). */
  fix?: boolean | undefined;
}

export interface DoctorCtx {
  config?: Config | undefined;
  logger?: Logger | undefined;
  /** Gate before applying `--fix` heals (an altering op). Default: approve (safe heals only). */
  confirm?: Confirm | undefined;
}

export async function doctor(opts: DoctorOptions = {}, ctx: DoctorCtx = {}): Promise<DoctorReport> {
  const config = ctx.config ?? resolveConfig();

  // Phase 1 — INSPECT (read-only), each persona under its own lock. No mutation here.
  const issues: DoctorIssue[] = [];
  for (const name of personaDirs(config)) {
    issues.push(
      ...(await Ledger.transaction(config, name, (ledger) => inspectPersona(name, config, ledger))),
    );
  }

  // Phase 2 — HEAL the safe issues, but only with consent (fixing alters state).
  const healable = issues.filter((i) => i.healable);
  if (opts.fix && healable.length > 0) {
    await gate<void>(
      ctx,
      { kind: "doctor-fix", issues: healable.length },
      () => undefined, // declined → leave everything as reported
      async () => {
        const byPersona = new Map<string, DoctorIssue[]>();
        for (const i of healable) {
          if (!i.persona) continue;
          const list = byPersona.get(i.persona);
          if (list) list.push(i);
          else byPersona.set(i.persona, [i]);
        }
        for (const [name, list] of byPersona) {
          await Ledger.transaction(config, name, (ledger) =>
            healPersona(name, list, config, ledger, ctx),
          );
        }
      },
    );
  }

  const unresolved = issues.filter((i) => !i.healed).length;
  ctx.logger?.info({ issues: issues.length, healed: issues.length - unresolved }, "doctor");
  return { issues, healthy: unresolved === 0 };
}

/** Read-only: find this persona's issues (drift / missing / dangling-current / stale / orphan-cache). */
function inspectPersona(name: string, config: Config, ledger: Ledger): DoctorIssue[] {
  const issues: DoctorIssue[] = [];

  // 1. owned files: vanished or hand-edited.
  for (const e of ledger.owned()) {
    if (e.kind === "symlink") continue; // pointers are checked below
    if (!existsSync(e.path)) {
      issues.push({
        kind: "missing-owned",
        path: e.path,
        persona: name,
        detail: "a file truecast generated is gone; re-install or update to regenerate it",
        healable: false,
        healed: false,
      });
    } else if (ledger.isDrifted(e.path)) {
      issues.push({
        kind: "drift",
        path: e.path,
        persona: name,
        detail: `hand-edited since generated; run 'truecast update ${name} --force' to discard, or restore it`,
        healable: false,
        healed: false,
      });
    }
  }

  // 2. a dangling `current` (healable by re-promoting the newest cached version).
  const versions = cachedVersions(config, name);
  if (runningVersion(config, name) === null && versions.length > 0) {
    issues.push({
      kind: "dangling-current",
      path: paths.currentLink(config, name),
      persona: name,
      detail: `current does not resolve; newest cached is ${versions[0]}`,
      healable: true,
      healed: false,
    });
  }

  // 3. stale staging/temp artifacts from a crashed copy or pointer swap (healable: remove).
  for (const stale of scanStale(config, name)) {
    issues.push({
      kind: "stale-staging",
      path: stale,
      persona: name,
      detail: "leftover staging/temp artifact from an interrupted write",
      healable: true,
      healed: false,
    });
  }

  // 4. state the ledger doesn't track but truecast provably wrote (the plugin lane, D4) — healable by
  //    adopting it. Reported BEFORE orphan-cache so an adoptable cache dir isn't also called an orphan.
  const unledgered = findUnledgered(config, name, ledger);
  for (const path of unledgered) {
    issues.push({
      kind: "unledgered",
      path,
      persona: name,
      detail: "installed by the plugin lane (/truecast:install); 'truecast doctor --fix' adopts it",
      healable: true,
      healed: false,
    });
  }

  // 5. cached version dirs neither owned NOR attributable (legacy/crash residue; report-only).
  for (const ver of versions) {
    const core = paths.personaCache(config, name, ver);
    if (!ledger.owns(core) && !unledgered.includes(core)) {
      issues.push({
        kind: "orphan-cache",
        path: core,
        persona: name,
        detail:
          "a cached version truecast doesn't track; 'truecast remove <name> --global' to clear",
        healable: false,
        healed: false,
      });
    }
  }

  // 6. an owned, un-drifted agent file whose bytes are no longer what the running version renders —
  //    the migration path for files written by an older truecast (e.g. 0.2.x pointer format).
  const agentPath = paths.claudeAgent(config, name);
  if (ledger.owns(agentPath) && existsSync(agentPath) && !ledger.isDrifted(agentPath)) {
    const fresh = renderRunning(config, name);
    if (fresh !== null && fresh !== readFileSync(agentPath, "utf8")) {
      issues.push({
        kind: "stale-surface",
        path: agentPath,
        persona: name,
        detail: "generated by an older truecast; 'truecast doctor --fix' regenerates it",
        healable: true,
        healed: false,
      });
    }
  }

  return issues;
}

/** A fresh subagent render of the version `current` points at, or null if it can't be rendered. */
function renderRunning(config: Config, name: string): string | null {
  const running = runningVersion(config, name);
  if (!running) return null;
  try {
    const persona = loadPersona(join(paths.personaDir(config, name), running));
    return composeAgentFile({ name, version: running, coreDir: persona.coreDir }, persona, {
      kind: "subagent",
    });
  } catch {
    return null; // the running version won't load — other issues cover that
  }
}

/** Apply the safe heals for one persona (re-promote a dangling `current`, remove stale artifacts). */
function healPersona(
  name: string,
  issues: DoctorIssue[],
  config: Config,
  ledger: Ledger,
  ctx: DoctorCtx,
): void {
  for (const issue of issues) {
    try {
      if (issue.kind === "dangling-current") {
        const latest = cachedVersions(config, name)[0];
        if (!latest) continue;
        const persona = loadPersona(join(paths.personaDir(config, name), latest)); // re-validate
        const cached = cacheCandidate(persona, config, ledger);
        materialize(cached, persona, config, ledger, { force: true }); // heal overrides drift
        promoteCurrent(name, latest, config, ledger);
        issue.healed = true;
      } else if (issue.kind === "stale-staging") {
        removeContained(config.truecastHome, issue.path);
        issue.healed = true;
      } else if (issue.kind === "unledgered") {
        // adopt is idempotent and adopts everything attributable at once — re-check per issue
        adoptUnledgered(config, name, ledger);
        issue.healed = ledger.owns(issue.path);
      } else if (issue.kind === "stale-surface") {
        const running = runningVersion(config, name);
        if (!running) continue;
        const persona = loadPersona(join(paths.personaDir(config, name), running));
        materialize({ name, version: running, coreDir: persona.coreDir }, persona, config, ledger);
        issue.healed = true;
      }
    } catch (err) {
      // a persona failing to heal must not abort the sweep
      issue.detail = `${issue.detail} — heal failed: ${err instanceof Error ? err.message : err}`;
      ctx.logger?.warn({ persona: name, err }, "doctor: heal failed");
    }
  }
}

/** Find leftover `*.staging-*` / `*.tmp-*` artifacts under one persona's dir (shallow, bounded). */
function scanStale(config: Config, name: string): string[] {
  const personaDir = paths.personaDir(config, name);
  const hits: string[] = [];
  const isStale = (n: string): boolean => n.includes(".staging-") || n.includes(".tmp-");
  for (const entry of safeReaddir(personaDir)) {
    if (isStale(entry)) hits.push(join(personaDir, entry));
    else {
      const verDir = join(personaDir, entry);
      for (const inner of safeReaddir(verDir)) {
        if (isStale(inner)) hits.push(join(verDir, inner));
      }
    }
  }
  return hits;
}

function safeReaddir(dir: string): string[] {
  try {
    return readdirSync(dir);
  } catch {
    return []; // not a dir / unreadable — skip
  }
}
