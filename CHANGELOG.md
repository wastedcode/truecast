# Changelog

All notable changes to truecast are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project aims for
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **Pre-1.0:** while the version is `0.x`, both the CLI and the programmatic API may change in
> backward-incompatible ways between minor releases. Breaking changes are called out under `### Changed`
> / `### Removed`.

## [Unreleased]

### Fixed
- **Plugin-installed teammates sent users to the CLI for a standing brief.** Every `agents/<name>.md`
  said "they can install you with the `truecast` CLI"; the brief is one file in the repo, read on either
  lane. It now says to save it as `.truecast/agents/<name>/instance/mandate.md`.
- **Mandate templates named only `truecast update`.** Plugin-lane users have `/truecast:update`; the
  template now names both.
- **The homepage's playbook figures could drift from the playbooks.** `scripts/brand/build.py --check`
  and `page.py --check` regenerate in memory and fail on any difference (the data-drawn PNGs are pinned by
  a hash of the data they were rendered from), and `pnpm test` runs both. The hand-written agent's word
  count is now read from the published proof rather than a git-ignored file, so a clean checkout builds
  the same numbers. The first run caught three playbooks that had grown since the figures were drawn.
- `truecast publish --settings` and the README wrote `enabledPlugins` as an array; Claude Code reads an
  object mapping `plugin@marketplace` to `true`.

### Changed
- **Every persona gets a `beat-the-frontier` skill and a closing Frontier check.** The engine injects a
  `## The bar: past the frontier, first time` block into every rendered prompt (after the hygiene principles): load everything the user already said and keep their
  decisions; build taste from many exemplars of every current leader and what critics faulted; set a
  composite bar above all of them; pre-empt the asks a demanding reviewer would make; search the solution
  space (many combinations, scored, recombined, repeated until the winner beats every leader side by side);
  critique as each leader; verify by looking; ship finished and said simply — closed by a short **Frontier
  check**. Every persona ships its role's version as a new `beat-the-frontier` skill (frontier seeds, the
  moves that set their work apart, the canon, the dimensions to search, the asks to pre-empt); a
  conformance test enforces both. Every persona gets a version bump. The `security-engineer`,
  `infrastructure` and `vc-seed` descriptions now end on what each one actually does.
- **New persona: `brand-designer` 0.1.0** — the identity owner the catalog was missing: equity audit,
  one ownable brand idea, distinctiveness tested against the category, the mark drawn and tested at 16px,
  the identity system as tokens, verbal identity with the marketer, and every touchpoint (site, README
  light/dark, social card, favicon, CLI) rendered and held consistent. Twelve official personas.
- **ui-ux-designer 1.3.0** adds visual art direction (`art-direct-the-visual`) and information design
  (`explain-with-visuals`), and gains the `Bash` tool so it can render its own work and inspect the
  screenshots at every breakpoint and theme. Its quality gate now points at the exemplar it named
  instead of a fixed list of brands.
- **software-engineer** gains `WebSearch` + `WebFetch` (live research into the frontier and current
  libraries).
- Mandate templates: the "bar" line now defaults to the frontier bar instead of offering
  "fast-and-iterate"; the founder adds exemplars, house rules, and where correctness is absolute.

## Installer plugin 0.1.2 - 2026-10-16

The `truecast@truecast` plugin (`/truecast:install` and friends). Take it with
`claude plugin marketplace update truecast` and `claude plugin update truecast@truecast`, then restart Claude Code.

### Fixed
- **`/truecast:update` dropped `--project` between its plan and its apply step.** The command accepted
  the flag, but its Step 1 and Step 3 templates never carried it, so a user could be shown a plan for the
  repo's `.claude/agents/<name>.md` and then have `~/.claude/agents/<name>.md` written instead. Both
  templates now carry `[--project]`, the script's usage names it, and `update --all --project` is refused
  (exit 2) rather than guessed at — a repo's teammates are updated by name. Found in the homepage's fair
  test by VoltAgent's security-engineer (`free-6`) and by truecast's (`truecast-4`); both reports are in
  `site/proof/rerun/`. Regression tests cover both paths.
- **The ready message taught a mention form Claude Code doesn't document.** It said "mention it as
  `@security-engineer`"; typed, a bare `@name` can resolve as a file. It now says "mention it as
  `@agent-security-engineer`, or type @ and pick it", and `/truecast:install` and `/truecast:update`
  relay the same form.

## Installer plugin 0.1.1 - 2026-10-16

The `truecast@truecast` plugin (`/truecast:install` and friends). Take it with
`claude plugin marketplace update truecast` and `claude plugin update truecast@truecast`, then restart Claude Code.

