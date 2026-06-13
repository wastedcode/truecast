# truecast

> The expert teammates Claude Code doesn't ship with.

Install portable, versioned **expert personas** — a product manager, an architect, a security reviewer
— into any project, run them in Claude Code, and keep your own customizations when the author improves
them.

**Status:** working end-to-end — `install` · `update` · `list` · `remove` · `doctor` · `prompt` · `publish`,
with a per-persona ownership ledger, atomic updates, and a sandboxed git/GitHub fetch. Verified driving real
Claude Code sessions (as a subagent and as a standalone agent); `publish` generates a Claude Code plugin
marketplace (validated with `claude plugin validate`). Pre-1.0; the self-improving loop is next.

## What a persona is
A persona is a small, greppable corpus + an identity, split into two owners:

- **`core/`** — the provider's craft: `agent.md` (identity) + `skills/` + `knowledge/`, indexed by
  `persona.toml`. Read-only; one global copy; you adopt updates deliberately.
- **`instance/`** — your per-project job (`mandate.md`) + accumulated notes (`work.md`). Yours,
  committed in your repo, **never touched by an update.**

A bundled example: [`personas/product-manager/`](personas/product-manager/).

## Install a teammate as a plugin (no restart)

Install straight into a live Claude Code session:

```
/plugin marketplace add wastedcode/truecast
/plugin install product-manager@truecast
/reload-plugins
```
Now talk to the teammate by name. You only type `@truecast` at install; it's the marketplace the plugin
comes from, like an npm scope. Swap `product-manager` for any of the eleven official personas:
`product-researcher`, `vc-seed`, `software-engineer`, `software-architect`, `security-engineer`, `qa`,
`infrastructure`, `product-marketer`, `ui-ux-designer`, `sales`.

The first time you run a plugin teammate with no job set, it asks what the project needs and writes its own
`mandate.md`. Want a global, versioned copy you update on your terms, with an ownership ledger that keeps
your edits when the author ships changes? Use the `truecast` CLI below.

## Get the `truecast` CLI
```sh
npm install -g @wastedcode/truecast    # installs the `truecast` command
truecast --help
```
Or from source:
```sh
git clone https://github.com/wastedcode/truecast && cd truecast
pnpm install && pnpm build
npm link                                   # puts `truecast` on your PATH
```
Requires Node ≥ 20. **Pre-1.0:** the CLI and the programmatic API may change between `0.x` minors — see
[docs → Stability](docs/README.md#stability-pre-10).

## Install a persona with the CLI
The plugin path above is the fast lane. The CLI is the control lane: a global, versioned copy you update
deliberately, with a per-persona ownership ledger so your customizations survive an update.

```sh
cd your-project
truecast install <git-url-or-path>[@version][#subpath]

# examples
truecast install https://github.com/wastedcode/truecast#personas/product-manager   # an official persona
truecast install ./personas/product-manager                       # local path
truecast install https://github.com/you/persona@1.2.0             # a GitHub release tag
truecast install https://github.com/you/monorepo#personas/pm      # a persona in a sub-directory
```
The eleven official personas (`product-manager`, `product-researcher`, `vc-seed`, `software-engineer`,
`software-architect`, `security-engineer`, `qa`, `infrastructure`, `product-marketer`, `ui-ux-designer`,
`sales`) live in this repo under [`personas/`](personas/) — install any with `…/truecast#personas/<name>`.
Then write the persona's job for this project in `.truecast/agents/<name>/instance/mandate.md`.

## Using a persona

A CLI install generates a native Claude Code **subagent** at `~/.claude/agents/<name>.md` and symlinks the
craft into your project. Its body carries an **index of the persona's skills** (each with a one-line
summary and the path to Read), so the persona pulls the right skill on demand. Verified: given an
open-ended task it Reads the matching `SKILL.md` files itself, then applies them. (A plugin install ships
the same body; only the delivery differs.)

### As a Claude Code subagent (`@agent-<name>`)
Restart Claude Code after a CLI install (the plugin path above needs no restart), then bring it into a
normal session:

```
> have the product-manager pressure-test this idea: an AI that auto-prioritizes my to-dos
```
Claude delegates to the subagent (it's listed under `/agents`, and you can `@agent-product-manager` it
explicitly). The subagent runs with the tools the persona declares (`tools` in its `persona.toml`),
reads its `mandate.md` for the project job, and Reads the skills it needs.

### As a standalone `claude` (the persona *is* the main agent)
Run a full `claude` session that *is* the persona — its whole craft loaded as the system prompt.
`truecast prompt` emits that composed prompt; pipe it into `claude`:

