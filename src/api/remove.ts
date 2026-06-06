import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { type Config, paths, resolveConfig } from "../config/index.js";
import { TruecastError } from "../errors.js";
import { Ledger } from "../ledger/index.js";
import { locateProject } from "../locate/index.js";
import type { Logger } from "../log/index.js";
import { isSymlink, removeContained } from "../safety/index.js";
import { Lock as LockSchema, PersonaName } from "../schema/index.js";

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
  /** Required-consent gate for the destructive global path (R2). Default: auto-approve. */
  confirm?:
    | ((info: { name: string; global: true; dependentsWarning: string }) =>
        | boolean
        | Promise<boolean>)
    | undefined;
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
function removeFromProject(name: string, opts: RemoveOptions, ctx: RemoveCtx): RemoveResult {
  const root = locateProject({ cwd: opts.cwd ?? process.cwd(), project: opts.project });
  const agentDir = paths.projectAgentDir(root, name);
  const instanceDir = paths.projectInstanceDir(root, name);
  const base = join(root, ".truecast");

  if (!existsSync(agentDir) && !isSymlink(agentDir)) {
    throw new TruecastError(
      "NOT_ATTACHED",
      `"${name}" is not attached to ${root}.`,
      "Run 'truecast list --project' to see what's attached here.",
    );
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

  // drop the lock entry (read → delete → write).
  const lockPath = paths.projectLock(root);
  if (existsSync(lockPath)) {
    const lock = LockSchema.parse(JSON.parse(readFileSync(lockPath, "utf8")));
    if (name in lock.personas) {
      delete lock.personas[name];
      writeFileSync(lockPath, JSON.stringify(lock, null, 2));
    }
  }

  ctx.logger?.info({ persona: name, root, purge: !!opts.purge }, "detached");
  return { name, scope: "project", applied: true, removed, instancePreserved };
}

/** R2 — purge globally: cache + surface + meta + ledger rows. Warns about (un-enumerable) dependents. */
async function removeGlobal(name: string, config: Config, ctx: RemoveCtx): Promise<RemoveResult> {
  const ledger = await Ledger.load(config);
  const owned = ledger.ownedBy(name);
  if (owned.length === 0) {
    throw new TruecastError(
      "NOT_INSTALLED",
      `"${name}" is not installed globally.`,
      "Run 'truecast list' to see installed personas.",
    );
  }

  const dependentsWarning =
    "Projects tracking this persona will break next session (they cannot be enumerated).";
  const confirm = ctx.confirm ?? ((): boolean => true);
  if (!(await confirm({ name, global: true, dependentsWarning }))) {
    return { name, scope: "global", applied: false, removed: [] };
  }

  // Delete only ledger-owned paths, each containment-checked (RR8), then forget the row.
  const removed: string[] = [];
  for (const e of owned) {
    const base = e.kind === "agent" || e.kind === "skill" ? config.claudeHome : config.truecastHome;
    removeContained(base, e.path);
    ledger.forget(e.path);
    removed.push(e.path);
  }
  // sweep the now-empty persona dir (cache + meta + current all lived under it).
  removeContained(config.truecastHome, join(config.truecastHome, "personas", name));

  await ledger.save();
  ctx.logger?.warn({ persona: name }, "removed globally");
  return { name, scope: "global", applied: true, removed };
}
