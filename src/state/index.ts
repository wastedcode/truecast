import { existsSync, readdirSync, readlinkSync, statSync } from "node:fs";
import { join } from "node:path";
import semver from "semver";
import { type Config, paths } from "../config/index.js";
import { PersonaName } from "../schema/index.js";

/**
 * Read-only resolution of on-disk truecast state (the symlink is the source of truth, D1).
 * Pure queries — no module here writes. update/list/remove read through these.
 */

/** Installed persona names = subdirs of `personas/` that hold a `meta.json` (a valid install record). */
export function installedPersonas(config: Config): string[] {
  const base = join(config.truecastHome, "personas");
  if (!existsSync(base)) return [];
  const names: string[] = [];
  for (const name of readdirSync(base).sort()) {
    if (!PersonaName.safeParse(name).success) continue; // ignore stray entries
    if (existsSync(join(base, name, "meta.json"))) names.push(name);
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
