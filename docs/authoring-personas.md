# Authoring a persona

A persona is a directory with a `core/` (and optionally an `instance-template/`). The bundled
[`personas/product-manager`](../personas/product-manager) is the worked example.

## Layout
```
my-persona/
  core/
    persona.toml             the manifest / corpus index
    agent.md                 identity — who they are, their bar (the "Why")
    skills/<name>/SKILL.md    a procedure (a Claude Code skill: frontmatter + body)
    knowledge/<name>.md       reference material the agent reads/greps
  instance-template/
    mandate.md               scaffolded into the consumer's repo as their editable job
```

## `core/persona.toml`
```toml
name = "product-manager"        # ^[a-z][a-z0-9-]*  (≤ 64 chars)
version = "1.0.0"               # semver — bump on EVERY change you ship (see below)
description = "…"               # optional, for listings
identity = "agent.md"           # relative path inside core/
skills = ["skills/run-a-rat/SKILL.md", "skills/frame-the-job-jtbd/SKILL.md"]
knowledge = ["knowledge/product-craft-foundations.md"]
modelHint = "opus"             # optional
tools = ["Read", "Grep", "WebSearch", "WebFetch"]   # from the allowlist; shown to the user at install
```

Every path is **relative and contained** in `core/` (no `..`, no symlinks, no absolute paths) —
enforced at install. `tools` must come from the grantable set: `Read, Grep, Glob, WebSearch, WebFetch,
Bash, Edit, Write, NotebookEdit` — and is surfaced for approval before any write.

**Bump `version` on every change you ship** (and keep the generated `plugin.json` in step — the
maintainer's `publish` does this). It gates *both* delivery lanes: `truecast update` resolves "newer"
by it, and Claude Code delivers a plugin update **only when `plugin.json`'s `version` changes** — a
commit under the same version never reaches plugin users.

## Conventions
- **`agent.md` is identity only** — portable craft, no project/orchestration specifics. The *job* lives
  in the instance (a generic starter goes in `instance-template/mandate.md`).
- **Skills are `SKILL.md` folders** with `name` + `description` frontmatter; the `description` controls
  when Claude auto-invokes the skill.
- **The agent reads its corpus via the manifest** — it `Read`s the paths listed in `persona.toml`. Keep
  the manifest the source of truth for what exists.

## Validate
The schema + every referenced file are checked at install. The repo also tests the bundled persona
against the schema in `src/schema/default-persona.test.ts` — mirror that pattern for your own persona.

## Publishing
truecast runs one curated catalog. To make your persona installable, **open a PR adding
`personas/<name>/core/` to this repo** — a maintainer generates and publishes the plugin files into the
official marketplace; you don't run `publish` or commit any generated files. See the README's
*Contribute a persona to the catalog* section and [`CONTRIBUTING.md`](../CONTRIBUTING.md).
