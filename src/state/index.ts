import { existsSync, readdirSync, readlinkSync, statSync } from "node:fs";
import { join } from "node:path";
import semver from "semver";
import { type Config, paths } from "../config/index.js";
import { PersonaName } from "../schema/index.js";

/**
 * Read-only resolution of on-disk truecast state (the symlink is the source of truth, D1).
 * Pure queries — no module here writes. update/list/remove read through these.
 */

/** Every persona DIR on disk (valid name), regardless of meta validity — what `doctor` sweeps. */
export function personaDirs(config: Config): string[] {
  const base = paths.personasRoot(config);
  if (!existsSync(base)) return [];
  return readdirSync(base)
    .filter((name) => PersonaName.safeParse(name).success && existsSync(join(base, name)))
    .sort();
}

/** Installed persona names = subdirs of `personas/` that hold a `meta.json` (a valid install record). */
export function installedPersonas(config: Config): string[] {
  const base = paths.personasRoot(config);
  if (!existsSync(base)) return [];
  const names: string[] = [];
  for (const name of readdirSync(base).sort()) {
    if (!PersonaName.safeParse(name).success) continue; // ignore stray entries
    if (existsSync(paths.metaFile(config, name))) names.push(name);
  }
  return names;
}

/**
 * The version a persona currently RUNS at globally = the target of the `current` symlink, but only if
 * it actually resolves to a directory. Returns null when there is no link or it dangles (broken).
 */
export function runningVersion(config: Config, name: string): string | null {
  const link = paths.currentLink(config, name);
  let target: string;
  try {
    target = readlinkSync(link); // relative version string, e.g. "1.2.0"
  } catch {
    return null; // no current link
  }
  const core = paths.currentCore(config, name);
  try {
    if (!statSync(core).isDirectory()) return null; // resolves but not a dir
  } catch {
    return null; // dangling link
  }
  return target;
}

/** The newest cached version recorded in meta (max by semver), or null if none. */
export function latestCached(versions: readonly { ver: string }[]): string | null {
  const sorted = versions.map((v) => v.ver).sort(semver.rcompare);
  return sorted[0] ?? null;
}

/**
 * Versions actually present on disk for a persona (a `<ver>/core/persona.toml` exists), newest first.
 * Read from the filesystem — robust when `meta.json` is missing or corrupt (used by `doctor`).
 */
export function cachedVersions(config: Config, name: string): string[] {
  const dir = paths.personaDir(config, name);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((v) => semver.valid(v) !== null && existsSync(join(dir, v, "core", "persona.toml")))
    .sort(semver.rcompare);
}
