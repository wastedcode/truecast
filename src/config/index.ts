import { homedir, tmpdir } from "node:os";
import { join } from "node:path";

/**
 * Single owner of "where things live". No other module hardcodes a path —
 * they take `Config` by injection and derive sub-paths via `paths`.
 */
export interface Config {
  /** Global truecast home: cache, manifest, proposals. */
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
  personaCache: (c: Config, name: string, ver: string): string =>
    join(c.truecastHome, "personas", name, ver, "core"),
  /** The `current → <ver>` pointer (update-once re-points this). */
  currentLink: (c: Config, name: string): string =>
    join(c.truecastHome, "personas", name, "current"),
  /** The resolved core dir a project symlink targets: `current/core`. */
  currentCore: (c: Config, name: string): string =>
    join(c.truecastHome, "personas", name, "current", "core"),
  manifest: (c: Config): string => join(c.truecastHome, "manifest.json"),
  proposals: (c: Config, name: string): string => join(c.truecastHome, "proposals", name),

  // --- generated ergonomic surface (managed, ledger-tracked) ---
  claudeAgent: (c: Config, name: string): string => join(c.claudeHome, "agents", `${name}.md`),
  claudeSkillDir: (c: Config, name: string, skill: string): string =>
    join(c.claudeHome, "skills", `${name}-${skill}`),

  // --- per-project (committed in the repo) ---
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
