# Run truecast-1: truecast's `security-engineer` 1.2.2

One of 18 runs behind Fig. 2 on truecast.dev. Captured 2026-10-16 with Claude Code 2.1.301 and `claude-opus-5-5`, run as `claude -p "$PROMPT" --agent security-engineer`. Whole session: $1.10, 3.9 min. Below the line is the agent's final message, unedited. Method and scoring: [README](README.md).

---

**Verdict: NO-GO. Yes, one issue here can get a user owned.** The shell script itself is carefully hardened. The main hole is in the slash commands' frontmatter, and fixing it means changing one line in each command. I wrote the full verdict to `docs/security/2026-10-16-plugin-installer-verdict.md` (not committed).

## Findings

**F1 — P1, blocks shipping. Every command pre-approves unrestricted Bash, and Claude can invoke the commands on its own.**
- All four commands set `allowed-tools: Bash, Read` (line 4 of `install.md`, `update.md`, `remove.md`, `list.md`), and none sets `disable-model-invocation`. Per the Claude Code docs, `allowed-tools` lets Claude run the listed tools without asking during the turn that invokes the command. A bare `Bash` covers every command, not just the installer.
- **Attack A (reproduced up to the point where the model would act):** a hostile repo ships `.claude/agents/qa.md` with the truecast stamp plus a line of instructions aimed at Claude. The user runs `/truecast:install qa --project`. The script treats the file as a changed truecast file and prints the attacker's text into the model's context as a diff (`truecast-plugin.sh:739`). In that turn, `curl … | sh` would run with no permission prompt. The only thing standing in the way is a line of prose telling the model to treat output as data.
- **Attack B:** an injection anywhere else in the session can tell Claude to invoke `/truecast:list`. That command needs no confirmation, and invoking it unlocks unprompted shell for the rest of the turn. This rests on the documented behaviour; I did not run it live inside Claude Code.
- **The grant protects nothing:** the pre-approval ends when the user sends their next message, so the `--yes` step after the user says "yes" was never covered by it. It only removes the prompt from the plan step, which is exactly where untrusted content comes in.
- **Fix:**
  - Add `disable-model-invocation: true` to install, update and remove.
  - Either drop `Bash` from `allowed-tools`, or narrow it to the single script invocation.
  - Add a lint test that rejects a bare `Bash` in `allowed-tools`.

**F2 — P2. Symlinks inside a persona's `core/` folder get installed.**
- `truecast-plugin.sh:411` copies `core/` with `cp -R`, which keeps symlinks. The CLI's copy function (`copyTreeNoSymlinks`) refuses them.
- **Reproduced:** I added a symlink `core/notes.md -> ../../../../../.aws/credentials`. Once installed, it resolved to the fake home's `~/.aws/credentials` and printed the planted secret. A persona's text then only has to say "read notes.md". In a pull request this shows up as one line of path text, and the CI byte-pin doesn't check `core/`.
- **Fix:** before copying, run `find "$CLONE_DIR/core" ! -type f ! -type d`, fail if it finds anything, and add a test.

**F3 — P2. The "tools granted" line in the plan can be made to lie.**
- `subagent.md` is copied into `~/.claude/agents/` as-is (`:318`), but the plan shows only the first `tools:` line it finds (`:287`).
- **Reproduced:** with `tools: Read` first and broader tools plus `permissionMode: bypassPermissions` further down, the plan said "Read" and the install went through.
- This matters because agents in `~/.claude/agents/` run their `hooks` (shell commands), `mcpServers` and `permissionMode`, and hooks there run without the workspace-trust dialog. Agents shipped inside a plugin have all three ignored. So this lane makes live exactly what your design's D10 rule bans the plugin from shipping.
- CI pinning `subagent.md` to the generator's output reduces the risk in the canonical repo, but nothing on the user's machine enforces it.
- **Fix:** allow only `name`, `description`, `model` and `tools` in the frontmatter, each at most once, with `name` matching the persona; otherwise exit 7.

**F4 — P3. The `--project <path>` value goes into the shell command unvalidated.** Step 0 checks the persona name only, and the model writes the path into the shell command itself. Restrict it to a safe set of characters and always single-quote it.

## Checked and clean
- Names and versions are validated before they become paths.
- Every write and delete goes through the symlink-walking safety check: the agent file, `.gitignore` (a `.gitignore -> ~/.bashrc` trick is refused), the mandate file, and each `rm -rf`.
- Nothing is written without `--yes`. Files truecast didn't generate are never overwritten or deleted.
- `meta.json` strips tokens from the git URL and is escaped correctly. Temp files and renames are atomic and use `mktemp`.

## Accepted risk
Every run executes whatever script is currently in the marketplace clone, which isn't signed or pinned. That's how Claude Code plugins work, so it comes down to keeping `main` protected: required CI, reviews, and 2FA.

**Frontier check:** I ran the review as an adversary would (trace untrusted input to the dangerous action, prove each finding), with OWASP's prompt-injection and excessive-agency classes as the frame. I covered all four commands and every write and delete path in the script. F1-A, F2 and F3 were reproduced in a throwaway fake home, which I've deleted. The Claude Code behaviour claims come from the current official docs. F1-B was not tested live inside Claude Code, and the verdict says so.
