import { createHash } from "node:crypto";
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import writeFileAtomic from "write-file-atomic";
import { type Config, paths } from "../config/index.js";
import { CollisionError, DriftError } from "../errors.js";
import { type LedgerEntry, Ledger as LedgerSchema } from "../schema/index.js";

const NUL = String.fromCharCode(0);

export function sha256(data: string | Buffer): string {
  return createHash("sha256").update(data).digest("hex");
}

/** Deterministic hash of a directory tree (sorted relpath + content) for drift detection. */
export function sha256Tree(dir: string): string {
  const h = createHash("sha256");
  const walk = (d: string, prefix: string): void => {
    for (const name of readdirSync(d).sort()) {
      const p = join(d, name);
      const rel = prefix ? `${prefix}/${name}` : name;
      const st = lstatSync(p);
      if (st.isDirectory()) walk(p, rel);
      else h.update(rel).update(NUL).update(readFileSync(p)).update(NUL);
    }
  };
  walk(dir, "");
  return h.digest("hex");
}

/**
 * The bookkeeping ledger + clobber guard — the single chokepoint that makes managed writes safe:
 * truecast touches ONLY paths it owns, and a drifted (hand-edited) managed file is detectable.
 */
export class Ledger {
  private readonly entries = new Map<string, LedgerEntry>();
  constructor(private readonly config: Config) {}

  static async load(config: Config): Promise<Ledger> {
    const l = new Ledger(config);
    const p = paths.manifest(config);
    if (existsSync(p)) {
      const parsed = LedgerSchema.safeParse(JSON.parse(readFileSync(p, "utf8")));
      if (parsed.success) for (const e of parsed.data.entries) l.entries.set(e.path, e);
    }
    return l;
  }

  owns(path: string): boolean {
    return this.entries.has(path);
  }

  /**
   * Has an owned managed file/dir been hand-edited since truecast wrote it? (RR2 — real drift
   * detection, so re-materialize can warn instead of silently clobbering; B1/AC3.) Symlinks are
   * not content and are not drift-checked.
   */
  isDrifted(path: string): boolean {
    const e = this.entries.get(path);
    if (!e) return false;
    if (e.kind === "symlink") return false;
    if (!existsSync(path)) return true;
    const isDir = e.kind === "cache" || e.kind === "skill";
    const current = isDir ? sha256Tree(path) : sha256(readFileSync(path));
    return current !== e.sha256;
  }

  /** Refuse to clobber a path that exists but truecast does not own (B5 — never silently shadow). */
  guard(path: string, sourceLabel: string): void {
    if (existsSync(path) && !this.owns(path)) {
      throw new CollisionError(path, `un-managed file already there (${sourceLabel})`);
    }
  }

  record(entry: LedgerEntry): void {
    this.entries.set(entry.path, entry);
  }

  /** Drop an entry from the ledger (after the path it tracked has been deleted; for `remove`). */
  forget(path: string): void {
    this.entries.delete(path);
  }

  /** Every managed path owned on behalf of `source` (a persona name) — what `remove --global` deletes. */
  ownedBy(source: string): LedgerEntry[] {
    return [...this.entries.values()].filter((e) => e.source === source);
  }

  /** Gate a managed write: refuse to clobber an un-owned file (B5) or a hand-edited owned one (B1). */
  assertWritable(path: string, source: string): void {
    this.guard(path, source);
    if (this.owns(path) && this.isDrifted(path)) throw new DriftError(path);
  }

  /** The single managed-FILE write path: gate → atomic write → record. */
  writeFile(path: string, data: string, kind: LedgerEntry["kind"], source: string): void {
    this.assertWritable(path, source);
    mkdirSync(dirname(path), { recursive: true });
    writeFileAtomic.sync(path, data);
    this.record({ path, sha256: sha256(data), source, kind });
  }

  /** Record a managed DIRECTORY the caller has (re)written, by its tree hash. */
  recordDir(path: string, kind: LedgerEntry["kind"], source: string): void {
    this.record({ path, sha256: sha256Tree(path), source, kind });
  }

  async save(): Promise<void> {
    const data = { version: 1 as const, entries: [...this.entries.values()] };
    const p = paths.manifest(this.config);
    await mkdir(dirname(p), { recursive: true });
    await writeFileAtomic(p, JSON.stringify(data, null, 2));
  }
}
