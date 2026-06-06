import { existsSync, lstatSync, mkdirSync, renameSync, rmSync, symlinkSync } from "node:fs";
import { dirname } from "node:path";
import { type Config, paths } from "../config/index.js";
import { type Ledger, sha256, sha256Tree } from "../ledger/index.js";
import type { Persona } from "../persona/index.js";
import { copyTreeNoSymlinks } from "../safety/index.js";

export interface CachedPersona {
  name: string;
  version: string;
  /** The cached core dir: `~/.truecast/personas/<name>/<ver>/core`. */
  coreDir: string;
}

function isSymlink(p: string): boolean {
  try {
    return lstatSync(p).isSymbolicLink();
  } catch {
    return false;
  }
}

/** Copy a validated core into the global cache (atomic, symlink-safe, idempotent) + point `current`. */
export function cachePersona(persona: Persona, config: Config, ledger: Ledger): CachedPersona {
  const { name, version } = persona.manifest;
  const dest = paths.personaCache(config, name, version); // .../<ver>/core

  if (!(existsSync(dest) && ledger.owns(dest))) {
    mkdirSync(dirname(dest), { recursive: true }); // .../<ver>
    const staging = `${dest}.staging-${process.pid}`;
    rmSync(staging, { recursive: true, force: true });
    copyTreeNoSymlinks(persona.coreDir, staging); // rejects symlinks in the source
    if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
    renameSync(staging, dest); // same-dir rename → atomic, no EXDEV
    ledger.record({ path: dest, sha256: sha256Tree(dest), source: name, kind: "cache" });
  }

  const current = paths.currentLink(config, name); // personas/<name>/current
  if (existsSync(current) || isSymlink(current)) rmSync(current, { force: true });
  symlinkSync(version, current); // relative target → current/core resolves to <ver>/core
  ledger.record({ path: current, sha256: sha256(version), source: name, kind: "symlink" });

  return { name, version, coreDir: dest };
}
