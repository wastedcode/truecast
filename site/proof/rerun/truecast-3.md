# Run truecast-3: truecast's `security-engineer` 1.2.2

One of 18 runs behind Fig. 2 on truecast.dev. Captured 2026-10-16 with Claude Code 2.1.301 and `claude-opus-5-5`, run as `claude -p "$PROMPT" --agent security-engineer`. Whole session: $1.22, 4.1 min. Below the line is the agent's final message, unedited. Method and scoring: [README](README.md).

---

I have what I need. I've read the script and both command sets end-to-end, confirmed the sink in a sandbox, and traced it to exact lines. Here is my verdict.

---

# Security verdict — `truecast-plugin.sh` + `/truecast:*` commands

**GO / NO-GO: NO-GO** — one real cross-trust-boundary write-primitive (P1) must be fixed first. Everything else in the design is unusually well-defended; this is a single idiom that slips past the script's own central guard.

## Trust model I reviewed against
- **Attacker surface:** a user opens an **untrusted cloned repo** in Claude Code and runs `/truecast:install <name> --project` (or `/truecast:remove --project`). The repo contents — every path under the repo root, including `.claude/agents/` — are attacker-controlled. This is exactly the threat the script says it defends (`write_agent_file` comment, line 476–477; `NEW-1`, line 842).
- The marketplace clone and the persona bodies are **trusted** (plugin source). The persona *name* arrives via `$ARGUMENTS` (untrusted) and is validated before use.
- The script's entire thesis is that **`safe_write` guards every write** and refuses a symlink at any path component *and at the leaf* (lines 236–270). My finding is a write that never goes through that guard.

## Findings

### P1 — Symlink through the unguarded `.tmp-$$` path → arbitrary file overwrite outside the repo
`plugin/truecast/bin/truecast-plugin.sh:479-482` (`write_agent_file`)

```sh
safe_write "$root" "$target"            # validates .../security-engineer.md   ✓
mkdir -p "$dir" ...
cp "$WORK/body" "$target.tmp-$$" ...    # but the ACTUAL write is to  $target.tmp-$$   ✗ never validated
mv "$target.tmp-$$" "$target" ...
```

`safe_write` is called on `$target` (the final `.md`), but the real filesystem write is `cp … "$target.tmp-$$"`. **That temp path is never passed through `safe_write`.** `cp` follows a symlink at its destination, so if the attacker's repo ships

```
.claude/agents/security-engineer.md.tmp-<PID>   ->   /home/victim/.bashrc   (or ~/.ssh/authorized_keys, a git hook, a crontab…)
```

the persona body is written **through** that symlink, clobbering a file *outside the repo root*. The leaf FOREIGN check and the `safe_write` walk both inspect `security-engineer.md` — a different path the attacker never touches — so both pass, and the `TRUECAST_RESULT`/plan still name the in-repo path. This is precisely the "write escapes the home while the plan names the in-repo path" failure the script was built to prevent (T-S2 / NEW-1); the guard just isn't on the path that gets written.

**Exploitability:** `$$` is the script's PID. It is not secret and the live range is bounded (`/proc/sys/kernel/pid_max`); an attacker pre-plants a spray of `…md.tmp-N` symlinks across the plausible range in the committed repo. I reproduced the overwrite in a sandbox both by spraying and with the PID known. One mitigating factor keeps this off P0: the **content written is the fixed, trusted persona body**, not attacker-controlled bytes — so this is a reliable *destructive / integrity* primitive (corrupt `~/.bashrc`, truncate-then-fill `authorized_keys`, trash a dotfile) triggered merely by installing into a malicious repo, not a clean code-exec. It is still a full bypass of the containment contract and a cross-boundary write the user never consented to.

**Minimal fix:** write through a name the attacker cannot pre-create. In the validated `$dir`, use `tmp=$(mktemp "$dir/.tc-XXXXXX")` (atomic `O_EXCL` create — a pre-planted symlink of that exact name cannot exist), then `cp`/`mv`. Equivalently, call `safe_write "$root" "$target.tmp-$$"` *as well* — but prefer `mktemp`, which also closes the TOCTOU between check and `cp`.

### P2 — Same idiom in `remove_gitignore_line`
`plugin/truecast/bin/truecast-plugin.sh:507-510`

```sh
tmp="$gi.tmp-$$"
grep -vxF "$line" "$gi" >"$tmp"     # $gi.tmp-$$ under the untrusted repo root, never safe_write'd
... mv "$tmp" "$gi" ...
```

On `/truecast:remove <name> --project`, `$gi.tmp-$$` is `<untrusted-repo>/.gitignore.tmp-<PID>`. A planted symlink there gets written through by the `>` redirect — same class as P1, reachable on the remove path. Same fix (`mktemp` in the repo root, which always exists). `safe_write "$root" "$gi"` on line 492/504 guards the leaf but not this temp.

### P3 (note, not blocking) — `meta.json` temp under `$TC_HOME`
`:447` (`$meta.tmp-$$`). Same unguarded-temp idiom, but the path is under the user's *own* `~/.truecast`, not an attacker-controlled tree, so there's no cross-boundary reach here. Worth folding into the same `mktemp` cleanup for consistency, so the invariant "`safe_write` guards every write" is actually true everywhere.

## What I checked and found solid (not theatre — these are real defenses that hold)
- **Name → shell injection:** `valid_name` (`:169`) runs before the name touches any path; the commands pass it as a single quoted arg and Step 0 of every `.md` re-validates and refuses metacharacters. No eval of the name anywhere. **Clean.**
- **Version → path traversal:** `valid_version` (`:189`) is genuinely careful — rejects the full non-semver alphabet, `..`, leading/trailing dot/dash, and enforces exactly three numeric components, specifically because `$ver` (clone content) is concatenated into `mkdir`/`rm -rf`/`mv` paths. The `case`-glob-matches-`/` reasoning is correct. **Clean.**
- **`safe_write` / `safe_rm` / `inside`** (`:218-270`): the component-walk-plus-realpath design is correct and refuses symlinks at parents, not just the leaf — the right shape. The bug above is solely that two writes don't call it on the path they actually write.
- **Credential redaction:** `clone_origin` (`:420-432`) strips URL userinfo before persisting/printing, so an embedded `https://TOKEN@…` clone URL never lands in `meta.json` or the plan. Matches the CLI's `redactUrl`. **Good.**
- **`patsub_replacement` / `LC_ALL` / `set -u`** (`:36-48`): the bash-5.2 `&`-in-replacement footgun is handled, with the bash-3.2 fallback. **Good.**
- **Consent model:** no `--yes`/`--force` without explicit user approval; plan-only by default; the tool grant and every path are surfaced in `plan_report`; the diff is shown on drift. The commands correctly treat all script output as data-to-relay, not instructions (prompt-injection-aware). **Good.**
- **Foreign-file refusal** on the final target (exit 5) and the FOREIGN-stops-removal (G1) logic are correct for the paths they cover.

## Bottom line
The design is security-serious and most of the hard cases are already right. **One idiom — `cp/redirect` to an `X.tmp-$$` sibling that `safe_write` never sees — breaks the script's own "every write is contained" guarantee** and gives a malicious repo an arbitrary out-of-repo file overwrite on `install --project` (P1) and `remove --project` (P2). Fix both (and P3) by writing through an unguessable `mktemp` name in the already-validated parent directory, then re-run the install/remove `--project` against a repo that plants `*.tmp-*` symlinks to confirm the overwrite no longer lands. After that I'd expect a clean GO.

I reproduced the P1 overwrite in an isolated sandbox and deleted all test artifacts; no changes were made to this repo or to your home directory.
