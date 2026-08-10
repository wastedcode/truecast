# Changelog

All notable changes to truecast are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project aims for
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **Pre-1.0:** while the version is `0.x`, both the CLI and the programmatic API may change in
> backward-incompatible ways between minor releases. Breaking changes are called out under `### Changed`
> / `### Removed`.

## [Unreleased]

### Added
- **Channel formatting tells in the anti-tell scrub.** `product-marketer` `1.4.1`:
  `scale-with-ai-not-slop` gains the drafted-in-chatbot channel tell (markdown headers/bold in social and
  email, emoji bullets, "🧵/Thread:" openers, hashtag stacks, raw asterisks in plain-text contexts) and
  notes that uniformly staccato rhythm is the same evenness tell as uniformly long sentences. Prompted by
  a review of `jalaalrd/anti-ai-slop-writing` (whose era appendix independently corroborates the
  word-lists-expire ruling; its banned-word approach was deliberately not adopted).
- **Audience-first anti-slop across the outward-facing personas** — grounded in a verified deep-research
  pass on 2025–2026 AI-writing tells (peer-reviewed stylometry + maintained practitioner guidance).
  `product-marketer` `1.4.0`: the anti-tell scrub gains the durable *structural* tells (no short
  sentences, synonym-cycling vs. natural repetition, participial openers, one-skeleton templating), the
  cluster/era-stamp reading rules, and a per-project **voice spec** (founder register × human stance ×
  this audience's language) with a line-interrogation pass in `honor-the-voice`. `sales` `2.1.0`:
  `prospect-and-open` gains the AI-outreach scrub (the 200-others test, line-one-proves-research,
  buyer-vocabulary derivation, sequence-consistency tells). `ui-ux-designer` `1.2.0`:
  `write-ui-microcopy` gains the AI-register scrub (exclamation cheer, apology theater, hedge padding)
  plus a per-project mini voice spec; the slop gallery adds chatbot-register copy. `product-manager`
  `2.3.0`: `problem-first-prd` gains the named-reader rule and the hedge scrub (every hedge becomes a
  decision or an owned open question).

## [0.2.0] - 2026-07-22

### Added
- **`truecast publish` + plugin install.** `publish` generates, from each persona, a native Claude Code
  plugin (`agents/<name>.md` + `.claude-plugin/plugin.json`) plus a repo-root `.claude-plugin/marketplace.json`
  — turning any repo into an installable marketplace. Users then install a teammate with no restart:
  `/plugin marketplace add <owner/repo>` → `/plugin install <name>@<marketplace>` → `/reload-plugins`.
  Flags: `--check` (drift gate for CI), `--settings` (ride-along snippet for a consuming repo, no
  `autoUpdate` by design), `--dry-run`, `--repo`, `--marketplace`. Writes only inside your repo, into
  git-tracked files you review in the diff; nothing is uploaded. The official catalog is published this way.
- **Two new official personas: `product-researcher` and `vc-seed`** — joining product-manager,
  software-engineer, software-architect, security-engineer, qa, infrastructure, product-marketer,
  ui-ux-designer, sales (eleven total). `vc-seed` distills a seed-stage investor's lens (the Pull, earned
  secrets, revealed preferences, the dinner test), grounded in Nikunj Kothari's open-source Nock (MIT).
- **`product-marketer` `1.3.0`** — the `scale-with-ai-not-slop` skill gains a second-generation-tell
  section: over-writing (density-of-craft, sustained metaphors, proud lines, antithesis stacking,
  essayistic connective tissue) that passes the classic anti-slop checklist, plus the rule that the
  writer can't grade its own density — the scrub must run as a cold read by a fresh pass, never
  author self-certification.
- **`publish` emits listing metadata in each plugin manifest** — `homepage`, `repository`, and `license`
  (derived from `package.json`), so marketplace listings and the community-marketplace review get full
  attribution.

### Changed
- **BREAKING: Node ≥ 22 is now required** (was ≥ 20). Forced by the execa 9→10 major, and Node 20
  reached end-of-life in April 2026. `engines` and all docs updated.
- **Docs and personas no longer reference sibling projects** — truecast stands alone as a product. The
  external-orchestrator run-lane was removed from the README/docs (plugin install is the primary path), and
  the `sales` persona's craft text was reworded provenance-neutral (`2.0.1`, patch — no skill or tool changes).
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
- **Ways to run a persona:** as a Claude Code `@agent-<name>` subagent, or as a standalone
  `claude --append-system-prompt-file <(truecast prompt <name>)`. (The plugin lane arrived later — see
  Unreleased.)
- **Persona format:** `core/` (portable craft — `agent.md` + `skills/` + `knowledge/` + `persona.toml`)
  vs `instance/` (your per-project `mandate.md` / `work.md`, never touched by `update`).
- **Engine-injected operating principles:** every rendered persona prompt carries a small, universal
  craft block (read-before-act · ground-every-claim · verify) — owned by truecast, not the publisher or
  the user.
- **The persona corpus:** `product-manager`, `software-engineer`, `software-architect`,
  `security-engineer`, `qa`, `infrastructure`, `product-marketer`, `ui-ux-designer`, `sales` — each
  built from independent research and acceptance-tested against real-world demands.

[Unreleased]: https://github.com/wastedcode/truecast/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/wastedcode/truecast/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/wastedcode/truecast/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/wastedcode/truecast/releases/tag/v0.1.0
