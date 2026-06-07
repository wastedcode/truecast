---
name: eliminate-toil
description: Use when ops work is manual, repetitive, and scaling with growth (manual deploys, hand-run migrations, copy-paste fixes, ticket-driven provisioning) — identify the toil and automate it away so ops doesn't grow linearly with the system.
---
# Eliminate toil — automate the third time you do it by hand

**Toil** (SRE term) is operational work that is manual, repetitive, automatable, tactical, devoid of lasting
value, and **scales linearly with the service.** It's the thing that, left alone, means a 2× bigger system
needs 2× the ops humans — which doesn't scale and burns people out. Your job is to drive it toward zero.

## Identify it
Toil looks like: deploying by hand, running migrations manually, restarting things on a schedule, manually
provisioning access/resources via tickets, copy-pasting the same fix, hand-assembling reports, click-ops in a
console. The tell: **"I've done this exact thing before, by hand, and I'll do it again."**

## The method
1. **Measure it.** Roughly track how much time goes to toil vs. engineering. SRE's rule of thumb caps toil at
   ~50% so the team always has capacity to *reduce* it; if toil is eating everything, the system out-runs you.
2. **Rule of three.** Do it once, fine. Twice, note it. **The third time, automate it** — the manual cost has
   now proven it's recurring.
3. **Automate the whole loop, including the safety.** Don't just script the happy path — script the
   verification and the rollback too, so the automation is *safer* than the human, not just faster (a fast way
   to do the wrong thing globally is how you get a CrowdStrike).
4. **Prefer self-service over a ticket queue.** The highest-leverage toil-kill is turning "file a ticket and
   wait for infra" into "the developer does it safely themselves on the paved path" (`pave-the-golden-path`).
5. **Delete, don't just automate.** Sometimes the toil exists because of an upstream design choice — fix that
   (consult `software-architect`) instead of automating a process that shouldn't exist.

## The discipline
- Automating toil is real engineering work and must be prioritized as such — "we're too busy with ops to fix
  ops" is the trap that the toil budget exists to break.
- Right-size it: don't build a self-service platform for a task you do twice a year (`right-size-reliability`).
  Automate what recurs and what's risky-by-hand; document the rest.
- Automation you don't trust is worse than toil — if you can't trust it to run unattended (with verification +
  rollback), you've built a faster foot-gun.
