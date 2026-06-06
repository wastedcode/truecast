import { existsSync, mkdirSync, realpathSync, renameSync, rmSync } from "node:fs";
import { dirname } from "node:path";
import isPathInside from "is-path-inside";
import { type Config, paths } from "../config/index.js";
import { UnsafePathError } from "../errors.js";
import { type Ledger, sha256 } from "../ledger/index.js";
import type { Persona } from "../persona/index.js";
import { atomicSymlink, copyTreeNoSymlinks } from "../safety/index.js";

export interface CachedPersona {
  name: string;
  version: string;
  /** The cached core dir: `~/.truecast/personas/<name>/<ver>/core`. */
  coreDir: string;
}

/**
 * Copy a VALIDATED core into the global cache (atomic, symlink-safe, idempotent). Does NOT touch
 * `current` — promotion is a separate, guarded step so an unvalidated version can never become current.
 */
export function cacheCandidate(persona: Persona, config: Config, ledger: Ledger): CachedPersona {
  const { name, version } = persona.manifest;
  const dest = paths.personaCache(config, name, version); // .../<ver>/core
  if (!(existsSync(dest) && ledger.owns(dest) && !ledger.isDrifted(dest))) {
    ledger.guard(dest, name); // an un-owned cache dir already there ⇒ collision (don't clobber)
    mkdirSync(dirname(dest), { recursive: true });
    const staging = `${dest}.staging-${process.pid}`;
    rmSync(staging, { recursive: true, force: true });
    copyTreeNoSymlinks(persona.coreDir, staging); // rejects symlinks in the source
    if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
    renameSync(staging, dest); // same-dir rename → atomic, no EXDEV (rebuilt from source on drift)
    ledger.recordDir(dest, "cache", name);
  }
  return { name, version, coreDir: dest };
}

/**
 * Re-point `current → <ver>` — ONLY after the version is cached, ledger-owned, and realpath-contained
 * (RR1: no TOCTOU promotion of unvalidated content). Call this LAST, after the surface is materialized.
 */
export function promoteCurrent(
  name: string,
  version: string,
  config: Config,
  ledger: Ledger,
): void {
  const cacheCore = paths.personaCache(config, name, version);
  if (!(existsSync(cacheCore) && ledger.owns(cacheCore))) {
    throw new UnsafePathError(
      `refusing to promote unvalidated/un-owned version ${name}@${version}`,
    );
  }
  if (!isPathInside(realpathSync(cacheCore), realpathSync(config.truecastHome))) {
    throw new UnsafePathError(`cache for ${name}@${version} is outside truecastHome`);
  }
  const current = paths.currentLink(config, name);
  atomicSymlink(version, current); // relative target → current/core resolves to <ver>/core (atomic swap)
  ledger.record({ path: current, sha256: sha256(version), source: name, kind: "symlink" });
}
