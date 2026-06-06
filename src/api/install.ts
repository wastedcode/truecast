import { join } from "node:path";
import { attachPersona } from "../attach/index.js";
import { cacheCandidate, promoteCurrent } from "../cache/index.js";
import { type Config, paths, resolveConfig } from "../config/index.js";
import { TruecastError } from "../errors.js";
import { fetchSource, parseSource } from "../fetch/index.js";
import { Ledger } from "../ledger/index.js";
import { locateProject } from "../locate/index.js";
import type { Logger } from "../log/index.js";
import { materialize, skillLeaf } from "../materialize/index.js";
import { readMeta, upsertVersion, writeMeta } from "../meta/index.js";
import { type Persona, loadPersona } from "../persona/index.js";
import { InstallPlan, type PlannedWrite } from "../schema/index.js";

/** Programmatic inputs for `install` (CLI flags map 1:1 to these). */
export interface InstallOptions {
  /** A git URL or local path, optionally `@version`. */
  source: string;
  /** Attach to this project root instead of discovering one. */
  project?: string | undefined;
  /** Install to the global cache only; do not attach to a project. */
  global?: boolean | undefined;
  /** Install under a different local name. */
  as?: string | undefined;
  /** Plan only — compute and return the plan, write nothing. */
  dryRun?: boolean | undefined;
  /** Cwd to discover the project from (defaults to process.cwd()). */
  cwd?: string | undefined;
}

/**
 * Injected context. Programmatic callers (Posse) supply their own; the CLI supplies pino + a prompt.
 * The library NEVER prompts, prints, or exits — `confirm` is the approval policy, owned by the caller.
 */
export interface Ctx {
  config?: Config | undefined;
  logger?: Logger | undefined;
  /** Called with the computed plan before any write. Default: auto-approve (caller consented). */
  confirm?: ((plan: InstallPlan) => boolean | Promise<boolean>) | undefined;
}

export interface InstallResult {
  plan: InstallPlan;
  /** Whether the plan was applied (false for `dryRun` or a declined `confirm`). */
  applied: boolean;
}

function planWrites(persona: Persona, projectRoot: string | null, config: Config): PlannedWrite[] {
  const name = persona.manifest.name;
  const writes: PlannedWrite[] = [
    { kind: "cache", path: paths.personaCache(config, name, persona.manifest.version) },
    { kind: "symlink", path: paths.currentLink(config, name) },
    { kind: "agent", path: paths.claudeAgent(config, name) },
  ];
  for (const s of persona.manifest.skills) {
    writes.push({ kind: "skill", path: paths.claudeSkillDir(config, name, skillLeaf(s)) });
  }
  if (projectRoot) {
    writes.push({ kind: "symlink", path: paths.projectCoreLink(projectRoot, name) });
    writes.push({ kind: "instance", path: paths.projectMandate(projectRoot, name) });
    writes.push({ kind: "lock", path: paths.projectLock(projectRoot) });
    writes.push({ kind: "gitignore", path: join(projectRoot, ".gitignore") });
  }
  return writes;
}

/**
 * Install a persona — THE programmatic entry point. The CLI is a thin adapter over this.
 * Pure of process concerns (no console, no exit, no interactive I/O); throws `TruecastError`.
 */
export async function install(opts: InstallOptions, ctx: Ctx = {}): Promise<InstallResult> {
  if (opts.as) {
    throw new TruecastError(
      "NOT_IMPLEMENTED",
      "--as (rename on install) is not wired yet",
      "omit --as",
    );
  }
  const config = ctx.config ?? resolveConfig();
  const parsed = parseSource(opts.source);
  const fetched = await fetchSource(parsed, config.tmpRoot);
  try {
    const persona = loadPersona(fetched.dir);
    const projectRoot = opts.global
      ? null
      : locateProject({ cwd: opts.cwd ?? process.cwd(), project: opts.project });

    const plan = InstallPlan.parse({
      persona: persona.manifest.name,
      source: parsed.url,
      version: persona.manifest.version,
      commit: fetched.commit,
      projectRoot,
      tools: persona.manifest.tools ?? [],
      writes: planWrites(persona, projectRoot, config),
    });

    if (opts.dryRun) return { plan, applied: false };
    const confirm = ctx.confirm ?? ((): boolean => true);
    if (!(await confirm(plan))) return { plan, applied: false };

    const ledger = await Ledger.load(config);
    const cached = cacheCandidate(persona, config, ledger); // validate + cache (no promote yet)
    materialize(cached, persona, config, ledger); // build the surface from the cached version
    promoteCurrent(cached.name, cached.version, config, ledger); // re-point current LAST (RR1)
    writeMeta(
      config,
      cached.name,
      upsertVersion(readMeta(config, cached.name), parsed.url, cached.version, fetched.commit),
      ledger,
    );
    if (projectRoot) {
      attachPersona({
        root: projectRoot,
        cached,
        persona,
        source: parsed.url,
        commit: fetched.commit,
        config,
      });
    }
    await ledger.save();
    ctx.logger?.info({ persona: cached.name, version: cached.version }, "installed");
    return { plan, applied: true };
  } finally {
    await fetched.dispose();
  }
}
