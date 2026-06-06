import { mkdirSync } from "node:fs";
import lockfile from "proper-lockfile";
import type { Config } from "../config/index.js";
import { TruecastError } from "../errors.js";

/**
 * Serialize mutations to the truecast home (R3). Every operation that writes the cache, the surface,
 * the `current` pointer, or the ledger runs inside `withHomeLock`, so two concurrent `truecast`
 * processes can never interleave (last-write-wins on the ledger) or race the pointer swap. One machine
 * only — this is a process lock, not a network lock.
 */
export async function withHomeLock<T>(config: Config, fn: () => Promise<T> | T): Promise<T> {
  mkdirSync(config.truecastHome, { recursive: true }); // the lock target must exist
  let release: (() => Promise<void>) | undefined;
  try {
    release = await lockfile.lock(config.truecastHome, {
      stale: 30_000, // a holder that dies is reclaimed after 30s
      retries: { retries: 10, factor: 1.5, minTimeout: 100, maxTimeout: 2_000 },
    });
  } catch (err) {
    throw new TruecastError(
      "BUSY",
      `another truecast process is operating on ${config.truecastHome}`,
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
