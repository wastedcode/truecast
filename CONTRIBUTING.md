# Contributing to truecast

Thanks for your interest. truecast installs, runs, and manages portable, versioned **expert personas**
in Claude Code. There are two distinct things you might contribute — and they have different bars:

1. **The engine** (`src/`) — the CLI + programmatic API that fetches, materializes, and manages personas.
   Small, deliberately-scoped, correctness-first. Read this whole file before opening a PR.
2. **A persona** (`personas/<name>/`) — the actual expert craft. Follow
   [`docs/authoring-personas.md`](./docs/authoring-personas.md); the bar is "a top practitioner of this
   discipline would recognize the craft, and it stays in its lane."

If you're unsure whether an idea fits, **open an issue before writing code.** A rejected PR is a worse
outcome for everyone than a five-minute scoping comment.

## Scope — what truecast is (and isn't)

- **In scope:** install/update/list/remove/prompt/doctor as safe, atomic, confirmable operations; the
  `core/` (publisher craft) vs `instance/` (your per-project mandate) split; running a persona as a
  Claude Code plugin, as a `@agent` subagent, or as a standalone `claude`; keeping your edits when the author
  improves the persona.
- **Out of scope:** anything that runs a persona's instructions without you choosing to install it;
  credential/API-key automation (truecast owns no credentials — it materializes a subagent for your
  already-authenticated Claude Code); Windows-native paths (symlinks + POSIX assumed; WSL is community
  territory).

## Development setup

Requires **Node ≥ 20** and **pnpm**. A working `claude` CLI is only needed to *drive* a persona, not to
develop the engine.

```sh
git clone https://github.com/wastedcode/truecast.git
cd truecast
pnpm install
pnpm build
```

## The local gate (run before every PR)

```sh
pnpm lint         # biome lint + format check  (pnpm lint:fix to auto-fix)
pnpm typecheck    # tsc --noEmit
pnpm test         # vitest — unit + conformance + e2e
pnpm build        # tsc -p tsconfig.json
```

CI runs the same lanes. A PR that fails any of them won't merge.

## Conventions

- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`). The body
  says *why*; claims about runtime behavior are verified against reality, not assumed.
- **Public API + CLI changes are additive by default.** Pre-1.0, the surface may still break between
  minors (see [`docs/README.md`](./docs/README.md) → Stability) — but a break needs a strong rationale
  and a `CHANGELOG.md` entry under `### Changed` / `### Removed`.
- **Every altering operation confirms** (with a `--yes` skip). New mutating paths route through the
  consent gate (`src/api/consent.ts`) and add a case to `consent.conformance.test.ts`.
- **Typed errors** extend `TruecastError` and carry an actionable message + hint.
- **Path safety is non-negotiable.** Persona-supplied paths go through `src/safety/` (contained, no
  `..`, no absolute, no symlink escape). New fetch/materialize paths must preserve this.
- **Tests:** new behavior needs coverage; bugs get a regression test that reproduces them first.
- **CHANGELOG:** user-facing changes go under `## [Unreleased]` in
  [`CHANGELOG.md`](./CHANGELOG.md) (Keep a Changelog format).

## Pull requests

1. Branch from `main`.
2. Make the change; run the full local gate above.
3. Open the PR against `main` with the template filled in — describe the *why* and how you verified it.
4. CI must be green. A maintainer will review.

## Reporting bugs & security issues

Functional bugs: open a [bug report](https://github.com/wastedcode/truecast/issues/new/choose).
**Security vulnerabilities: do not open a public issue** — follow [`SECURITY.md`](./SECURITY.md).

By contributing, you agree your contributions are licensed under the project's [MIT License](./LICENSE).