```sh
cd your-project   # the project where you ran `truecast install`
claude --append-system-prompt "$(truecast prompt product-manager)" \
       --allowed-tools Read Grep WebSearch WebFetch \
       --model opus
```
Now the whole session thinks like the persona. `--allowed-tools` restricts it to the tools the persona
declares (a main agent otherwise has the full toolset); `--model` matches its `modelHint`. (`truecast
prompt <name>` just prints the system prompt — `--append-system-prompt-file <file>` works too.)

### As persistent, programmable agents (claudemux)
[claudemux](https://github.com/wastedcode/claudemux) runs real, login-backed `claude` sessions you drive
by name and that tell you when a turn is *actually* done. Flags after `--` are forwarded straight to
`claude`, so you launch a persona as a full standalone agent and talk to it over time:

```sh
# render the persona's prompt once
truecast prompt product-manager > /tmp/pm.md

# spawn it as a full, persistent claude session (everything after `--` goes to claude)
claudemux spawn pm --cwd ./your-project --trust-workspace -- \
  --append-system-prompt-file /tmp/pm.md \
  --allowed-tools Read Grep WebSearch WebFetch --model opus

# then drive it — one-shot, or send/wait/messages
claudemux ask pm "We're thinking of building X next. Worth it?"
```
Each persona is its own session, addressed by name — `tmux attach` to watch it work, or spin up a whole
team (`claudemux spawn architect … / spawn security …`) and coordinate them from one place. The CLI maps
1:1 to a Node library if you'd rather drive it from code (`create({ name, cwd, extraArgs: [...] })`).

## Contribute a persona to the catalog

truecast runs **one curated catalog**, the marketplace this repo publishes, so a user adds it once and
installs everything as `<name>@truecast`. To get your persona in, **open a PR here** with your
`personas/<name>/core/` (the source: `agent.md`, `skills/`, `knowledge/`, `persona.toml`). You don't
generate plugin files or run `publish`; a maintainer publishes it into the catalog when your PR lands.
Start from [`docs/authoring-personas.md`](docs/authoring-personas.md) and [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Ride a teammate along in a repo

Put a teammate in a project so everyone working in it gets the same one, with nothing to install by hand.
Add this to the repo's `.claude/settings.json` and commit it:

```json
{
  "extraKnownMarketplaces": {
    "truecast": { "source": { "source": "github", "repo": "wastedcode/truecast" } }
  },
  "enabledPlugins": ["product-manager@truecast"]
}
```
When someone opens the repo in Claude Code and trusts the folder, Claude Code offers to install the
teammate for them. The expert travels with the code, not with each person's setup. Only commit this for a
marketplace you control, and review what a marketplace ships before you trust a folder.

## Managing personas
```sh
truecast list [--check] [--project]   # what's installed; running vs latest; what's attached here
truecast update [<name>] [--dry-run]  # adopt newer craft; classified (patch/minor/major); your instance untouched
truecast remove <name> [--global]     # detach from this project (keeps instance/), or purge globally
truecast doctor [--fix]               # inspect + repair (drift, dangling pointer, stale artifacts)
```
See [docs/managing-personas.md](docs/managing-personas.md) for the full model (consent, drift/`--force`,
the discriminated update outcomes).

## How it works
`install` resolves the project (the nearest enclosing git repo, or `--project <path>`), fetches the persona into a
global cache (`~/.truecast/personas/<name>/`), symlinks the craft into the project, scaffolds your
editable `instance/`, and materializes the subagent at `~/.claude/agents/<name>.md` — whose body indexes
the skills/knowledge for the persona to Read on demand (skills are **not** copied as global slash-
commands; they're the persona's private craft). Every file truecast writes is tracked in a **per-persona
ledger** (`owned.json`), under a per-persona lock, so concurrent installs never collide and truecast
never clobbers a file it doesn't own.

`publish` is the parallel path. Instead of materializing into `~/.claude`, it generates the committed
plugin and marketplace files that Claude Code installs from.

## Docs
[`docs/`](docs/) — [install](docs/install.md), [managing personas](docs/managing-personas.md),
[authoring personas](docs/authoring-personas.md), and a shipped-vs-planned status table. (Kept in step
with the code: a feature isn't done until it's documented.)

## Develop
```sh
pnpm install
pnpm typecheck && pnpm test && pnpm lint && pnpm build
```
Requires Node ≥ 20 and pnpm. License: MIT (intended). Design notes live in `internal/` (git-ignored).
