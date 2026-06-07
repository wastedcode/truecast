---
name: attack-like-a-real-user
description: Use during the runtime adversarial pass — attack the build the way real users (and bad actors) actually behave: malformed input, concurrency, network failure, refresh/back, permissions you shouldn't have, and the second time, not just the first.
---
# Attack like a real user who doesn't behave

The author tested the path they imagined: valid input, one user, a fast network, the first time. Real
users do none of that. Your runtime pass is to behave like the messy, impatient, occasionally malicious
human the author forgot — and find where the build assumed good behavior it won't get.

## The attack catalog (a toolkit to reach for, not a checklist to tick)
- **Input:** empty · whitespace-only · malformed · boundary / off-by-one (0, 1, max, max+1, negative) ·
  huge (paste a novel) · unicode / emoji / RTL · injection (SQL · HTML/XSS · shell · path traversal).
- **State & timing:** concurrent actions (two tabs, two users on one record) · double-submit (the
  double-click, the impatient re-tap) · the **second** time (re-run, re-submit, revisit) · stale data /
  lost update · a race on save.
- **Flow:** network failure mid-flow (kill it between request and response) · refresh / back-button /
  deep-link into a mid-flow URL · partial completion · timeout & retry · close-the-tab-and-return.
- **Auth & permissions:** access an object that isn't yours by changing the id (IDOR) · hit an endpoint
  without the role · act after the session expired · privilege you shouldn't have.
- **Resource & environment:** quota/limit exceeded · disk/quota full · slow device · the platform/locale
  the author didn't use.

## How to aim it
- **Lead with risk** — point the catalog at the hot zones first (`target-the-risk`): the destructive
  action, the auth boundary, the money path, the data write. Don't burn the budget fuzzing a label.
- **The "second time" is the goldmine** — most happy-path code works once; it breaks on re-entry, re-submit,
  stale state, and concurrency. Always do the action twice.
- **Follow the smell** — when one attack wobbles the system, dig there; that's where the bug cluster is
  (hand off to `explore-with-charters` when it becomes an investigation).

## The discipline
- **Reproduce what you break** — an attack that "sometimes" fails isn't a bug report yet; pin it down
  (`reproduce-and-grade`).
- Don't mistake *quantity* of attacks for coverage — one well-aimed attack at the auth boundary beats a
  hundred at the search box.
- Note the platforms/configs you attacked on; "works on my machine" is the author's failure, not yours
  to repeat.
