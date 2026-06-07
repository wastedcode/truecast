# truecast docs

Reference docs, kept in step with what's actually shipped. **Convention: a feature isn't "done" until
it's documented here.**

> truecast — *the expert teammates Claude Code doesn't ship with.* Install portable, versioned expert
> **personas** into any project, summon them with `@agent-<name>`, and keep your edits when the author
> improves them.

## Status
| area | state |
|---|---|
| `install` — local path + git, CLI + programmatic | ✅ shipped |
| `update` · `list` · `remove` — CLI + programmatic | ✅ shipped |
| `doctor` — inspect + repair (drift/dangling/stale/orphan) | ✅ shipped |
| `prompt` — emit a persona's composed system prompt | ✅ shipped |
| run a persona: subagent · standalone `claude` · claudemux fleet | ✅ shipped |
| persona format (`core/` + `instance/`, `persona.toml`) | ✅ shipped |
| skills as the persona's craft (in-body index, Read on demand) | ✅ shipped |
| bundled persona: `product-manager` | ✅ shipped |
| security: containment + clobber/drift guards + adversarial suite | ✅ shipped |
| robustness: per-persona write-through ledger + lock, atomic swaps, `--force` | ✅ shipped |
| pinning a project to a fixed version (`--pin`) | ⏳ planned |
| `sync` (re-materialize the surface from the cache) | ⏳ planned |
| `publish` · `conform` | ⏳ planned |
| self-improving "gate" (the `learn` loop) | ⏳ v1 |

## The model in 30 seconds
A persona splits into two owners:

- **`core/`** — the provider's craft (`agent.md` identity + `skills/` + `knowledge/`, indexed by
  `persona.toml`). Read-only; one global copy in `~/.truecast`; you adopt updates deliberately.
- **`instance/`** — your per-project job (`mandate.md`) + notes (`work.md`). Committed in your repo,
  **never touched by an update.** *You only ever edit `instance/`.*

## Pages
- [install](install.md) — install a persona (CLI + programmatic), and exactly what it writes.
- [managing personas](managing-personas.md) — `update` · `list` · `remove` · `doctor`: keep personas
  current, see what's installed, detach or purge them, and inspect/repair the home.
- [authoring personas](authoring-personas.md) — how to build one; the `persona.toml` format.

## Stability (pre-1.0)
truecast is published `0.x`. **Both interfaces — the `truecast` CLI (commands, flags, output) and the
programmatic API (`import … from "truecast"`: verbs, types, errors) — may change in
backward-incompatible ways between minor releases.** Pin a version if you depend on it
(`npm install @wastedcode/truecast@0.1.0`), and check [`CHANGELOG.md`](../CHANGELOG.md) before upgrading — breaking
changes are called out under `### Changed` / `### Removed`. The persona format (`core/`/`instance/`,
`persona.toml`) is part of this surface and may also evolve pre-1.0. Stability guarantees begin at `1.0.0`.

## Develop
`pnpm install && pnpm typecheck && pnpm test && pnpm lint && pnpm build`. Node ≥ 20, pnpm.
See [`CONTRIBUTING.md`](../CONTRIBUTING.md) for the contribution bar and the local gate.
Design notes (pre-shipping) live in `internal/` (git-ignored).
