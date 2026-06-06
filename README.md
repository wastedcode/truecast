# truecast

> The expert teammates Claude Code doesn't ship with.

Install portable, versioned **expert personas** — a product manager, an architect, a security reviewer
— into any project, summon them in Claude Code with `@agent-<name>`, and keep your own customizations
when the author improves them.

**Status: pre-alpha.** The foundation (schemas, config, path-safety, fetch, logging) is built and
tested; `truecast install` is being wired up. Not yet usable end-to-end.

## What a persona is
A persona is a small, greppable corpus + an identity, split into two owners:

- **`core/`** — the provider's craft: `agent.md` (identity) + `skills/` + `knowledge/`, indexed by
  `persona.toml`. Read-only; one global copy; you adopt updates deliberately.
- **`instance/`** — your per-project job (`mandate.md`) + accumulated notes (`work.md`). Yours,
  committed in your repo, **never touched by an update.**

A bundled example: [`personas/product-manager/`](personas/product-manager/).

## Install (planned)
```sh
cd your-project
truecast install <git-url-or-path>[@version]    # e.g. ./personas/product-manager
# write the job  →  .truecast/agents/<name>/instance/mandate.md
# restart Claude Code  →  @agent-<name>
```

## How it works
`install` resolves the project (the nearest `.truecast/`, else the git root), fetches the persona into
a global cache (`~/.truecast`), symlinks it into the project, scaffolds your editable instance, and
materializes a native Claude Code subagent + skills under `~/.claude/`. Every file truecast writes is
tracked in a manifest, so it never clobbers your own.

## Develop
```sh
pnpm install
pnpm typecheck && pnpm test && pnpm lint && pnpm build
```
Requires Node ≥ 20 and pnpm. License: MIT (intended). Design notes live in `internal/` (git-ignored).
