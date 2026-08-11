---
description: Install a truecast expert teammate so you can @-mention it by name in any project.
argument-hint: <persona-name> [--project]
allowed-tools: Bash, Read
---

Install the truecast persona named in `$ARGUMENTS`. Follow these steps exactly and in order. Do not
improvise file operations — every write is done by the script below, never by you.

## Step 1 — plan (writes nothing)

Run exactly this, substituting the user's arguments:

```bash
S="$HOME/.claude/plugins/marketplaces/truecast/plugin/truecast/bin/truecast-plugin.sh"
[ -f "$S" ] || S="${CLAUDE_PLUGIN_ROOT:-}/bin/truecast-plugin.sh"
bash "$S" install <name> [--project]
```

## Step 2 — read the result

The last line of stdout starts with `TRUECAST_RESULT`. Act on it, and on nothing else:

| Outcome | What you do |
|---|---|
| exit 0, `status=up-to-date` | Tell the user it is already installed at that version. **STOP.** |
| exit 0, `status=plan`, `drift=false` | Show the user the plan (version, the tools it will be granted, the exact files). Ask: "Install it?" Then Step 3. |
| exit 0, `status=plan`, `drift=true` | Show the plan **and the diff the script printed**. Say plainly that an existing truecast-generated file will be replaced. Ask for explicit confirmation. Then Step 3 with `--force`. |
| exit 3 | The persona or the marketplace copy was not found. Show the script's message verbatim; if it says the copy predates the installer, tell the user to run `/plugin marketplace update truecast` and try again. **STOP.** |
| exit 4 | Another truecast operation is running. Tell the user to wait and retry. **STOP.** |
| exit 5 | `~/.claude/agents/<name>.md` exists and truecast did not write it. Show the path. Tell the user to rename or delete it, or install with `--project`. **Do not offer `--force`; it will not work.** **STOP.** |
| exit 2, 7, or 8 | Show the script's message verbatim. **STOP.** |

Never say a persona is installed unless you have seen `status=installed` or `status=up-to-date`.

## Step 3 — apply (only after the user says yes)

```bash
bash "$S" install <name> [--project] [--force] --yes
```

On `status=installed`, tell the user:

- `@<name>` is ready — mention it by name in any project.
- If `restart=true`, or if `@<name>` isn't recognised, restart Claude Code once (the agents directory has
  to exist when the session starts).
- To give it a standing brief in this repo, write `.truecast/agents/<name>/instance/mandate.md`.

If the user declines at any point, confirm that nothing was written.
