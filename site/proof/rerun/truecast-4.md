# Run truecast-4: truecast's `security-engineer` 1.2.2

One of 18 runs behind Fig. 2 on truecast.dev. Captured 2026-10-16 with Claude Code 2.1.301 and `claude-opus-5-5`, run as `claude -p "$PROMPT" --agent security-engineer`. Whole session: $0.96, 3.4 min. Below the line is the agent's final message, unedited. Method and scoring: [README](README.md).

---

**Verdict: NO-GO, but only until two small fixes land.** One real path can get a user owned. It needs `--project` mode inside a malicious repo. Everything else in the scripts holds up well. I also saved the verdict to `docs/security/plugin-installer-verdict.md`.

## How the attack works
The script assumes, correctly, that a repo used with `--project` is untrusted. It checks every real path it writes for planted symlinks (`safe_write`). But it never checks the temp files it writes just before renaming them into place. Those are named `<file>.tmp-$$`, where `$$` is the script's process ID. If the repo ships a symlink with that name, the write goes wherever the symlink points.

## Findings
| # | Grade | Where | What |
|---|---|---|---|
| **F1** | **P1** | `truecast-plugin.sh:507-510` (`remove_gitignore_line`) | `remove <name> --project --yes` writes the filtered `.gitignore` to `.gitignore.tmp-$$` with a plain `>`. A planted symlink there means **text the repo controls gets written to any file the user can write**. A shell startup file is the obvious target, and that runs code on the next shell. Afterwards `.gitignore` itself becomes a symlink. **I reproduced this in a sandbox:** a scratch file outside the project received the repo's lines, and the run exited 0. |
| **F2** | P2 | `:481-482` (`write_agent_file`) | Same bug on `install --project --yes`. Here `cp` writes to the planted `<agent>.md.tmp-$$`, so any user file is overwritten with the agent text. The content is fixed, so it destroys files rather than running code. The agent file is left as a symlink. Also reproduced, also exit 0. |
| F3 | P3 | `:447` | Same pattern for `meta.json`. It sits inside `~/.truecast`, which only the user can write, so it can't be exploited today. Fix it anyway. |
| F4 | P3 | `commands/update.md`, Step 3 | The plan step accepts `--project`, but the apply command leaves it out. The user approves a project-only change and gets a change to their global `~/.claude/agents`. |
| F5 | P3 | `install.md` / `remove.md`, Step 0 | The persona name is validated. The `--project <path>` value is not, and the model is never told to quote it before putting it in a shell command. |

**How hard is the attack?** The repo has to guess the process ID, for example by shipping symlinks across the whole ID range. The user also has to run an apply step (`--yes`) in that repo. For F1 that's a plausible move: a repo ships its own "truecast" agent file, and the user removes it. So it takes some setup, but it's real. That's why it's graded P1 and not P0.

**The fix for F1–F3:** create each temp file with `mktemp "$dir/.<name>.XXXXXX"` in the same directory. That gives a random name, refuses to reuse an existing file, and works on both Linux and macOS. Abort if `mktemp` fails, then `mv` into place as now. It's about three lines. Add regression tests to `src/installer/script.test.ts` that plant `*.tmp-<pid>` symlinks and check that the outside file is untouched.

## Checked and holding
- **Inputs:** the persona name is validated before it touches any path. A version string from the marketplace copy can't contain `../`.
- **Writes and deletes:** the symlink check covers every folder on the path and the file itself, then confirms the real path. Deletes outside the truecast and Claude home folders are refused. Agent files truecast didn't write, or that are symlinks, are never overwritten or deleted. Leftover-lock cleanup stays inside `~/.truecast`.
- **Leaks and consent:** credentials are stripped from the remote URL before it's saved or printed. Nothing is written without `--yes`.
- **Other:** `git` never runs inside the untrusted project. The `${CLAUDE_PLUGIN_ROOT:-}` fallback points at `/bin/…`, which only root can write.

## A design question for the architect
This isn't a bug in these files. The installed agent template says a repo's `.truecast/agents/<name>/instance/mandate.md` "overrides your general defaults". That lets a cloned repo give orders to a teammate that can run shell commands. It's the same kind of risk as a repo's `CLAUDE.md`, but with stronger wording. My recommendation: treat the mandate as context about the project, never as permission to bypass safety rules. Until the architect decides, I've logged it as an accepted risk.

**Frontier check:** benchmarked against Trail of Bits / Project Zero practice for installers: map who controls what, follow each untrusted input to every place it's written, and reproduce findings before reporting. Beyond the obvious checks (path traversal, symlinked parent folders), I traced every write and delete in the script, including temp files and lock folders. That's where both real bugs were. F1 and F2 were confirmed by running them against harmless scratch files. Nothing is reported that wasn't traced to a line number.
