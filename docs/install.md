# install

Install a persona into the current project (plus a one-time global cache).

## CLI
```sh
cd your-project
truecast install <git-url-or-path>[@version] [flags]

# examples
truecast install ./personas/product-manager
truecast install https://github.com/you/persona@1.2.0
```

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
import { install } from "truecast";

const result = await install(
  { source: "./personas/product-manager", project: "/path/to/repo" },
  { confirm: () => true }, // the approval policy is the caller's; CLI prompts, Posse auto-approves
);

result.applied; // boolean (false for dryRun or a declined confirm)
result.plan;    // the InstallPlan — also what you get back from { dryRun: true }
```

`ctx` is `{ config?, logger?, confirm? }`, all optional. The library never prompts, prints, or exits —
it returns data and throws typed `TruecastError`s (each carries a `.hint`).

## What it does
`parseSource → fetch (sandboxed) → validate → cache → materialize → attach`, every managed write routed
through a manifest so it never overwrites a file it doesn't own.

## Where things land
```
~/.truecast/personas/<name>/<ver>/core    the one real copy (global cache)
~/.truecast/personas/<name>/current       → <ver>   (`update` re-points this)
~/.truecast/manifest.json                 what truecast owns (hashes; the clobber guard)
~/.claude/agents/<name>.md                the @agent subagent          (generated)
~/.claude/skills/<name>-<skill>/          the /skills                   (generated)

<repo>/.truecast/agents/<name>/core       → symlink to global current/core (gitignored)
<repo>/.truecast/agents/<name>/instance/  mandate.md · work.md · research/  (YOURS, committed)
<repo>/.truecast/lock                     pins <name> → source@version+commit (committed)
```
Committed in your repo: only `instance/` + the lock. Everything else is global or generated.
