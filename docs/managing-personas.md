# managing personas — update · list · remove

Once a persona is [installed](install.md), these three verbs keep it current, show you what you have,
and take it away. Like `install`, each is a typed function first and a thin CLI second, never prompts or
exits on its own, and routes every managed write through the ownership ledger.

The golden rule holds throughout: **`update` and `remove` never touch your `instance/`** unless you
explicitly ask (`remove --purge`). Your job description and notes are yours.

---

## update

Adopt a newer version of a persona's `core/`. truecast re-points the global `current` pointer and
regenerates the `@agent` + `/skills` surface; every project that *tracks* the persona picks up the new
version on its next Claude Code session. Your `instance/` is left byte-for-byte unchanged.

```sh
truecast update <name>[@version]   # one persona (default: latest)
truecast update                    # every installed persona, each independently
```

**Flags**
- `--dry-run` — fetch + classify + show the change set; write nothing.
- `--force` — overwrite a hand-edited (drifted) generated file instead of refusing (see *drift* below).
- `--yes` — skip the confirmation prompt.

**What you see before anything changes** — the change is *classified* so you know the blast radius:

| class | means | example |
|---|---|---|
| **patch** | nothing structural changed | a knowledge file reworded |
| **minor** | a skill or knowledge file added/changed | a new skill |
| **major** | identity (`agent.md`) changed, a **new tool** was granted, or a skill/knowledge file **removed** | the persona now wants `Bash` |

A `major` change, a **downgrade**, or a **moved tag** (same version, different upstream commit — a
supply-chain signal) is surfaced for explicit confirmation. Decline and nothing changes.

**Safety properties**
- The candidate is *fully validated* (schema + path-safety) **before** `current` is ever re-pointed —
  an invalid update can never become live (no half-state). All home writes run under a process lock
  and a **write-through ledger**, so an interrupted update retries cleanly (it never wedges).
- Already on the latest, same content? Zero writes; reports *"already up to date."*
- `update` (no name) treats each persona as an **independent transaction** — one failure never rolls
  back the others; the command exits non-zero if any failed.
- **Drift:** if you hand-edited a generated file (e.g. `~/.claude/agents/<name>.md`), update refuses to
  clobber it (`DriftError`). Re-run with `--force` to discard your edit, or restore the file.

**Consent model (one type across all verbs).** Every verb takes the same `confirm?: Confirm` where
`Confirm = (req: ConsentRequest) => boolean | Promise<boolean>` and `req.kind` is `"install"`,
`"update"`, or `"remove-global"`. Implement it once. With **no** `confirm`, the default (`defaultConsent`)
is safe: install approves, an update applies only when **not** risky (major / downgrade / tag-move /
new-tool — else `outcome: "blocked"`), and `remove --global` denies. Pass `autoApprove` to approve
everything unattended; inspect `r.plan` / `isRiskyUpdate(plan)` to build your own policy.

```ts
import { update, autoApprove } from "truecast";

const [r] = await update({ name: "product-manager" }, { confirm: autoApprove });
r.outcome; // "applied" | "up-to-date" | "blocked" | "dry-run" | "failed"  (exactly one — no boolean soup)
r.plan;    // the UpdatePlan: from/to, changeClass, changes[], toolsAdded, downgrade, tagMoved (null if up-to-date)
r.error;   // set only when outcome === "failed"
```

> Restart Claude Code after an update to reload the regenerated subagent.

---

## list

Show what's installed and whether updates are available.

```sh
truecast list              # global table: persona · running · last-known · source
truecast list --check      # also resolve the latest version from each source (network)
truecast list --project    # additionally show what's attached to this project, and how it tracks
```

- **running** is resolved from the `current` symlink (the source of truth). A dangling link shows as
  `BROKEN`.
- Without `--check`, the "latest" column is the newest version truecast already knows about
  (*last-known*); `--check` resolves it live from the source and an available update is flagged `⬆`.
- `--project` lists each attached persona with its `spec` — `current` (tracking) or a pinned version.

```ts
import { list } from "truecast";

const { personas, project } = await list({ check: true, project: true });
personas[0]; // { name, running, broken, source, latest, checked, updateAvailable }
```

---

## remove

Two scopes: **detach** from a project (default) or **purge** globally.

```sh
truecast remove <name>            # detach from this project; PRESERVE instance/
truecast remove <name> --purge    # detach AND delete this project's instance/ (your edits)
truecast remove <name> --global --yes   # purge cache + surface + meta everywhere
```

**Flags**
- `--global` — remove the global cache, the `~/.claude` surface, and the meta record. Requires `--yes`.
- `--purge` — when detaching, also delete the project `instance/`.
- `--project <path>` — detach from this project instead of the discovered one.
- `--yes` — skip the confirmation prompt (required for `--global`).

**What each scope does**
- **detach (default):** removes the project's `core` symlink and the lock entry. Your `instance/` is
  left in place (orphaned, recoverable). The global cache is untouched — other projects may still
  track the persona.
- **`--global`:** deletes only ledger-owned paths (each containment-checked before deletion), then the
  persona's cache dir. Because truecast cannot enumerate which projects track a persona, it **warns
  that tracking projects will break next session** and requires explicit consent.

```ts
import { remove } from "truecast";

await remove({ name: "product-manager" });                          // detach, keep instance/
// --global is destructive, so the default confirm DENIES — opt in explicitly:
await remove({ name: "product-manager", global: true }, { confirm: () => true });
```

---

## doctor

Inspect — and optionally repair — the truecast home. Read-only by default; `--fix` applies the safe
heals. Drift and orphaned caches are never auto-destroyed (they may be your data); they're reported with
a concrete next step.

```sh
truecast doctor          # report issues; exits non-zero if any need attention
truecast doctor --fix    # also re-point a dangling current + remove stale staging artifacts
```

| issue | meaning | `--fix` |
|---|---|---|
| **drift** | a generated file was hand-edited | reported (resolve via `update --force` or restore) |
| **dangling-current** | `current` doesn't resolve but versions are cached | re-promotes the newest cached version |
| **stale-staging** | leftover `*.staging-*`/`*.tmp-*` from an interrupted write | removed |
| **orphan-cache** | a cached version truecast no longer tracks | reported (`remove --global` to clear) |
| **missing-owned** | a generated file vanished | reported (re-install/update to regenerate) |

```ts
import { doctor } from "truecast";
const report = await doctor({ fix: true });
report.healthy;            // boolean
report.issues;             // DoctorIssue[] — { kind, path, persona?, detail, healable, healed }
```

---

## Notes & current limits
- **Pinning** a project to a fixed version (`--pin`) is planned — today every attachment *tracks*
  `current`.
- A **local-path source** has exactly one version (its manifest's); `@version` is rejected for path
  sources. Versioned updates/rollbacks come from **git tags**.
