import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import isPathInside from "is-path-inside";
import { UnsafePathError } from "../errors.js";

const NUL = String.fromCharCode(0);

/**
 * Resolve `rel` against `baseDir` and guarantee the result stays inside the REAL base dir.
 * The AUTHORITATIVE path-safety boundary; the zod `RelPath` is only a syntactic pre-filter.
 * Defeats `..`, absolute paths, null bytes, and base-symlink trickery (the base is realpath'd).
 */
export function resolveContained(baseDir: string, rel: string): string {
  if (rel.includes(NUL)) throw new UnsafePathError(`null byte in path: ${JSON.stringify(rel)}`);
  if (isAbsolute(rel)) throw new UnsafePathError(`absolute path not allowed: ${rel}`);
  const realBase = realpathSync(baseDir);
  const target = resolve(realBase, rel);
  if (target !== realBase && !isPathInside(target, realBase)) {
    throw new UnsafePathError(`'${rel}' escapes its base directory`);
  }
  return target;
}

/** Is `p` a symlink? (false if it doesn't exist.) Shared so cache/attach don't each hand-roll it. */
export function isSymlink(p: string): boolean {
  try {
    return lstatSync(p).isSymbolicLink();
  } catch {
    return false;
  }
}

/** Assert a path is a regular file, NOT a symlink (lstat does not follow links). */
export function assertRegularFile(p: string): void {
  const st = lstatSync(p);
  if (st.isSymbolicLink()) throw new UnsafePathError(`symlink not allowed: ${p}`);
  if (!st.isFile()) throw new UnsafePathError(`not a regular file: ${p}`);
}

/**
 * Delete a managed path, but ONLY after proving it is contained in `base` (RR8 destroy-path safety).
 * A symlink is unlinked in place (never followed); a real file/dir is removed after a realpath
 * containment check, so a healed/hostile symlink can't redirect the delete outside `base`.
 */
export function removeContained(base: string, target: string): void {
  if (!existsSync(target) && !isSymlink(target)) return; // already gone — idempotent
  if (isSymlink(target)) {
    // the link itself must live inside base (don't follow it); unlink only.
    const realParent = realpathSync(dirname(target));
    if (realParent !== realpathSync(base) && !isPathInside(realParent, realpathSync(base))) {
      throw new UnsafePathError(`refusing to remove symlink outside base: ${target}`);
    }
    rmSync(target, { force: true });
    return;
  }
  const real = realpathSync(target);
  const realBase = realpathSync(base);
  if (real !== realBase && !isPathInside(real, realBase)) {
    throw new UnsafePathError(`refusing to remove path outside base: ${target}`);
  }
  rmSync(real, { recursive: true, force: true });
}

/** Recursive copy that REJECTS symlinks and special files — no symlink-escape into managed dirs. */
export function copyTreeNoSymlinks(src: string, dest: string): void {
  mkdirSync(dest, { recursive: true });
  for (const name of readdirSync(src)) {
    const s = join(src, name);
    const d = join(dest, name);
    const st = lstatSync(s);
    if (st.isSymbolicLink()) throw new UnsafePathError(`symlink not allowed: ${s}`);
    if (st.isDirectory()) copyTreeNoSymlinks(s, d);
    else if (st.isFile()) writeFileSync(d, readFileSync(s));
    else throw new UnsafePathError(`unsupported file type: ${s}`);
  }
}
