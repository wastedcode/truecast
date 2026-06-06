import { type Config, resolveConfig } from "../config/index.js";
import { TruecastError } from "../errors.js";
import type { Logger } from "../log/index.js";
import type { InstallPlan } from "../schema/index.js";

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
}

/**
 * Injected context. Programmatic callers (Posse) supply their own; the CLI supplies pino + a prompt.
 * The library NEVER prompts, prints, or exits — `confirm` is the approval policy, owned by the caller.
 */
export interface Ctx {
  config?: Config | undefined;
  logger?: Logger | undefined;
  /**
   * Approval gate, called with the computed plan before any write.
   * Default: auto-approve (a programmatic caller has already consented by calling `install`).
   * The CLI passes an interactive prompt; Posse passes its own policy.
   */
  confirm?: ((plan: InstallPlan) => boolean | Promise<boolean>) | undefined;
}

export interface InstallResult {
  plan: InstallPlan;
  /** Whether the plan was applied (false for `dryRun` or a declined `confirm`). */
  applied: boolean;
}

/**
 * Install a persona — THE programmatic entry point. The CLI is a thin adapter over this.
 * Pure of process concerns (no console, no process.exit, no interactive I/O); throws `TruecastError`.
 */
export async function install(opts: InstallOptions, ctx: Ctx = {}): Promise<InstallResult> {
  const config = ctx.config ?? resolveConfig();
  // Walking skeleton lands here:
  //   parseSource → fetch → persona(validate) → cache → locate → attach → materialize,
  //   building an InstallPlan, calling ctx.confirm(plan) (default auto), then executing via the ledger.
  void config;
  void opts;
  throw new TruecastError(
    "NOT_IMPLEMENTED",
    "install orchestration is not wired up yet",
    "the walking skeleton is the next build step",
  );
}
