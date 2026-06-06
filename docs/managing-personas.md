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
  an invalid update can never become live (no half-state).
- Already on the latest, same content? Zero writes; reports *"already up to date."*
- `update` (no name) treats each persona as an **independent transaction** — one failure never rolls
  back the others; the command exits non-zero if any failed.

```ts
import { update } from "truecast";

const results = await update({ name: "product-manager" }, { confirm: (plan) => plan.changeClass !== "major" });
results[0].applied;       // boolean
results[0].upToDate;      // true ⇒ nothing to do
results[0].plan;          // the UpdatePlan: from/to, changeClass, changes[], toolsAdded, downgrade, tagMoved
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
await remove({ name: "product-manager", global: true }, { confirm: () => true }); // purge everywhere
```

---

## Notes & current limits
- **Pinning** a project to a fixed version (`--pin`) is planned — today every attachment *tracks*
  `current`.
- A **local-path source** has exactly one version (its manifest's); `@version` is rejected for path
  sources. Versioned updates/rollbacks come from **git tags**.
