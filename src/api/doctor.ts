import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { cacheCandidate, promoteCurrent } from "../cache/index.js";
import { type Config, paths, resolveConfig } from "../config/index.js";
import { Ledger } from "../ledger/index.js";
import type { Logger } from "../log/index.js";
import { materialize } from "../materialize/index.js";
import { loadPersona } from "../persona/index.js";
import { removeContained } from "../safety/index.js";
import { cachedVersions, installedPersonas, runningVersion } from "../state/index.js";

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
  | "orphan-cache"; // a cached version dir not in the ledger (legacy / crash residue)

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
}

export async function doctor(opts: DoctorOptions = {}, ctx: DoctorCtx = {}): Promise<DoctorReport> {
  const config = ctx.config ?? resolveConfig();
  return Ledger.transaction(config, (ledger) => {
    const issues: DoctorIssue[] = [];

    // 1. owned files: vanished or hand-edited.
    for (const e of ledger.all()) {
      if (e.kind === "symlink") continue; // pointers are checked per-persona below
      if (!existsSync(e.path)) {
        issues.push({
          kind: "missing-owned",
          path: e.path,
          persona: e.source,
          detail: "a file truecast generated is gone; re-install or update to regenerate it",
          healable: false,
          healed: false,
        });
      } else if (ledger.isDrifted(e.path)) {
        issues.push({
          kind: "drift",
          path: e.path,
          persona: e.source,
          detail:
            "hand-edited since generated; run 'truecast update <name> --force' to discard, or restore it",
          healable: false,
          healed: false,
        });
      }
    }

    // 2. per-persona: a dangling `current` (healable by re-promoting the newest cached version).
    for (const name of installedPersonas(config)) {
      if (runningVersion(config, name) !== null) continue;
      const versions = cachedVersions(config, name);
      if (versions.length === 0) continue; // nothing to heal to
      const latest = versions[0] as string;
      const issue: DoctorIssue = {
        kind: "dangling-current",
        path: paths.currentLink(config, name),
        persona: name,
        detail: `current does not resolve; newest cached is ${latest}`,
        healable: true,
        healed: false,
      };
      if (opts.fix) {
        try {
          const persona = loadPersona(join(paths.personaDir(config, name), latest)); // re-validate
          const cached = cacheCandidate(persona, config, ledger);
          materialize(cached, persona, config, ledger, { force: true }); // heal overrides drift
          promoteCurrent(name, latest, config, ledger);
          issue.healed = true;
        } catch (err) {
          // one persona failing to heal must not abort the whole doctor run
          issue.detail = `${issue.detail} — heal failed: ${err instanceof Error ? err.message : err}`;
          ctx.logger?.warn({ persona: name, err }, "doctor: heal failed");
        }
      }
      issues.push(issue);
    }

    // 3. stale staging / temp artifacts from a crashed copy or pointer swap (healable: remove).
    for (const stale of scanStale(config)) {
      const issue: DoctorIssue = {
        kind: "stale-staging",
        path: stale,
        detail: "leftover staging/temp artifact from an interrupted write",
        healable: true,
        healed: false,
      };
      if (opts.fix) {
        removeContained(config.truecastHome, stale);
        issue.healed = true;
      }
      issues.push(issue);
    }

    // 4. cached version dirs not owned by the ledger (legacy/crash residue; report-only — may be wanted).
    for (const name of installedPersonas(config)) {
      for (const ver of cachedVersions(config, name)) {
        const core = paths.personaCache(config, name, ver);
        if (!ledger.owns(core)) {
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
    }

    const unresolved = issues.filter((i) => !i.healed);
    ctx.logger?.info(
      { issues: issues.length, healed: issues.length - unresolved.length },
      "doctor",
    );
    return { issues, healthy: unresolved.length === 0 };
  });
}

/** Find leftover `*.staging-*` / `*.tmp-*` artifacts under the personas tree (shallow, bounded walk). */
function scanStale(config: Config): string[] {
  const root = paths.personasRoot(config);
  if (!existsSync(root)) return [];
  const hits: string[] = [];
  const isStale = (n: string): boolean => n.includes(".staging-") || n.includes(".tmp-");
  for (const name of readdirSync(root)) {
    const personaDir = join(root, name);
    for (const entry of safeReaddir(personaDir)) {
      if (isStale(entry)) hits.push(join(personaDir, entry));
      else {
        const verDir = join(personaDir, entry);
        for (const inner of safeReaddir(verDir)) {
          if (isStale(inner)) hits.push(join(verDir, inner));
        }
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
