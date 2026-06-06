import { createHash } from "node:crypto";
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import writeFileAtomic from "write-file-atomic";
import { withPersonaLock } from "../concurrency/index.js";
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

/** What a managed entry records, minus the owner (the ledger injects its persona). */
type EntryInput = Omit<LedgerEntry, "source">;

/**
 * One persona's ownership ledger + clobber guard — the chokepoint that makes managed writes safe:
 * truecast touches ONLY paths it owns, and a drifted (hand-edited) managed file is detectable.
 *
 * PER-PERSONA (R3): there is one ledger file per persona (`personas/<name>/owned.json`), and every
 * managed path is namespaced by persona, so different personas share no mutable state and run fully
 * concurrently. WRITE-THROUGH (R2): each mutation persists atomically as it happens, so after any
 * managed write returns its ownership is durable — a crash mid-op leaves files recorded as owned, and
 * the next run treats them as idempotent rather than orphaned collisions.
 */
export class Ledger {
  private readonly entries = new Map<string, LedgerEntry>();
  private constructor(
    private readonly config: Config,
    /** The persona this ledger belongs to — the `source` of every entry it records. */
    readonly persona: string,
  ) {}

  static async load(config: Config, persona: string): Promise<Ledger> {
    const l = new Ledger(config, persona);
    const p = paths.ledgerFile(config, persona);
    if (existsSync(p)) {
      const parsed = LedgerSchema.safeParse(JSON.parse(readFileSync(p, "utf8")));
      if (parsed.success) for (const e of parsed.data.entries) l.entries.set(e.path, e);
    }
    return l;
  }

  /**
   * Run `fn` against `persona`'s ledger under that persona's lock (load → run → auto-persisted). The
   * lifecycle every mutating verb uses; no verb hand-rolls lock/load/save, and distinct personas never
   * block each other.
   */
  static transaction<T>(
    config: Config,
    persona: string,
    fn: (ledger: Ledger) => Promise<T> | T,
  ): Promise<T> {
    return withPersonaLock(config, persona, async () => fn(await Ledger.load(config, persona)));
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
  guard(path: string): void {
    if (existsSync(path) && !this.owns(path)) {
      throw new CollisionError(path, `un-managed file already there (${this.persona})`);
    }
  }

  /** Persist the ledger atomically — called after every mutation (write-through, R2). */
  private persist(): void {
    const p = paths.ledgerFile(this.config, this.persona);
    mkdirSync(dirname(p), { recursive: true });
    const data = { version: 1 as const, entries: [...this.entries.values()] };
    writeFileAtomic.sync(p, `${JSON.stringify(data, null, 2)}\n`);
  }

  record(entry: EntryInput): void {
    this.entries.set(entry.path, { ...entry, source: this.persona });
    this.persist();
  }

  /** Drop an entry from the ledger (after the path it tracked has been deleted; for `remove`). */
  forget(path: string): void {
    if (this.entries.delete(path)) this.persist();
  }

  /** Every managed path this persona owns — what `remove --global` deletes and `doctor` inspects. */
  owned(): LedgerEntry[] {
    return [...this.entries.values()];
  }

  /**
   * Gate a managed write: refuse to clobber an un-owned file (B5) always, or a hand-edited owned one
   * (B1) unless `force` discards the edit (R1). `force` never lets truecast steal a foreign file.
   */
  assertWritable(path: string, opts: WriteOptions = {}): void {
    this.guard(path);
    if (!opts.force && this.owns(path) && this.isDrifted(path)) throw new DriftError(path);
  }

  /** The single managed-FILE write path: gate → atomic write → record (which persists). */
  writeFile(path: string, data: string, kind: LedgerEntry["kind"], opts: WriteOptions = {}): void {
    this.assertWritable(path, opts);
    mkdirSync(dirname(path), { recursive: true });
    writeFileAtomic.sync(path, data);
    this.record({ path, sha256: sha256(data), kind });
  }

  /** Record a managed DIRECTORY the caller has (re)written, by its tree hash. */
  recordDir(path: string, kind: LedgerEntry["kind"]): void {
    this.record({ path, sha256: sha256Tree(path), kind });
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
