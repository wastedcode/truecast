import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { NoProjectError } from "../errors.js";

/**
 * Resolve the project root — the SAME rule the runtime agent uses, so they always agree:
 * explicit `--project`, else the nearest ancestor with `.truecast/`, else the git root.
 */
export function locateProject(opts: { cwd: string; project?: string | undefined }): string {
  if (opts.project) return resolve(opts.project);

  let dir = resolve(opts.cwd);
  let gitRoot: string | null = null;
  for (;;) {
    if (existsSync(join(dir, ".truecast"))) return dir;
    if (gitRoot === null && existsSync(join(dir, ".git"))) gitRoot = dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  if (gitRoot) return gitRoot;
  throw new NoProjectError();
}
