# Run handwritten-4: the 76-word hand-written agent

One of 18 runs behind Fig. 2 on truecast.dev. Captured 2026-10-16 with Claude Code 2.1.301 and `claude-opus-5-5`, run as `claude -p "$PROMPT" --agent security-engineer`. Whole session: $0.68, 3.3 min. Below the line is the agent's final message, unedited. Method and scoring: [README](README.md).

---

I have everything I need from a careful static read (I won't run live exploit attempts — I can reason about the write paths directly).

## Verdict

This is unusually well-hardened code. The author has clearly threat-modeled the untrusted-repo and symlinked-home cases and built real primitives (`valid_name`, `valid_version`, `safe_write`, `safe_rm`, the `foreign` classification, plan-before-write, credential redaction) that hold up under scrutiny. **No path here gives an attacker remote code execution or a straightforward "own the user" primitive.** The command files also handle prompt-injection correctly (treating all script output as data, acting only on the `TRUECAST_RESULT` line and exit code, validating `$ARGUMENTS` before composing a shell line).

There is **one genuine containment-escape bug** (Medium) in the `--project` lane, plus a few low/informational notes. Details below.

---

## Findings

### M1 — Predictable `*.tmp-$$` files are written into the untrusted repo dir without the symlink check applied to the final target (`--project` only)

**Severity: Medium** (local, requires a crafted repo; impact is arbitrary-location file *overwrite*, not RCE)

`safe_write` is the project's whole defense against symlinked components — and it's applied to the *final* target path. But the actual write goes to a sibling temp file whose leaf name is **not** passed through `safe_write`:

- `write_agent_file` (lines 481–482):
  ```sh
  cp "$WORK/body" "$target.tmp-$$" || die 8 ...
  mv "$target.tmp-$$" "$target"
  ```
- `remove_gitignore_line` (lines 507–510): `grep -vxF ... >"$gi.tmp-$$"` then `mv`.

In `--project` mode the target directory (`<repo>/.claude/agents/`) is **attacker-controlled content** — the whole script treats a cloned repo as untrusted. `safe_write` confirms `.claude` and `.claude/agents` are real directories, but it never looks at the `qa.md.tmp-<pid>` leaf. `cp`/`>` **follow a symlink at the destination**. So a repo that ships a symlink at `.claude/agents/qa.md.tmp-<pid>` → `$HOME/.bashrc` (or `~/.claude/settings.json`, any file) causes the `cp` to write *through* that link, escaping the containment root while the plan and `TRUECAST_RESULT target=` still name the in-repo path.

The leaf name is predictable: `$$` is the script's PID. `pid_max` here is 4194304, but on many systems it's 32768, and an attacker can simply commit symlinks for the plausible PID range (git stores symlinks cheaply). The final `mv` is *not* the problem — rename replaces a symlink leaf rather than following it — the `cp`/redirect into the temp leaf is.

**Impact:** overwrite of an arbitrary user-writable file. The written content isn't fully attacker-controlled (it's the rendered persona markdown, or the filtered `.gitignore`), so this is an integrity/DoS primitive (clobber `~/.bashrc`, `~/.claude/settings.json`, a teammate file) rather than RCE — but it violates the containment guarantee the rest of the script works hard to maintain.

**Fix:** don't create the staging file by a name an attacker can pre-plant, or verify the leaf before writing. Concretely, either:
- refuse a symlink at the temp path first: `[ -L "$target.tmp-$$" ] && die 7 ...; rm -f "$target.tmp-$$"` immediately before the `cp` (narrows but still races), **or better**
- create the staging file with `mktemp` *inside the already-validated directory* (`mktemp "$dir/.tcXXXXXX"`) so the name is unpredictable and `mktemp` won't open through a symlink, then `mv` into place. Apply the same to `remove_gitignore_line`'s `$gi.tmp-$$`.

(The `$STAGING="core.staging-$$"` and `meta.json.tmp-$$` writes are **not** affected — they live under `$TC_HOME`, the user's own trusted home, where an attacker can't pre-plant. `safe_write`/`safe_rm` already guard the *directory* chain there. The issue is specifically temp leaves created in the untrusted `--project` tree.)

---

### Low / Informational

- **L1 — `append_gitignore` is safe, confirming the pattern.** It writes with `>>"$gi"` *after* `safe_write "$root" "$gi"` on the real path, and `safe_write` refuses a symlink at `.gitignore` itself. This is the correct shape — M1 is only where the write goes to an *unchecked* temp leaf instead of the checked path.

- **I1 — stale-lock takeover is a minor local DoS/race, not an escape.** After 60s, `lock_persona` does `rm -rf "$LOCK"` and re-creates it. `LOCK` is `"$real.lock"` where `real` is the `pwd -P`-resolved persona dir under `TC_HOME`, so it can't be redirected outside the home, and a competing live CLI refreshes its mtime every ~15s. Worst case is two operations racing on one persona's tree after a `kill -9`; acceptable and documented.

- **I2 — relayed clone content is trusted-ish.** The plan prints the persona diff, version, and `meta.json` `source` to the model, which relays it. These come from the marketplace clone (`$CLONE`), not from the `--project` repo, so they're as trusted as the marketplace. The command files correctly frame all of it as data. Fine as-is; just note that marketplace compromise would let crafted text reach the model — inherent to the feature.

- **I3 — good hardening worth calling out so it isn't regressed:** `valid_version` is a real security gate (clone-content version is concatenated into `rm -rf`/`mkdir`/`mv` paths, and it rejects `..`, `/`-via-`*`, and 4-component versions); `patsub_replacement` is disabled to stop `{{TRUECAST_HOME}}` survival; `clone_origin` strips URL userinfo and control chars before persisting/printing (prevents token leakage into `meta.json`); `safe_rm` reuses the full `safe_write` walk so deletes get the same symlink proof as writes; `classify_target` treats any symlink/non-regular-file target as `foreign` and refuses it. These are the right calls.

---

**Bottom line:** no RCE or privilege-escalation path; the one bug (M1) is a `--project`-only, crafted-repo, arbitrary-file-*overwrite* via an unchecked predictable temp-file leaf — Medium. Fix it by creating staging files with `mktemp` in the validated directory (or refusing a symlink at the temp leaf) so the temp path gets the same containment guarantee as the final target. Everything else is solid.
