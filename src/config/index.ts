import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import type { LedgerEntry } from "../schema/index.js";

/** The kinds of managed entry the ledger tracks. */
export type ManagedKind = LedgerEntry["kind"];

/**
 * Single owner of "where things live". No other module hardcodes a path —
 * they take `Config` by injection and derive sub-paths via `paths`.
 */
export interface Config {
  /** Global truecast home: per-persona cache, ledgers, proposals. */
  readonly truecastHome: string;
  /** Claude Code home: the generated ergonomic surface lives here. */
  readonly claudeHome: string;
  /** Root for temp scratch (fetch clones, atomic staging). */
  readonly tmpRoot: string;
}

export interface ConfigEnv {
  TRUECAST_HOME?: string | undefined;
  CLAUDE_HOME?: string | undefined;
  TMPDIR?: string | undefined;
}

/** Resolve config from environment + home dir. Pure; pass `env` in tests. */
export function resolveConfig(env: ConfigEnv = process.env, home: string = homedir()): Config {
  return Object.freeze({
    truecastHome: env.TRUECAST_HOME ?? join(home, ".truecast"),
    claudeHome: env.CLAUDE_HOME ?? join(home, ".claude"),
    tmpRoot: env.TMPDIR ?? tmpdir(),
  });
}

/** Well-known sub-paths derived from Config — the one place the on-disk layout is defined. */
export const paths = {
  // --- global cache (the one real copy of a persona's core, versioned) ---
  /** Root that holds every installed persona's dir. */
  personasRoot: (c: Config): string => join(c.truecastHome, "personas"),
  /** A single persona's dir (holds `<ver>/`, `current`, `meta.json`). */
  personaDir: (c: Config, name: string): string => join(c.truecastHome, "personas", name),
  /** The per-persona global record (source + cached versions). */
  metaFile: (c: Config, name: string): string =>
    join(c.truecastHome, "personas", name, "meta.json"),
  /** The per-persona ownership ledger (the paths truecast owns for this persona; clobber/drift guard). */
  ledgerFile: (c: Config, name: string): string =>
    join(c.truecastHome, "personas", name, "owned.json"),
  personaCache: (c: Config, name: string, ver: string): string =>
    join(c.truecastHome, "personas", name, ver, "core"),
  /** The `current → <ver>` pointer (update-once re-points this). */
  currentLink: (c: Config, name: string): string =>
    join(c.truecastHome, "personas", name, "current"),
  /** The resolved core dir a project symlink targets: `current/core`. */
  currentCore: (c: Config, name: string): string =>
    join(c.truecastHome, "personas", name, "current", "core"),
  proposals: (c: Config, name: string): string => join(c.truecastHome, "proposals", name),

  // --- generated ergonomic surface (managed, ledger-tracked) ---
  // The `@subagent` file. Skills/knowledge are NOT a generated surface — they're core files the
  // persona Reads on demand (the `agent.md` body indexes them). The "skill" ledger kind remains only
  // so `materialize` can sweep copies a pre-0.x version left in ~/.claude/skills.
  claudeAgent: (c: Config, name: string): string => join(c.claudeHome, "agents", `${name}.md`),

  // --- per-project (committed in the repo) ---
  /** The project's truecast dir — the containment base for project-scoped writes/removes. */
  projectTruecastDir: (projectRoot: string): string => join(projectRoot, ".truecast"),
  projectAgentDir: (projectRoot: string, name: string): string =>
    join(projectRoot, ".truecast", "agents", name),
  /** The `core` symlink inside the assembled dir (→ currentCore; gitignored). */
  projectCoreLink: (projectRoot: string, name: string): string =>
    join(projectRoot, ".truecast", "agents", name, "core"),
  projectInstanceDir: (projectRoot: string, name: string): string =>
    join(projectRoot, ".truecast", "agents", name, "instance"),
  projectMandate: (projectRoot: string, name: string): string =>
    join(projectRoot, ".truecast", "agents", name, "instance", "mandate.md"),
  projectWork: (projectRoot: string, name: string): string =>
    join(projectRoot, ".truecast", "agents", name, "instance", "work.md"),
  projectLock: (projectRoot: string): string => join(projectRoot, ".truecast", "lock"),
} as const;

/**
 * Per-kind layout facts — the SINGLE owner of "which root holds this kind" and "is it a dir".
 * Both the ledger (drift = file-hash vs tree-hash) and `remove` (which base to delete under) read here,
 * so the knowledge never diverges across modules.
 */
const KIND: Record<ManagedKind, { root: "claude" | "truecast"; dir: boolean }> = {
  agent: { root: "claude", dir: false },
  skill: { root: "claude", dir: true },
  cache: { root: "truecast", dir: true },
  symlink: { root: "truecast", dir: false },
  meta: { root: "truecast", dir: false },
};

/** The home a managed `kind` lives under — the containment base for writing/removing it. */
export function rootForKind(c: Config, kind: ManagedKind): string {
  return KIND[kind].root === "claude" ? c.claudeHome : c.truecastHome;
}

/** Whether a managed `kind` is a directory tree (hashed whole) vs a single file. */
export function isDirKind(kind: ManagedKind): boolean {
  return KIND[kind].dir;
}
