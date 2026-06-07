<!-- Thanks for contributing! Keep PRs small and grounded. -->

## What & why
What does this change, and why? Link the issue if there is one.

## Scope
- [ ] Engine (`src/`)
- [ ] Persona (`personas/<name>/` — followed `docs/authoring-personas.md`)
- [ ] Docs only

## How I verified it
How you proved it works (commands, output, a new test). Runtime claims should be checked against reality,
not assumed.

## Checklist
- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm build` all pass
- [ ] New behavior has tests; a fixed bug has a regression test
- [ ] Any mutating path confirms (and has a `consent.conformance` case)
- [ ] `CHANGELOG.md` updated under `## [Unreleased]` (for user-facing changes)
- [ ] Commits follow Conventional Commits
