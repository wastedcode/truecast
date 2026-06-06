import { lstatSync, realpathSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import isPathInside from "is-path-inside";
import { UnsafePathError } from "../errors.js";

const NUL = String.fromCharCode(0);

/**
 * Resolve `rel` against `baseDir` and guarantee the result stays inside the REAL base dir.
 * This is the AUTHORITATIVE path-safety boundary; the zod `RelPath` is only a syntactic pre-filter.
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

/** Assert a path is a regular file, NOT a symlink (lstat does not follow links). Rejects source symlinks. */
export function assertRegularFile(p: string): void {
  const st = lstatSync(p);
  if (st.isSymbolicLink()) throw new UnsafePathError(`symlink not allowed: ${p}`);
  if (!st.isFile()) throw new UnsafePathError(`not a regular file: ${p}`);
}
