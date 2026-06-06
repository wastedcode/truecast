import { existsSync, readFileSync } from "node:fs";
import { type Config, paths } from "../config/index.js";
import { MetaCorruptError } from "../errors.js";
import type { Ledger } from "../ledger/index.js";
import { PersonaMeta as MetaSchema, type PersonaMeta } from "../schema/index.js";

/**
 * Read the per-persona global record (source + cached versions). Returns null only when the file is
 * ABSENT (not installed); a present-but-unparseable record throws (R7) so it can never be mistaken for
 * "not installed". `list`/`doctor` catch it and surface it distinctly.
 */
export function readMeta(config: Config, name: string): PersonaMeta | null {
  const p = paths.metaFile(config, name);
  if (!existsSync(p)) return null;
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(p, "utf8"));
  } catch (err) {
    throw new MetaCorruptError(p, err instanceof Error ? err.message : String(err));
  }
  const parsed = MetaSchema.safeParse(raw);
  if (!parsed.success) {
    throw new MetaCorruptError(p, parsed.error.issues.map((i) => i.message).join("; "));
  }
  return parsed.data;
}

/** Write the per-persona record (validated, atomic, ledger-tracked). */
export function writeMeta(config: Config, name: string, meta: PersonaMeta, ledger: Ledger): void {
  const validated = MetaSchema.parse(meta);
  ledger.writeFile(
    paths.metaFile(config, name),
    `${JSON.stringify(validated, null, 2)}\n`,
    "meta",
    name,
  );
}

/** Record `source` + add `{ver, commit}` (if new) — returns the updated meta to be written. */
export function upsertVersion(
  prev: PersonaMeta | null,
  source: string,
  ver: string,
  commit: string,
): PersonaMeta {
  const versions = prev ? [...prev.versions] : [];
  if (!versions.some((v) => v.ver === ver)) versions.push({ ver, commit });
  return { source, versions };
}
