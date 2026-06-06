import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import writeFileAtomic from "write-file-atomic";
import type { Config } from "../config/index.js";
import { type Ledger, sha256 } from "../ledger/index.js";
import { PersonaMeta as MetaSchema, type PersonaMeta } from "../schema/index.js";

function metaPath(config: Config, name: string): string {
  return join(config.truecastHome, "personas", name, "meta.json");
}

/** Read the per-persona global record (source + cached versions). Parse-on-read; null if absent/invalid. */
export function readMeta(config: Config, name: string): PersonaMeta | null {
  const p = metaPath(config, name);
  if (!existsSync(p)) return null;
  const parsed = MetaSchema.safeParse(JSON.parse(readFileSync(p, "utf8")));
  return parsed.success ? parsed.data : null;
}

/** Write the per-persona record (validated, atomic, ledger-tracked). */
export async function writeMeta(
  config: Config,
  name: string,
  meta: PersonaMeta,
  ledger: Ledger,
): Promise<void> {
  const validated = MetaSchema.parse(meta);
  const p = metaPath(config, name);
  mkdirSync(dirname(p), { recursive: true });
  const json = JSON.stringify(validated, null, 2);
  await writeFileAtomic(p, json);
  ledger.record({ path: p, sha256: sha256(json), source: name, kind: "meta" });
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
