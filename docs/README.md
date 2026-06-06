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
| persona format (`core/` + `instance/`, `persona.toml`) | ✅ shipped |
| bundled persona: `product-manager` | ✅ shipped |
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
- [managing personas](managing-personas.md) — `update` · `list` · `remove`: keep personas current,
  see what's installed, and detach or purge them.
- [authoring personas](authoring-personas.md) — how to build one; the `persona.toml` format.

## Develop
`pnpm install && pnpm typecheck && pnpm test && pnpm lint && pnpm build`. Node ≥ 20, pnpm.
Design notes (pre-shipping) live in `internal/` (git-ignored).