### Security
- **Installer plugin 0.1.1 — `--project` could be made to write outside the repo.** Every write-then-rename
  used a predictable temp name (`<file>.tmp-<pid>`) beside its target; inside an untrusted repo, a
  pre-planted symlink at that name redirected the write — `remove --project` could put the repo's
  `.gitignore` text into a shell startup file. Temp files now come from `mktemp` (exclusive, random
  suffix). Found by truecast's own `security-engineer`.
- The installer now refuses an agent template with frontmatter beyond `name`/`description`/`model`/`tools`
  (user-scope agents honour `hooks`, `mcpServers`, `permissionMode`, `initialPrompt`, which the plan never
  showed), and the four `/truecast:*` commands set `disable-model-invocation: true` so text in a repo
  can't steer Claude into running them.

### Fixed
- **Installer plugin 0.1.1 — no more false fork warning after a CLI install.** `/truecast:install` compared
  the recorded source with the marketplace clone's origin as raw strings, so
  `https://github.com/wastedcode/truecast` (what the CLI records) vs `…/truecast.git` (how Claude Code
  clones) printed `source-mismatch: … it may be a fork`. Both sides are now normalised before comparing
  (host case, one trailing `/` and `.git`, SSH → HTTPS, `#fragment` ignored); a different owner or host
  still warns.

## [0.3.0] - unreleased (npm: 0.2.0)

### Added
- **`/truecast:install` — install a teammate from inside Claude Code, and `@`-mention it by its bare
  name.** A new plugin in the existing marketplace (`truecast@truecast`, `0.1.0`) ships four slash
  commands — `/truecast:install`, `/truecast:update`, `/truecast:list`, `/truecast:remove` — that
  materialize a persona into `~/.truecast` + `~/.claude/agents/`, so you get `@product-manager`, not
  `product-manager:product-manager`, in every project. No npm install, no terminal.
  - Every write is done by one reviewable script (`plugin/truecast/bin/truecast-plugin.sh`), never
    improvised by the model. Without `--yes` it is **plan only, zero writes**: you see the version, the
    tools that teammate gets, and every path it will touch — plus a `diff -u` when an existing
    truecast-generated file would be replaced. It never overwrites a file truecast didn't write —
    `--force` does not override that.
  - `--project` scopes the teammate to one repo (and gitignores the machine-local agent file, which
    carries absolute paths into your home).
  - POSIX only (macOS + Linux). On Windows, use the npm CLI.
- **`personas/<name>/subagent.md`** — a third generated file per persona: the rendered subagent body with
  the home left as a `{{TRUECAST_HOME}}` token for the installer to substitute. Same renderer as the
  `@subagent` file and the plugin agent body, so both install lanes write byte-identical teammates (a
  test pins that byte-for-byte). **Generated — never hand-edit it; run `truecast publish`.**
- **Automatic adoption of plugin-lane installs by the CLI.** `install`, `update`, `remove --global` and
  `doctor --fix` now adopt on-disk state they can *prove* truecast wrote but that isn't in the ownership
  ledger — so a persona installed with `/truecast:install` is updatable and removable with the CLI, and
  vice versa, with no `--force` and no collision. Anything unattributable still refuses to be clobbered.
- **Two new `truecast doctor` checks:** `unledgered` (plugin-lane state to adopt — healable) and
  `stale-surface` (an agent file generated by an older truecast — healable by regenerating it). The
  second is the migration path for agent files written by 0.2.x.
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

### Changed
- **A `@subagent` now reads its craft from an absolute path** (`~/.truecast/personas/<name>/current/core`)
  instead of the per-project `.truecast/agents/<name>/core` symlink. Install a teammate once and it works
  from **any** project; the repo's `instance/mandate.md` becomes an optional overlay whose absence is a
  normal state, not an error. Pointers resolve through `current`, so an out-of-date agent file is only
  stale, never broken. Every agent file is regenerated on the next `install`/`update`, and
  `truecast doctor --fix` migrates a 0.2.x one in place.
- **The generated stamp is two lines and carries the version** (`<!-- truecast: <name>@<version> … -->`).
  The old line pointed at `truecast sync`, a command that does not exist; it now points at
  `truecast update` / `/truecast:update`. `GENERATED by truecast` is unchanged — both lanes key their
  "did truecast write this?" check off that exact substring.
- **`truecast publish` also advertises the installer plugin** as the first entry in
  `.claude-plugin/marketplace.json`, when a repo ships `plugin/truecast/`. It is a read input, not
  generated output. `--settings` is unchanged: the installer is never auto-enabled in a consuming repo.

### Removed
- **`src/materialize/__goldens__/` and `scripts/regen-goldens.ts`.** The committed
  `personas/<name>/subagent.md` is now the byte pin, on a real shipped artifact, so there is exactly one
  regeneration command: `truecast publish`. A new conformance test enforces the committed surface in CI.

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
[0.3.0]: https://github.com/wastedcode/truecast/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/wastedcode/truecast/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/wastedcode/truecast/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/wastedcode/truecast/releases/tag/v0.1.0
