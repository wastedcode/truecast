import { mkdirSync } from "node:fs";
import lockfile from "proper-lockfile";
import { type Config, paths } from "../config/index.js";
import { TruecastError } from "../errors.js";

/**
 * Serialize mutations to a SINGLE persona (R3). Each persona is fully namespaced — its cache, its
 * `current` pointer, its `~/.claude` surface, and its own ledger all live under paths derived from its
 * name — so two different personas never share mutable state and run fully concurrently. Same-persona
 * operations serialize on this lock. One machine only (a process lock, not a network lock).
 */
export async function withPersonaLock<T>(
  config: Config,
  persona: string,
  fn: () => Promise<T> | T,
): Promise<T> {
  const dir = paths.personaDir(config, persona);
  mkdirSync(dir, { recursive: true }); // the lock target must exist
  let release: (() => Promise<void>) | undefined;
  try {
    release = await lockfile.lock(dir, {
      stale: 30_000, // a holder that dies is reclaimed after 30s
      retries: { retries: 10, factor: 1.5, minTimeout: 100, maxTimeout: 2_000 },
    });
  } catch (err) {
    throw new TruecastError(
      "BUSY",
      `another truecast process is operating on persona "${persona}"`,
      "Wait for it to finish, then retry.",
      { cause: err },
    );
  }
  try {
    return await fn();
  } finally {
    await release();
  }
}
