import { createHash } from "node:crypto";
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import writeFileAtomic from "write-file-atomic";
import { withHomeLock } from "../concurrency/index.js";
import { type Config, isDirKind, paths, rootForKind } from "../config/index.js";
import { CollisionError, DriftError } from "../errors.js";
import { removeContained } from "../safety/index.js";
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

/** Options that relax the write gate. `force` discards a hand-edit (drift) on an OWNED file (R1). */
export interface WriteOptions {
  force?: boolean | undefined;
}

/**
 * The bookkeeping ledger + clobber guard — the single chokepoint that makes managed writes safe:
 * truecast touches ONLY paths it owns, and a drifted (hand-edited) managed file is detectable.
 *
 * WRITE-THROUGH (R2): every mutation persists the manifest atomically as it happens, so after any
 * managed write returns, ownership of it is durable. A crash mid-operation therefore leaves files that
 * are already recorded as owned — the next run sees them as idempotent, never as orphaned collisions.
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

  /**
   * Load the ledger under the home lock, run `fn`, and release — the lifecycle every mutating verb
   * uses, so none of them hand-roll lock/load/save. Writes are durable as they happen (write-through).
   */
  static transaction<T>(config: Config, fn: (ledger: Ledger) => Promise<T> | T): Promise<T> {
    return withHomeLock(config, async () => fn(await Ledger.load(config)));
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
    const current = isDirKind(e.kind) ? sha256Tree(path) : sha256(readFileSync(path));
    return current !== e.sha256;
  }

  /** Refuse to clobber a path that exists but truecast does not own (B5 — never silently shadow). */
  guard(path: string, sourceLabel: string): void {
    if (existsSync(path) && !this.owns(path)) {
      throw new CollisionError(path, `un-managed file already there (${sourceLabel})`);
    }
  }

  /** Persist the manifest atomically — called after every mutation (write-through, R2). */
  private persist(): void {
    const p = paths.manifest(this.config);
    mkdirSync(dirname(p), { recursive: true });
    const data = { version: 1 as const, entries: [...this.entries.values()] };
    writeFileAtomic.sync(p, `${JSON.stringify(data, null, 2)}\n`);
  }

  record(entry: LedgerEntry): void {
    this.entries.set(entry.path, entry);
    this.persist();
  }

  /** Drop an entry from the ledger (after the path it tracked has been deleted; for `remove`). */
  forget(path: string): void {
    if (this.entries.delete(path)) this.persist();
  }

  /** Every managed path owned on behalf of `source` (a persona name) — what `remove --global` deletes. */
  ownedBy(source: string): LedgerEntry[] {
    return [...this.entries.values()].filter((e) => e.source === source);
  }

  /** All owned entries (for `doctor`'s reconcile sweep). */
  all(): LedgerEntry[] {
    return [...this.entries.values()];
  }

  /**
   * Gate a managed write: refuse to clobber an un-owned file (B5) always, or a hand-edited owned one
   * (B1) unless `force` discards the edit (R1). `force` never lets truecast steal a foreign file.
   */
  assertWritable(path: string, source: string, opts: WriteOptions = {}): void {
    this.guard(path, source);
    if (!opts.force && this.owns(path) && this.isDrifted(path)) throw new DriftError(path);
  }

  /** The single managed-FILE write path: gate → atomic write → record (which persists). */
  writeFile(
    path: string,
    data: string,
    kind: LedgerEntry["kind"],
    source: string,
    opts: WriteOptions = {},
  ): void {
    this.assertWritable(path, source, opts);
    mkdirSync(dirname(path), { recursive: true });
    writeFileAtomic.sync(path, data);
    this.record({ path, sha256: sha256(data), source, kind });
  }

  /** Record a managed DIRECTORY the caller has (re)written, by its tree hash. */
  recordDir(path: string, kind: LedgerEntry["kind"], source: string): void {
    this.record({ path, sha256: sha256Tree(path), source, kind });
  }

  /**
   * Delete an owned managed path and forget it — the single owner of "remove something truecast owns".
   * Containment-checked against the home its `kind` belongs to (RR8); no caller computes the base.
   */
  removeOwned(path: string): void {
    const e = this.entries.get(path);
    if (!e) return; // not owned ⇒ nothing for us to delete
    removeContained(rootForKind(this.config, e.kind), path);
    this.forget(path);
  }
}
