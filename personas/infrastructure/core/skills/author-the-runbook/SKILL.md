---
name: author-the-runbook
description: Use when documenting how to deploy, operate, or recover a service, or after learning something a release/incident taught you — write a runbook so good a competent stranger could ship or recover from it alone.
---
# Author the runbook — a competent stranger could ship from this page

The bar for operational docs: **a competent engineer who has never seen this product could ship it, or recover
it, safely from this page alone — at 3am, half asleep.** If only one person knows how to deploy or recover the
system, that person *is* the single point of failure.

## The deploy/release runbook
1. **Pre-flight** — what must be green (CI, plan reviewed), and the one sanctioned door to prod (never a
   freelance merge).
2. **Blast radius** — what's stateful / one-way in this change, and the rollback for each piece
   (`map-blast-radius`).
3. **Deploy** — the exact, scripted, idempotent steps (commands/pipeline), not prose. Copy-pasteable.
4. **Verify the release** — the smoke checks that confirm it's actually serving and healthy (not "looks fine").
5. **Rollback** — the exact steps, already tested, and the **trigger** ("if error rate > X, roll back").
6. **Observability** — exactly where to look to know it's healthy (which dashboard, which logs, which alert).

## The incident/recovery runbook (linked from every alert)
- **Per alert**: what it means, how to confirm it's real, the first mitigation to try, how to escalate, and the
  rollback. An alert with no runbook is a puzzle dumped on whoever's on-call.
- Keep recovery steps for the known failure modes this service has (restart order, failover, cache flush,
  re-drive a queue) — derived from past postmortems.

## The discipline
- **Grow it from real events.** Extend the runbook every time a release or incident teaches you something — the
  first real ship is when you start the "project specifics" section (where it runs, what's stateful, the
  highest-ROI controls). A runbook that isn't updated rots into a lie.
- **Steps, not prose.** "Restart the service" is not a step; the exact command is. Test it by having someone
  else follow it.
- **Captured knowledge beats heroics.** The goal is to make yourself replaceable on the routine path so your
  judgment is spent on the genuinely hard calls, not on being the only one who knows the magic incantation.
