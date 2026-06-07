import { existsSync } from "node:fs";
import { type Config, paths, resolveConfig } from "../config/index.js";
import { TruecastError } from "../errors.js";
import { Ledger } from "../ledger/index.js";
import { locateProject } from "../locate/index.js";
import { removeEntry } from "../lock/index.js";
import type { Logger } from "../log/index.js";
import { isSymlink, removeContained } from "../safety/index.js";
import { PersonaName } from "../schema/index.js";
import { type Confirm, defaultConsent } from "./consent.js";

export interface RemoveOptions {
  name: string;
  /** Remove globally (cache + ~/.claude surface + meta + ledger) instead of just detaching here. */
  global?: boolean | undefined;
  /** When detaching: also delete the project `instance/` (your edits). Default: preserve it (R1). */
  purge?: boolean | undefined;
  /** Attach/detach against this project root instead of discovering one. */
  project?: string | undefined;
  cwd?: string | undefined;
}

export interface RemoveCtx {
  config?: Config | undefined;
  logger?: Logger | undefined;
  /** Consent gate (only the destructive `--global` path asks). Default: DENY (must opt in, R8). */
  confirm?: Confirm | undefined;
}

export interface RemoveResult {
  name: string;
  scope: "project" | "global";
  applied: boolean;
  /** Paths actually removed. */
  removed: string[];
  /** Set when the project `instance/` was preserved (orphaned) rather than deleted. */
  instancePreserved?: string | undefined;
}

/** Remove a persona — detach from a project (default) or purge it globally (`--global`). */
export async function remove(opts: RemoveOptions, ctx: RemoveCtx = {}): Promise<RemoveResult> {
  const name = PersonaName.parse(opts.name); // RR8: validate the name before any destroy path
  const config = ctx.config ?? resolveConfig();
  return opts.global ? removeGlobal(name, config, ctx) : removeFromProject(name, opts, ctx);
}

/** R1 — detach from a project: drop the core symlink + lock entry; PRESERVE `instance/` unless `--purge`. */
async function removeFromProject(
  name: string,
  opts: RemoveOptions,
  ctx: RemoveCtx,
): Promise<RemoveResult> {
  const root = locateProject({ cwd: opts.cwd ?? process.cwd(), project: opts.project });
  const agentDir = paths.projectAgentDir(root, name);
  const instanceDir = paths.projectInstanceDir(root, name);
  const base = paths.projectTruecastDir(root); // project files aren't ledger-owned; contain deletes here

  if (!existsSync(agentDir) && !isSymlink(agentDir)) {
    throw new TruecastError(
      "NOT_ATTACHED",
      `"${name}" is not attached to ${root}.`,
      "Run 'truecast list --project' to see what's attached here.",
    );
  }

  const confirm = ctx.confirm ?? defaultConsent; // detaching alters the project — gate it (default: approve detach, deny --purge)
  if (!(await confirm({ kind: "remove-project", persona: name, root, purge: !!opts.purge }))) {
    return { name, scope: "project", applied: false, removed: [] };
  }

  const removed: string[] = [];
  let instancePreserved: string | undefined;

  if (opts.purge) {
    removeContained(base, agentDir); // delete the whole assembled dir, instance included
    removed.push(agentDir);
  } else {
    // detach: remove only the core symlink, leaving instance/ orphaned (the user's work survives, B2).
    removeContained(base, paths.projectCoreLink(root, name));
    removed.push(paths.projectCoreLink(root, name));
    if (existsSync(instanceDir)) instancePreserved = instanceDir;
  }

  removeEntry(root, name); // the lock/ module owns the lock mutation
  ctx.logger?.info({ persona: name, root, purge: !!opts.purge }, "detached");
  return { name, scope: "project", applied: true, removed, instancePreserved };
}

/** R2 — purge globally: cache + surface + meta + ledger rows. Warns about (un-enumerable) dependents. */
async function removeGlobal(name: string, config: Config, ctx: RemoveCtx): Promise<RemoveResult> {
  const dependentsWarning =
    "Projects tracking this persona will break next session (they cannot be enumerated).";
  const confirm = ctx.confirm ?? defaultConsent; // destructive ⇒ deny unless explicitly approved (R8)

  return Ledger.transaction(config, name, async (ledger) => {
    const owned = ledger.owned();
    if (owned.length === 0) {
      throw new TruecastError(
        "NOT_INSTALLED",
        `"${name}" is not installed globally.`,
        "Run 'truecast list' to see installed personas.",
      );
    }
    if (!(await confirm({ kind: "remove-global", persona: name, dependentsWarning }))) {
      return { name, scope: "global", applied: false, removed: [] };
    }

    // Delete only ledger-owned paths (each containment-checked + forgotten by the ledger, RR8).
    const removed: string[] = [];
    for (const e of owned) {
      ledger.removeOwned(e.path);
      removed.push(e.path);
    }
    // sweep the now-empty persona dir (cache + meta + current all lived under it).
    removeContained(config.truecastHome, paths.personaDir(config, name));

    ctx.logger?.warn({ persona: name }, "removed globally");
    return { name, scope: "global", applied: true, removed };
  });
}
