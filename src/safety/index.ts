import {
  closeSync,
  existsSync,
  constants as fsConstants,
  lstatSync,
  mkdirSync,
  openSync,
  readdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
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

/**
 * Atomically (re)point a symlink: create it under a temp name in the same dir, then `rename` over the
 * target. `rename` is atomic on POSIX, so there is no window where the link is missing (defeats R4: a
 * crash mid-swap can never leave a dangling pointer). The single owner of symlink creation.
 */
export function atomicSymlink(target: string, linkPath: string): void {
  mkdirSync(dirname(linkPath), { recursive: true });
  const tmp = `${linkPath}.tmp-${process.pid}`;
  rmSync(tmp, { force: true });
  symlinkSync(target, tmp);
  renameSync(tmp, linkPath); // atomic replace
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

/**
 * Write `content` to `base/rel`, refusing to FOLLOW a symlink anywhere in the path. `resolveContained`
 * proves the target is logically inside `base`, but a plain `writeFileSync` still follows a symlink planted
 * at an output component — a cloned hostile repo can ship `personas/<name>/agents` (or the leaf file, or a
 * repo-root dir) as a symlink to `~/.ssh` / `.git/hooks` / a dotfile, and the write lands THERE, outside the
 * repo and invisible in the diff. So: reject a symlink at every existing component from `base` down, then
 * open the leaf `O_NOFOLLOW` to close the create-time race. The single owner of "write a managed file under
 * a base"; callers that generate committed output must use this, not bare `writeFileSync`.
 */
export function writeContained(base: string, rel: string, content: string): void {
  const target = resolveContained(base, rel); // string-containment + base realpath
  const realBase = realpathSync(base);
  // reject a symlink at any EXISTING component between base and the leaf (intermediate dirs + the leaf)
  let cur = realBase;
  for (const part of relative(realBase, target).split(sep).filter(Boolean)) {
    cur = join(cur, part);
    if (isSymlink(cur)) throw new UnsafePathError(`refusing to write through a symlink: ${cur}`);
  }
  mkdirSync(dirname(target), { recursive: true }); // components proven non-symlink above
  // O_NOFOLLOW: fail (ELOOP) if the leaf is/becomes a symlink — closes the check→write race.
  // (?? 0 keeps this safe where the platform lacks the flag; the component walk above still blocks the
  // demonstrated clone-time planted-symlink attack.)
  const flags =
    fsConstants.O_WRONLY |
    fsConstants.O_CREAT |
    fsConstants.O_TRUNC |
    (fsConstants.O_NOFOLLOW ?? 0);
  const fd = openSync(target, flags, 0o644);
  try {
    writeFileSync(fd, content);
  } finally {
    closeSync(fd);
  }
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
