---
name: hand-over-commands-that-run
description: Use whenever you give a human a command to run, especially as root or on a box you can't reach yourself. Test it for their exact shell, user and environment first. No placeholders. Output goes to a file you can read. State whether it's reversible. Then get the access to verify it yourself.
---
# Hand over commands that run first time

A command you hand to a human that fails costs them a round trip and costs you their trust. "how do you
keep breaking this?" is the review you get. When someone else has to run it (root, a box you can't
reach, a console only they hold), treat the command as shipped code.

## Before you hand it over
1. **Know their execution context.** Do they run as root directly, or use `sudo`? Which service user owns
   the job? What HOME, PATH, virtualenv and installed modules does *that* user have? A module installed
   for your user is not installed for root. If you don't know, ask once, then record it in the runbook.
2. **Run it yourself first** wherever you can: the same command in a matching environment, or a
   `--dry-run`/`plan`/`--check` mode. Run `shellcheck` on any script. Systemd units get
   `systemd-analyze verify`; configs get the tool's own validator.
3. **No placeholders.** Every path, DSN, ID and filename is real. If a value is secret, the command reads
   it from the file it lives in and never asks the human to paste it into the shell.
4. **Bounded, readable output.** Tee to a file you can read back (`… 2>&1 | tee /tmp/<task>-$(date +%s).log`)
   and cap the noise. The human shouldn't have to copy a scrolling terminal back to you.
5. **Reuse what exists.** Use the existing service user, timer and deploy script. A new user or unit needs
   a reason you can state in one line.
6. **Say what it changes and how to undo it.** One line on scope (what files, services and zones it
   touches) and one on reversal. If it isn't reversible, say so and take a backup first.

## The hand-over format
```
# what: <one line>   scope: <what it touches>   reversible: <yes — how | no — backup at …>
<the exact command(s), copy-paste safe, one per line>
# then: I'll read <log path> and confirm <expected line/exit>
```
Give one block, not a menu of variants. If it's long, make it a checked-in script and hand over one
line that runs the script.

## After
- Read the log yourself and confirm the expected result. Don't ask the human to interpret it.
- If you'll need to check this box again, ask for durable read access (logs, `systemctl status`, a
  status file) now, so next time you can verify on your own.
- Add the command, its context and any surprise to the runbook (`author-the-runbook`).
