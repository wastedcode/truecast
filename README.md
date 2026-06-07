# truecast

> The expert teammates Claude Code doesn't ship with.

Install portable, versioned **expert personas** — a product manager, an architect, a security reviewer
— into any project, run them in Claude Code, and keep your own customizations when the author improves
them.

**Status:** working end-to-end — `install` · `update` · `list` · `remove` · `doctor` · `prompt`, with a
per-persona ownership ledger, atomic updates, and a sandboxed git/GitHub fetch. Verified driving real
Claude Code sessions (as a subagent and as a standalone agent). Pre-1.0; the self-improving loop is next.

## What a persona is
A persona is a small, greppable corpus + an identity, split into two owners:

- **`core/`** — the provider's craft: `agent.md` (identity) + `skills/` + `knowledge/`, indexed by
  `persona.toml`. Read-only; one global copy; you adopt updates deliberately.
- **`instance/`** — your per-project job (`mandate.md`) + accumulated notes (`work.md`). Yours,
  committed in your repo, **never touched by an update.**

A bundled example: [`personas/product-manager/`](personas/product-manager/).

## Install
```sh
cd your-project
truecast install <git-url-or-path>[@version][#subpath]

# examples
truecast install ./personas/product-manager                       # local path
truecast install https://github.com/you/persona@1.2.0             # a GitHub release tag
truecast install https://github.com/you/monorepo#personas/pm      # a persona in a sub-directory
```
Then write the persona's job for this project in `.truecast/agents/<name>/instance/mandate.md`.

## Using a persona

Installing generates a native Claude Code **subagent** at `~/.claude/agents/<name>.md` and symlinks the
craft into your project. Its body carries an **index of the persona's skills** (each with a one-line
summary and the path to Read), so the persona pulls the right skill on demand — verified: given an
open-ended task it Reads the matching `SKILL.md` files itself, then applies them.

You can run a persona three ways.

### 1. As a Claude Code subagent (`@agent-<name>`)
Restart Claude Code after installing, then bring it into a normal session:

```
> have the product-manager pressure-test this idea: an AI that auto-prioritizes my to-dos
```
Claude delegates to the subagent (it's listed under `/agents`, and you can `@agent-product-manager` it
explicitly). The subagent runs with the tools the persona declares (`tools` in its `persona.toml`),
reads its `mandate.md` for the project job, and Reads the skills it needs.

### 2. As a standalone `claude` (the persona *is* the main agent)
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

### 3. Programmatically — full agents, driven from code (claudemux)
[claudemux](https://github.com/wastedcode/claudemux) spins up real, login-backed `claude` sessions from
Node and tells you when a turn is actually done. It forwards extra flags to `claude` via `extraArgs`, so
you spin up a persona as a full standalone agent — one, or a coordinating fleet:

```ts
import { create, ask } from "@wastedcode/claudemux";
import { execFileSync } from "node:child_process";

// the persona must already be installed + attached in `projectPath` (truecast install …)
const systemPrompt = execFileSync("truecast", ["prompt", "product-manager"], { encoding: "utf8" });

const pm = await create({
  name: "pm",
  cwd: projectPath,
  trustWorkspace: true,
  extraArgs: [
    "--append-system-prompt", systemPrompt,
    "--allowed-tools", "Read", "Grep", "WebSearch", "WebFetch",
    "--model", "opus",
  ],
});

const { messages } = await ask(pm, "We're thinking of building X next. Worth it?");
console.log(messages.at(-1));        // the persona's verdict
// drive a whole team the same way: create() a "pm", an "architect", a "security" — each its own session
```
This is the "spin up `@product-manager` and let it work" model: each persona is its own persistent,
attachable session (you can `tmux attach` to watch it), addressed by name.

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
`install` resolves the project (nearest `.truecast/`, else the git root), fetches the persona into a
global cache (`~/.truecast/personas/<name>/`), symlinks the craft into the project, scaffolds your
editable `instance/`, and materializes the subagent at `~/.claude/agents/<name>.md` — whose body indexes
the skills/knowledge for the persona to Read on demand (skills are **not** copied as global slash-
commands; they're the persona's private craft). Every file truecast writes is tracked in a **per-persona
ledger** (`owned.json`), under a per-persona lock, so concurrent installs never collide and truecast
never clobbers a file it doesn't own.

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
