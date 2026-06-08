# Changelog

All notable changes to truecast are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project aims for
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **Pre-1.0:** while the version is `0.x`, both the CLI and the programmatic API may change in
> backward-incompatible ways between minor releases. Breaking changes are called out under `### Changed`
> / `### Removed`.

## [Unreleased]

### Changed
- Dependency bumps (Dependabot): runtime — zod 3→4, pino 9→10, write-file-atomic 6→8, commander 14→15;
  toolchain — TypeScript 6, @types/node 25, vite 8, vitest 4, **@biomejs/biome 1→2** (config migrated to
  the v2 schema; import-sort reflow); CI actions checkout/setup-node/pnpm-action to v6. No API or behavior
  change; full suite green.

## [0.1.1] - 2026-06-07

### Fixed
- `truecast --version` reported a hardcoded `0.0.0`; it now reads the real version from the package
  manifest, so it can't drift from the published version again.

## [0.1.0] - 2026-06-07

Initial public release.

### Added
- **CLI:** `install`, `update`, `list`, `remove`, `prompt`, `doctor`. Every altering operation confirms
  first, with `--yes` to skip.
- **Install sources:** local path or git URL, with `@version` (semver tag) and `#subpath` (persona in a
  sub-directory of a repo).
- **Safe, atomic management:** a per-persona ownership ledger (drift/clobber guard), atomic symlink
  swaps, per-persona locking, and a sandboxed/hardened git fetch.
- **Programmatic API** (`import ... from "truecast"`) for orchestrators — the same verbs the CLI uses,
  with typed contracts and errors.
- **Three ways to run a persona:** as a Claude Code `@agent-<name>` subagent, as a standalone
  `claude --append-system-prompt-file <(truecast prompt <name>)`, or via claudemux.
- **Persona format:** `core/` (portable craft — `agent.md` + `skills/` + `knowledge/` + `persona.toml`)
  vs `instance/` (your per-project `mandate.md` / `work.md`, never touched by `update`).
- **Engine-injected operating principles:** every rendered persona prompt carries a small, universal
  craft block (read-before-act · ground-every-claim · verify) — owned by truecast, not the publisher or
  the user.
- **The persona corpus:** `product-manager`, `software-engineer`, `software-architect`,
  `security-engineer`, `qa`, `infrastructure`, `product-marketer`, `ui-ux-designer`, `sales` — each
  built from independent research and acceptance-tested against real-world demands.

[Unreleased]: https://github.com/wastedcode/truecast/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/wastedcode/truecast/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/wastedcode/truecast/releases/tag/v0.1.0
