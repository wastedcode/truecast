import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { NoProjectError } from "../errors.js";

/**
 * Resolve the project root to attach a persona to: explicit `--project`, else the nearest ancestor that
 * is a git repository (`.git`), else error.
 *
 * Why the git root and not the cwd: `install` writes `.truecast/` where the *running agent* will read it.
 * A Claude Code subagent resolves its `.truecast/agents/<name>/…` path relative to wherever `claude` was
 * launched — normally the repo root — so the attachment must live at that same stable boundary, not at
 * whatever subdirectory you happened to run `install` from.
 *
 * We deliberately do NOT treat a `.truecast/` directory as a discovery marker. The global home is
 * `~/.truecast`, so that rule made it shadow every not-yet-attached project run from under $HOME (it would
 * "escape" up to the home dir). A non-git project — or a single package inside a monorepo — is addressed
 * with explicit `--project <path>`.
 */
export function locateProject(opts: { cwd: string; project?: string | undefined }): string {
  if (opts.project) return resolve(opts.project);

  let dir = resolve(opts.cwd);
  for (;;) {
    if (existsSync(join(dir, ".git"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new NoProjectError();
}
