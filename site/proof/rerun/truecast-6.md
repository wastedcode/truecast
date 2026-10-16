# Run truecast-6: truecast's `security-engineer` 1.2.2

One of 18 runs behind Fig. 2 on truecast.dev. Captured 2026-10-16 with Claude Code 2.1.301 and `claude-opus-5-5`, run as `claude -p "$PROMPT" --agent security-engineer`. Whole session: $0.94, 4.9 min. Below the line is the agent's final message, unedited. Method and scoring: [README](README.md).

---

Cleaned up. The primitive is confirmed deterministically: `cp`/`>` follow a symlink planted at the atomic-write *temp sibling* (`<file>.tmp-$$`), and that temp path is the one write target in the whole script that is **not** run through `safe_write`. Here is my full verdict.

---

# Security verdict — `truecast-plugin.sh` + `/truecast:*` commands

## Trust model (what's actually in scope)
These run inside the user's own Claude Code session and write under `$HOME`. The genuinely untrusted inputs are:
1. **A hostile git repo the user has open** — attacker controls the entire tree the `--project` lane writes into (`$PWD` / repo root). *This is the real adversary.*
2. **`$ARGUMENTS`** from the slash command (the model composes a shell line from it).
3. **Marketplace clone content** — the persona `version` string and `subagent.md` body (semi-trusted; it *is* the product).

The user's own `$HOME` and the marketplace clone are trusted. So the question that matters: **can a repo the user merely opened get them owned when they run a `/truecast:*` command in it?**

## What's genuinely good (not theatre — I tried to break each)
- **Name injection: closed.** `valid_name` (l.169) gates `^[a-z][a-z0-9-]*$` *before* the name touches any path or command line, and the commands pass it as a single quoted arg. I could not get `;`, `$()`, `..`, or spaces through.
- **Version-as-path injection: closed.** `valid_version` (l.189) rejects `/`, `..` and the `1.0.0/../../..` class before `$ver` is concatenated into a path — with the exact `case`-glob reasoning spelled out. Correct.
- **Symlinked-parent redirection: closed on the declared write targets.** `safe_write` (l.242) refuses `..`, walks every component refusing a symlink at each (leaf included), then realpath-confirms the parent is under the root. The `--project` vs user-lane asymmetry (l.591) is deliberate and right. My planted `.claude`, `.claude/agents`, `.truecast`, and `.gitignore` symlinks were all refused (matches the test suite's T-S2 / NEW-1 / NEW-2).
- **Credential & control-char scrubbing** on the persisted source (l.424–431), **G1 write-ordering**, **lock canonicalisation**, **`patsub_replacement` / `pipefail` / `LC_ALL`** hardening — all thoughtfully done. This is well above the usual bar.
- **The command prose** correctly frames script output as *data, not instructions*, validates `$ARGUMENTS` before running anything, and keeps `--yes`/`--force` out of the plan step. Good.

## Finding — F1 (P2, must-fix): the atomic-write temp sibling is not containment-checked
**`file:line`:**
- `write_agent_file` — l.481: `cp "$WORK/body" "$target.tmp-$$"` (only `$target` is passed to `safe_write`, l.479; the `.tmp-$$` sibling is not)
- `remove_gitignore_line` — l.507–508: `tmp="$gi.tmp-$$"; grep -vxF "$line" "$gi" >"$tmp"` (no `safe_write` on `$tmp`) — **sharpest, because the content written is attacker-controlled**
- `write_meta_if_absent` — l.447: `>"$meta.tmp-$$"` (under `$TC_HOME`, so lower risk)

**Input → sink → effect.** In the `--project` lane the temp sibling sits in an **attacker-controlled directory** (the repo's `.claude/agents/` or repo root). `cp` and `>` both follow a symlink at that leaf. So a hostile repo that pre-plants a symlink named `.claude/agents/<name>.md.tmp-<PID>` → victim, or `.gitignore.tmp-<PID>` → victim, redirects the write **outside the repo**:
- via `remove --project`: the tmp content is the repo's own `.gitignore` minus one line — i.e. **fully attacker-controlled text** — landing in e.g. `~/.bashrc` → **code execution on next shell**.
- via `install --project`: the tmp content is the persona body — arbitrary **clobber/truncation** of e.g. `~/.ssh/authorized_keys` → destructive.

I confirmed the follow-through deterministically (a `cp` into a planted `*.tmp-999` symlink overwrote the link's target). This **defeats the script's own central invariant** — "`safe_write` before ANY write" — at the one site it was forgotten.

**Why P2, not P0/P1.** The only barrier is guessing `$$`: the attacker must pre-plant a symlink at the exact PID the fresh `bash` gets. On stock `pid_max=32768` hosts and macOS that range is small enough to blanket-plant (practical, if noisy); on systemd's `pid_max=4194304` (this box) it's ~probabilistic and expensive. It also needs the user to run a `--project … --yes` op inside the hostile repo. Real and sharp on common configs, but gated and not silent — hence P2, and I'd call it P1 on small-PID hosts.

**Minimal fix (uses the script's own primitive — one line per site):**
```sh
# write_agent_file, before l.481:
safe_write "$root" "$target.tmp-$$"
# remove_gitignore_line, before l.508:
safe_write "$root" "$tmp"
# write_meta_if_absent, before l.447 (defense-in-depth):
safe_write "$TC_HOME" "$meta.tmp-$$"
```
`safe_write`'s walk already refuses a symlink at the leaf, so this closes it directly. (Belt-and-braces: these could also create with `set -o noclobber`/`O_EXCL`.)

## Accepted-risk notes (not blockers)
- **Marketplace `subagent.md` → agent system prompt.** The rendered body becomes a sub-agent definition with a `tools:` grant; the plan surfaces the grant (`body_tools`, l.285) — good consent surface. Content trust rides on marketplace integrity (supply chain); that's inherent to the product, not a script bug.
- **`--all` recursion** (l.768) re-execs `$SCRIPT` derived from `$0`; benign here.

## Verdict: **CONDITIONAL GO**
GO for the user-lane, all plan-only (no-`--yes`) paths, and `list` — I found nothing exploitable there. **NO-GO on the `--project` `install`/`remove --yes` paths until F1 is fixed** — the three temp siblings must get the same `safe_write` the script already applies to every other write. The fix is three lines and carries no behavioural risk. Re-review is just confirming those three calls land before their writes.

One correction to note on housekeeping: the git-commit attribution reminder changed model name mid-session (Opus 5.5 → 4.8); if you have me commit this fix I'll use whichever is current at that time.

Want me to apply the three-line fix and add a regression test mirroring the existing T-S2 cases?
