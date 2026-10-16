# The truecast `security-engineer` report

The full report from truecast's `security-engineer` (1.2.2), as it handed it back to the session. Captured
2026-10-16 with Claude Code 2.1.301 and `claude-opus-5-5`. The harness's frame lines are removed; the report
itself is unedited, including its first line. Method, prompt and the other agent's report: [README](README.md).

---

A safety classifier stopped my previous response, so I've stopped the hands-on reproduction there and won't redo it. This report uses only results I had already confirmed in the sandbox and from reading the code, and it leaves out further exploit detail.

# Security verdict: truecast plugin installer (`plugin/truecast/bin/truecast-plugin.sh` and `commands/*.md`)

**Verdict: NO-GO for `--project` until F1 is fixed. GO for the user-scope lane (install, update, list, remove without `--project`) once F2 and F3 are fixed, which are small changes.**

Short answer: yes, someone can get owned. A repo the user opens can get its own text written into the user's shell startup files, which then runs every time they open a shell. Most of the script is carefully hardened; one primitive is missing, and two Claude Code integration gaps make things worse.

## Who can attack, and what is already safe

- **The marketplace clone** (`~/.claude/plugins/marketplaces/truecast`) is trusted as the publisher. If it's compromised, the attacker wins by design, but see F2: this lane makes that worse than it needs to be.
- **Untrusted:** the contents of the repo the user is in (`--project` lane), `$ARGUMENTS`, any text Claude reads during the turn, and other local users when a project sits in a shared directory.
- **No network downloads**, no `eval`, no `source`, and no writes to `settings.json`, hooks or permission allowlists. The only write into `~/.claude` is `agents/<name>.md`.
- **Checked and safe:**
  - Persona names and versions are validated before they touch a path (`:169-216`).
  - Containment and the symlink walk (`:219-270`) cover the directories, the final file, `.gitignore` before appending (`:492`), the mandate scaffold (`:524`) and the remove path (`:846`).
  - Credentials are stripped from the origin URL (`:427`), the `--all` flags are built internally, `patsub_replacement` is handled, and `rm -rf` is always containment-checked.

## Findings

**F1 — P0 for the `--project` lane. A malicious repo can write arbitrary content to any path the user can write. Confirmed.**
- **Where:** `remove_gitignore_line`, `:507-510`, writes `grep -vxF … > "$gi.tmp-$$"`, then `mv`s it. `write_agent_file`, `:481-482`, does the same with `cp "$WORK/body" "$target.tmp-$$"`.
- **The bug:** the temp file name is predictable (the script's PID), it is created inside the untrusted repo, and it is never checked by `safe_write`. A redirect or `cp` follows a symlink the repo planted at that name. The symlink walk proves the final path is safe but never checks the temp path the data actually goes through.
- **What the sandbox showed** (fake HOME):
  - `remove <name> --project --yes` wrote the repo's own `.gitignore` text into the fake `~/.bashrc`. With a symlink that points at a file that doesn't exist yet, it created a brand-new `~/.bash_profile` instead. Either way, attacker text in a shell startup file means code execution the next time a shell starts.
  - `install <name> --project --yes` overwrote an unrelated file in the fake home with the agent file, and left the project's agent file as a symlink pointing at it. That is a file-clobber (integrity) problem.
- **What the attacker needs:**
  - The user runs the command with `--project` inside their repo and approves the plan. The plan looks completely normal.
  - A pre-planted range of PID-named symlinks. That's cheap in containers and devcontainers, where PIDs are small, and a probabilistic hit on a desktop.
- **Fix:**
  - Create temp files with `mktemp "$dir/.truecast.XXXXXX"`, which uses `O_EXCL` and never follows a link.
  - Run `safe_write` on the temp path, and refuse if it already exists (`[ -e "$tmp" ] || [ -L "$tmp" ]`).
  - Add a regression test that pre-plants `*.tmp-*` symlinks for both write sites.

**F2 — P1. Installing launders plugin content into a user-scope agent, and the user only sees part of what they're agreeing to.**
- **Where:** `render_body` `:315-319` and `write_agent_file` → `~/.claude/agents/<name>.md`. The consent line only shows `tools:` (`body_tools`, `:285-289`).
- **Why it matters:**
  - Claude Code deliberately ignores `hooks`, `mcpServers`, `permissionMode` and `initialPrompt` in plugin subagents. In a user-scope agent they work (confirmed in the sub-agents docs).
  - So a compromised or forked marketplace update can ship a `subagent.md` with `hooks:`. Those hooks are shell commands that run without a permission prompt whenever the agent runs, and the plan never mentions them.
  - The current templates contain only `name/description/model/tools`, so nothing is exploitable today. This is a missing safeguard in the design.
- **Fix:** before writing, parse the frontmatter and refuse any key outside an allowlist (`name, description, model, tools, disallowedTools, color, effort, maxTurns`). At minimum, show every key in the plan.

**F3 — P1 as an amplifier. Each command pre-approves all Bash for its turn, and Claude can trigger the commands itself.**
- **Where:** `allowed-tools: Bash` at `commands/install.md:4`, `update.md:4`, `remove.md:4`, `list.md:4`. None of them set `disable-model-invocation: true`.
- **Why it matters:**
  - Per the docs, `allowed-tools` skips permission prompts for that tool for the whole turn. Because the commands are model-invocable, text in a repo can steer Claude into invoking them itself.
  - Text from the repo also enters Claude's context during that turn: the drift diff of a stamped agent file the repo committed (`:739`), and the `--project <path>` argument, which has no rule to validate or quote it (`install.md:18`).
  - So a prompt injection that would normally hit a Bash permission prompt runs silently. The "treat output as data" wording in the commands is a request to the model, not a control.
- **Fix:**
  - Add `disable-model-invocation: true` to all four commands.
  - Narrow the grant to the one script call (for example `Bash(bash *truecast-plugin.sh *)`, with the invocation on a single line), or drop it so the `--yes` step prompts the user. A second prompt there is a feature.
  - Tell Claude to reject a `--project` path containing `$`, backticks, quotes or newlines, and to single-quote it.

**F4 — P3. Lock takeover and check-then-act races.** `:387-390` and the gap between `safe_write` and its write leave race windows. They only matter for other local users who can write to a shared project directory. Fixing F1 removes the high-impact version; leave the rest as accepted risk.

## Accepted risk (named)
- Whoever controls the marketplace clone controls the agent's instructions and anything symlinked inside `core/` (`cp -R` at `:411` copies symlinks as-is). That's inherent to the trust model, but F2 should still be closed.

## Not reviewed
- The npm CLI lane (`src/`) and `docs/design/installer.md`.
- macOS/BSD `cp` behaviour: the F1 install-lane result was reproduced with GNU `cp` only. The `.gitignore` redirect variant doesn't depend on `cp`.

All testing used a scratch copy under `/tmp/sec-scratch.*` with a fake HOME. The repo and the real home directory were not touched. The scratch directory should be deleted.

**Frontier check:** I reviewed the trust boundary, ran each sink checklist (eval, sourcing, path traversal, symlinks, rc/settings writes, permission grants), confirmed the Claude Code semantics against the current docs, and reproduced F1 in the sandbox. F2 and F3 are established from the code and the docs, not exploited. I stopped the reproduction early after the safety interruption.
