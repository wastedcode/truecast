# install

Three ways to get a teammate. Start with the first.

## In Claude Code (recommended)

Two lines to set truecast up, one line per teammate — all in a live session, no terminal:

```
/plugin marketplace add wastedcode/truecast
/plugin install truecast@truecast
/truecast:install product-manager
```

Now `@product-manager` answers to that bare name, in this project and every other one.

`truecast@truecast` is the *installer* — the plugin that provides `/truecast:install` and its three
siblings. You type that line once, ever; after it, adding a teammate is one command. Any of the eleven
official personas works: `product-manager`, `product-researcher`, `vc-seed`, `software-engineer`,
`software-architect`, `security-engineer`, `qa`, `infrastructure`, `product-marketer`, `ui-ux-designer`,
`sales`.

**What you see before anything is written.** `/truecast:install` runs a plan first and writes nothing:
the version, the tools that teammate will be granted, and every path it will touch. You approve, then it
writes. If a file truecast generated earlier would change, you get a `diff -u` and a second ask. If
`~/.claude/agents/<name>.md` exists and truecast didn't write it, the install stops rather than overwrite
it. Everything it copies comes from the marketplace clone already on your disk — nothing is downloaded at
install time, and there is no truecast server.

**First run only.** If `/truecast:install` isn't recognized right after installing the plugin, run
`/reload-plugins`. If `@<name>` isn't recognized after a successful install, restart Claude Code once —
`~/.claude/agents/` has to exist when the session starts. Neither is needed again.

**The other three commands**

```
/truecast:list                 what's installed, what's available, and which lane manages it
/truecast:update <name>        adopt a newer version  (or --all)
/truecast:remove <name>        take a teammate back out
```

`/truecast:update` installs from your local copy of the marketplace. To fetch newer personas first, run
`/plugin marketplace update truecast`.

**This project only.** `/truecast:install <name> --project` writes the teammate to
`<repo>/.claude/agents/<name>.md` instead of your home, scaffolds
`.truecast/agents/<name>/instance/mandate.md` if it's missing, and gitignores the agent file — it points
at absolute paths in *your* home, so it isn't portable and must not be committed.

This lane and the CLI share one on-disk copy and write the same bytes, so a teammate installed by one is
updatable by the other. See [where things land](#where-things-land).

## Straight from the marketplace (no installer)

A persona can also be installed as its own plugin:

```
/plugin marketplace add wastedcode/truecast
/plugin install product-manager@truecast
/reload-plugins
```

The trade-off: a plugin-installed agent is namespaced by its plugin, so you call it
`product-manager:product-manager`, not a bare `@product-manager`. In exchange, Claude Code owns the whole
thing — nothing is written to `~/.truecast` or `~/.claude/agents`, and updates come with the plugin (see
[managing personas](managing-personas.md#which-lane-youre-on)).

Use this lane when the teammate should travel with a **repo** rather than a machine — it's what
`enabledPlugins` in a project's `.claude/settings.json` installs.

## CLI

The control lane: a global, versioned copy you update deliberately, with an ownership ledger that
protects your edits, plus `doctor`, `prompt`, and installs from any git URL — not just this catalog.
Costs you Node, a terminal, and a restart.
```sh
cd your-project
truecast install <git-url-or-path>[@version][#subpath] [flags]

# examples
truecast install ./personas/product-manager              # local path
truecast install https://github.com/you/persona@1.2.0    # GitHub, a specific tag
truecast install git@github.com:you/persona.git          # SSH
truecast install https://github.com/you/monorepo#personas/pm        # persona in a sub-directory
truecast install https://github.com/you/monorepo@1.2.0#personas/pm  # …at a tag
```

**Source grammar** — `<git-url-or-path>` optionally followed by `@<version>` (a git tag) and/or
`#<subpath>` (the directory inside the source that contains `core/persona.toml`, for monorepos where one
repo holds many personas). `@version` applies to git sources only. The subpath must stay inside the
source (a `..` escape is refused).

**Flags**
- `--project <path>` — attach to this project instead of the discovered one.
- `--global` — install to the global cache only; don't attach to a project.
- `--dry-run` — print the plan; write nothing.
- `--yes` — skip the confirmation prompt.
- `--as <name>` — *(planned)* install under a different local name.

After a CLI install, write the job in `.truecast/agents/<name>/instance/mandate.md`, then **restart
Claude Code** to load `@<name>`.

## Programmatic (TypeScript)
The CLI is a thin wrapper over a typed function — orchestrators and other tooling call it directly:

```ts
import { install, autoApprove } from "truecast";

const result = await install(
  { source: "./personas/product-manager", project: "/path/to/repo" },
  { confirm: autoApprove }, // approval policy is the caller's; the CLI prompts, unattended callers pass autoApprove
);

result.applied; // boolean (false for dryRun or a declined confirm)
result.plan;    // the InstallPlan — also what you get back from { dryRun: true }
```

`ctx` is `{ config?, logger?, confirm? }`, all optional. `confirm` is the single `Confirm` type used by
every verb — `(req: ConsentRequest) => boolean | Promise<boolean>`, where `req.kind` is `"install"`,
`"update"`, or `"remove-global"`. The library never prompts, prints, or exits — it returns data and
throws typed `TruecastError`s (each carries a `.hint`). With no `confirm`, the default approves an
install (your explicit act). See [managing personas](managing-personas.md) for the full consent model.

## What it does
`parseSource → fetch (sandboxed) → validate → cache → materialize → attach`, every managed write routed
through the persona's ledger so it never overwrites a file it doesn't own.

## Where things land

`/truecast:install` and `truecast install` write the same layout. The `owned.json` ledger is the CLI's;
a teammate installed by the plugin lane is adopted into it the first time you run a CLI verb on it.

```
~/.truecast/personas/<name>/<ver>/core    the one real copy (global cache)
~/.truecast/personas/<name>/current       → <ver>   (`update` re-points this, atomically)
~/.truecast/personas/<name>/owned.json    what truecast owns for <name> (hashes; clobber/drift guard)
~/.claude/agents/<name>.md                the @agent subagent (generated): identity + a skills/knowledge
                                          INDEX (summary + path) + where the job lives

<repo>/.truecast/agents/<name>/core       → symlink to global current/core (gitignored)
<repo>/.truecast/agents/<name>/instance/  mandate.md · work.md · research/  (YOURS, committed)
<repo>/.truecast/lock                     pins <name> → source@version+commit (committed)
```
Committed in your repo: only `instance/` + the lock. Everything else is global or generated. Each persona
has its **own** `owned.json` ledger + lock, so installs/updates of different personas run concurrently.
