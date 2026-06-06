import semver from "semver";
import { cacheCandidate, promoteCurrent } from "../cache/index.js";
import { type Config, paths, resolveConfig } from "../config/index.js";
import { TruecastError } from "../errors.js";
import { fetchSource, parseSource, resolveVersions } from "../fetch/index.js";
import { Ledger } from "../ledger/index.js";
import type { Logger } from "../log/index.js";
import { materialize } from "../materialize/index.js";
import { readMeta, upsertVersion, writeMeta } from "../meta/index.js";
import { loadPersona, readManifest } from "../persona/index.js";
import { classify, computeChanges, toolsDiff } from "../review/index.js";
import { UpdatePlan } from "../schema/index.js";
import { installedPersonas, runningVersion } from "../state/index.js";

/** Programmatic inputs for `update` (CLI flags map 1:1). Omit `name` to update every installed persona. */
export interface UpdateOptions {
  /** The installed persona to update. Omit to update all. */
  name?: string | undefined;
  /** Target a specific version (downgrade/rollback) instead of latest. */
  version?: string | undefined;
  /** Plan only — fetch + classify, write nothing (RR10). */
  dryRun?: boolean | undefined;
}

export interface UpdateCtx {
  config?: Config | undefined;
  logger?: Logger | undefined;
  /** Gate before any global write. The plan carries `changeClass`/`toolsAdded`/`downgrade`/`tagMoved`
   *  so a caller can require explicit consent for risky updates. Default: auto-approve. */
  confirm?: ((plan: UpdatePlan) => boolean | Promise<boolean>) | undefined;
}

export interface UpdateResult {
  persona: string;
  /** null when already up to date (no candidate newer/different than what runs). */
  plan: UpdatePlan | null;
  applied: boolean;
  upToDate: boolean;
  /** Set when this persona's transaction failed (update-all keeps going; RR7). */
  error?: string | undefined;
}

/** Update one persona (tracking path) or — with no name — every installed persona independently (U2). */
export async function update(opts: UpdateOptions, ctx: UpdateCtx = {}): Promise<UpdateResult[]> {
  const config = ctx.config ?? resolveConfig();
  if (opts.name)
    return [await updateOne(opts.name, opts.version, opts.dryRun ?? false, config, ctx)];

  // update-all: each persona is an INDEPENDENT transaction — one failure never rolls back others (RR7).
  const results: UpdateResult[] = [];
  for (const name of installedPersonas(config)) {
    try {
      results.push(await updateOne(name, undefined, opts.dryRun ?? false, config, ctx));
    } catch (err) {
      results.push({
        persona: name,
        plan: null,
        applied: false,
        upToDate: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
  return results;
}

async function updateOne(
  name: string,
  version: string | undefined,
  dryRun: boolean,
  config: Config,
  ctx: UpdateCtx,
): Promise<UpdateResult> {
  const meta = readMeta(config, name);
  if (!meta) {
    throw new TruecastError(
      "NOT_INSTALLED",
      `"${name}" is not installed (no meta record).`,
      "Install it first with 'truecast install <source>'.",
    );
  }

  const parsed = parseSource(meta.source); // committed source is untrusted → re-validated every run (RR6)
  // Resolve the target ref: explicit version, else latest tag, else the source's default (path/untagged).
  if (version) parsed.ref = version;
  else if (parsed.kind === "git") parsed.ref = (await resolveVersions(parsed))[0];

  const fetched = await fetchSource(parsed, config.tmpRoot);
  try {
    const persona = loadPersona(fetched.dir); // FULL validation before anything touches `current` (RR1)
    if (persona.manifest.name !== name) {
      throw new TruecastError(
        "NAME_MISMATCH",
        `source for "${name}" now resolves to a persona named "${persona.manifest.name}".`,
        "The upstream identity changed; reinstall deliberately if intended.",
      );
    }
    const candidateVer = persona.manifest.version;
    const candidateCore = persona.coreDir;

    const running = runningVersion(config, name);
    const recordedCommit = running
      ? meta.versions.find((v) => v.ver === running)?.commit
      : undefined;

    // No-op: same version AND same content commit as what already runs (AC-U2). Detect a moved tag
    // (same version, different commit) — a supply-chain signal — and surface it instead (RR5).
    const tagMoved =
      candidateVer === running && !!recordedCommit && fetched.commit !== recordedCommit;
    if (candidateVer === running && !tagMoved && !version) {
      return { persona: name, plan: null, applied: false, upToDate: true };
    }

    const currentCore = paths.currentCore(config, name);
    const currentTools = running ? (readManifest(currentCore).tools ?? []) : [];
    const candidateTools = persona.manifest.tools ?? [];
    const { added, removed } = toolsDiff(currentTools, candidateTools);

    // Diff against the running core directly (no cache write yet — keeps --dry-run write-free, RR10).
    const changes = running ? computeChanges(currentCore, candidateCore) : [];
    const changeClass = classify(changes, added);
    const downgrade =
      !!running && semver.valid(candidateVer) !== null && semver.lt(candidateVer, running);

    const plan = UpdatePlan.parse({
      persona: name,
      from: running ?? "none",
      to: candidateVer,
      fromCommit: recordedCommit ?? "local",
      toCommit: fetched.commit,
      changeClass,
      changes,
      toolsAdded: added,
      toolsRemoved: removed,
      downgrade,
      tagMoved,
    });

    if (dryRun) return { persona: name, plan, applied: false, upToDate: false };
    const confirm = ctx.confirm ?? ((): boolean => true);
    if (!(await confirm(plan))) return { persona: name, plan, applied: false, upToDate: false };

    // Apply (RR1 order): cache candidate → materialize surface → re-point `current` LAST → record meta.
    const ledger = await Ledger.load(config);
    const cached = cacheCandidate(persona, config, ledger);
    materialize(cached, persona, config, ledger);
    promoteCurrent(cached.name, cached.version, config, ledger);
    writeMeta(config, name, upsertVersion(meta, parsed.url, candidateVer, fetched.commit), ledger);
    await ledger.save();
    ctx.logger?.info({ persona: name, from: running, to: candidateVer }, "updated");
    return { persona: name, plan, applied: true, upToDate: false };
  } finally {
    await fetched.dispose();
  }
}
