# install

Install a persona into the current project (plus a one-time global cache).

## CLI
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

After install, write the job in `.truecast/agents/<name>/instance/mandate.md`, then **restart Claude
Code** to load `@agent-<name>`.

## Programmatic (TypeScript)
The CLI is a thin wrapper over a typed function — orchestrators (e.g. Posse) call it directly:

```ts
import { install, autoApprove } from "truecast";

const result = await install(
  { source: "./personas/product-manager", project: "/path/to/repo" },
  { confirm: autoApprove }, // approval policy is the caller's; CLI prompts, Posse passes autoApprove
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
```
~/.truecast/personas/<name>/<ver>/core    the one real copy (global cache)
~/.truecast/personas/<name>/current       → <ver>   (`update` re-points this, atomically)
~/.truecast/personas/<name>/owned.json    what truecast owns for <name> (hashes; clobber/drift guard)
~/.claude/agents/<name>.md                the @agent subagent          (generated)
~/.claude/skills/<name>-<skill>/          the /skills                   (generated)

<repo>/.truecast/agents/<name>/core       → symlink to global current/core (gitignored)
<repo>/.truecast/agents/<name>/instance/  mandate.md · work.md · research/  (YOURS, committed)
<repo>/.truecast/lock                     pins <name> → source@version+commit (committed)
```
Committed in your repo: only `instance/` + the lock. Everything else is global or generated. Each persona
has its **own** `owned.json` ledger + lock, so installs/updates of different personas run concurrently.
