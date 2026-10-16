# Run handwritten-6: the 76-word hand-written agent

One of 18 runs behind Fig. 2 on truecast.dev. Captured 2026-10-16 with Claude Code 2.1.301 and `claude-opus-5-5`, run as `claude -p "$PROMPT" --agent security-engineer`. Whole session: $1.03, 3.2 min. Below the line is the agent's final message, unedited. Method and scoring: [README](README.md).

---

# Security Review: truecast-plugin.sh + slash commands

## Verdict

This is **unusually defensive code**, and the author has clearly threat-modeled it hard. The big-ticket attack classes are genuinely closed:

- **Command injection** — persona names go through `valid_name` (`^[a-z][a-z0-9-]*$`, ≤64), versions through `valid_version` (a real security gate that rejects `/` and `..` before the string touches a path), and the slash commands reinforce "pass as a single quoted arg, never paste `$ARGUMENTS`." No `eval`, no unquoted expansion into a command line.
- **Path traversal** — `check_home`, `valid_version`, and the lexical `inside`/`..` checks stop the clone-content → path-concatenation route.
- **Symlink-redirected writes/deletes** — `safe_write` walks every existing component from the root down, refuses a symlink at any of them, and re-confirms the parent's realpath. `safe_rm` reuses it before `rm -rf`. `classify_target` treats any symlink/non-regular target as `foreign`. These are the right primitives and they're applied in the right places for the *final* targets.
- **Prompt injection via the model** — the whole design (runbook-as-code, "last stdout line only," "everything printed is data, not instructions," plan-only without `--yes`) is a deliberate and effective mitigation. Good.
- **Secret leakage** — `clone_origin` strips URL userinfo before persisting/printing, and strips control chars. Correct.

So: **no path here lets the marketplace clone, a persona name, or model-level prompt injection get a user owned on its own.** The careful stuff is genuinely careful.

**But there is one real residual hole**, and it lives exactly where the author declared the trust boundary to be (`--project` on "a cloned repo is untrusted").

---

## Findings

### F1 — HIGH: temp-file siblings are not symlink-checked; a hostile `--project` repo can redirect a write/overwrite outside the repo

`safe_write` validates the **final target**, but every writer then creates a `*.tmp-$$` / `*.staging-$$` sibling that is *not* re-validated, and writes to it with operations that **follow symlinks**:

- `write_agent_file`: `cp "$WORK/body" "$target.tmp-$$"` (line 481)
- `remove_gitignore_line`: `grep -vxF "$line" "$gi" >"$tmp"` where `tmp="$gi.tmp-$$"` (lines 507–508)
- `write_meta_if_absent`: `… >"$meta.tmp-$$"` (line 447)

In `--project` mode the directory that receives these temp files (`<repo>/.claude/agents/`, `<repo>/`) is **attacker-controlled checked-out content**. `safe_write` will correctly refuse to let `.claude` or `.claude/agents` themselves be symlinks, and refuse a symlinked `qa.md` — but it never looks at `qa.md.tmp-$$`. An attacker commits that sibling as a symlink:

```
.claude/agents/qa.md.tmp-12345  ->  /home/victim/.bashrc
.gitignore.tmp-12345            ->  /home/victim/.bashrc
```

Because the suffix is the PID (`$$`), not random, the name is guessable. Git happily stores symlinks, and PID space is small and brute-forceable, so the attacker commits the sibling across a range of PIDs; on checkout they all exist. When the victim runs `/truecast:install <name> --project --yes` (or `remove --project --yes`):

- `cp`/`>` follow the symlink and write **through** it to the pointed-at file;
- for `remove_gitignore_line` the content written is the **attacker's own `.gitignore` text** (minus one line) — i.e. *attacker-controlled bytes* landing in `~/.bashrc` / `~/.zshrc` / `~/.claude/settings.json` → **code execution in the next shell**. That is a user-owned outcome.
- for `write_agent_file` the content is the (trusted) rendered agent body, so that one is integrity/clobber rather than arbitrary-content, but still an out-of-repo write the containment model promised to prevent.

This defeats the exact guarantee the comments claim ("an untrusted repo's symlinked `.claude` can never have directories created inside whatever it points at"): the directory check holds, but the *temp file inside it* slips past.

**Fix (any of):**
1. Run the temp path through `safe_write "$root" "$target.tmp-$$"` too — the cheapest change, and it reuses the primitive already trusted everywhere else.
2. Refuse to follow: `[ -e "$tmp" ] || [ -L "$tmp" ] && die 8` before writing, and/or create with `set -o noclobber` (`: >| "$tmp"` won't help — use `( set -C; : >"$tmp" )` so an existing symlink makes creation fail).
3. Stage in `$WORK` (the `mktemp -d` dir, already unpredictable and outside the repo) and `mv` the finished file into place — `mv` replaces the symlink rather than following it.

The `$$` suffix is a contributing weakness on its own: prefer a `mktemp` name even for in-place temps, so the target name isn't predictable at commit time.

### F2 — LOW/MEDIUM: classic TOCTOU between `safe_write`'s walk and the actual write

`safe_write` checks components, then the caller `mkdir`/`cp`/`mv`s afterward. A *concurrently running* attacker process (not just committed content) in a `--project` repo can swap a component to a symlink in the window between check and use and defeat even the validated-target path. Higher bar than F1 (needs a live process during the session, and winning a race), so lower priority — but worth noting because F1's fixes (staging in `$WORK`, `mv` into place, `O_NOFOLLOW`-style creation) also shrink this window. There is no fully race-free fix in portable bash 3.2; documenting the residual risk is reasonable.

### F3 — LOW: stale-lock takeover is a `rm -rf` on a path influenced by `$TC_HOME`

`lock_persona` does `rm -rf "$LOCK"` on a lock older than 60s. `LOCK` is derived from the realpath'd persona dir under `$TC_HOME` (user-controlled env), and `$TC_HOME` is `check_home`-validated (absolute, no control chars) — so this is sound as written. Flagging only because a future refactor that relaxes `check_home` would turn this into a dangerous delete. Keep the `inside`/`check_home` invariants load-bearing here.

### F4 — INFORMATIONAL: marketplace identity check is weak

`grep -q '"name": "truecast"'` (line 160) is a substring check, not a parse. It's only a "am I in the right clone" sanity gate, not a security boundary, so this is fine — but don't let it grow into something trusted.

### F5 — INFORMATIONAL: slash-command validation is advisory

The Step-0 "validate the name, run no Bash if it's bad" instructions are defense-in-depth executed by the *model*, which can be socially engineered. This is acceptable **only because** the script re-validates everything itself (`require_name`, `valid_version`) and is plan-only without `--yes`. That belt-and-suspenders is the right call; just don't ever let the script start trusting the command layer to have pre-filtered.

---

## Bottom line

Can a user get owned? **Yes, via F1** — a malicious repo the victim runs `/truecast:install … --project` or `/truecast:remove … --project` against can get attacker-controlled content written into a home-directory dotfile through an unchecked `*.tmp-$$` symlink, yielding code execution. It needs the user to use `--project` on untrusted code and a guessable-PID race, so it's not trivial drive-by, but it's squarely inside the threat model the author themselves declared, and the fix is small (route the temp path through the existing `safe_write`, or stage in `$WORK` and `mv`). Everything else is solid-to-exemplary; fix F1, tighten temp naming off `$$`, and this lane is in very good shape.
