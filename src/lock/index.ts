import { existsSync, readFileSync } from "node:fs";
import writeFileAtomic from "write-file-atomic";
import { paths } from "../config/index.js";
import { LockCorruptError } from "../errors.js";
import { type Lock, type LockEntry, Lock as LockSchema } from "../schema/index.js";

/**
 * The ONLY owner of a project's committed `.truecast/lock`. attach/list/remove route through here so
 * the parse-validate-merge-write logic exists once, and a corrupt lock surfaces as a typed error
 * (R6) instead of a raw ZodError leaking to the user.
 */

const empty = (): Lock => ({ version: 1, personas: {} });

/** Read + validate the lock (untrusted: it is committed and re-read every run, RR6). Empty if absent. */
export function readLock(projectRoot: string): Lock {
  const p = paths.projectLock(projectRoot);
  if (!existsSync(p)) return empty();
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(p, "utf8"));
  } catch (err) {
    throw new LockCorruptError(p, err instanceof Error ? err.message : String(err));
  }
  const parsed = LockSchema.safeParse(raw);
  if (!parsed.success) {
    throw new LockCorruptError(p, parsed.error.issues.map((i) => i.message).join("; "));
  }
  return parsed.data;
}

/** The personas attached in this project, as `[name, entry]` pairs. */
export function readEntries(projectRoot: string): [string, LockEntry][] {
  return Object.entries(readLock(projectRoot).personas);
}

function write(projectRoot: string, lock: Lock): void {
  writeFileAtomic.sync(paths.projectLock(projectRoot), `${JSON.stringify(lock, null, 2)}\n`);
}

/** Add or replace a persona's lock entry (read → merge → atomic write). */
export function upsertEntry(projectRoot: string, name: string, entry: LockEntry): void {
  const lock = readLock(projectRoot);
  lock.personas[name] = entry;
  write(projectRoot, lock);
}

/** Drop a persona's lock entry, if present. Returns whether anything was removed. */
export function removeEntry(projectRoot: string, name: string): boolean {
  const lock = readLock(projectRoot);
  if (!(name in lock.personas)) return false;
  delete lock.personas[name];
  write(projectRoot, lock);
  return true;
}
