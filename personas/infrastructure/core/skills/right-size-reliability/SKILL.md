---
name: right-size-reliability
description: Use when deciding how much ops rigor/ceremony a change or system warrants — match depth to real blast radius, so you don't run big-org reliability theatre on a side project, nor cowboy a multi-tenant migration.
---
# Right-size reliability — rigor to match the blast radius, never theatre

The two opposite failures are equally real: **over-engineering** (multi-region HA, full IaC mono-repo, change-
advisory board, and a 6-page runbook for a weekend project with three users) and **under-engineering** (cowboy
console deploys on a multi-tenant system holding customer data). The craft is matching rigor to the *actual*
blast radius and stakes — adding only what the work warrants.

## The method
1. **Size the change/system.** Use `map-blast-radius`: one-box stateless config flip vs. multi-tenant data
   migration vs. DNS cutover. Reversible + small + low-traffic → light. Irreversible + stateful + wide → heavy.
2. **Scale the ceremony to the size:**
   - **Small/reversible:** ship it, verify it serves, know how to undo it. Don't summon a CAB for a flag flip.
   - **Medium:** canary + tested rollback + a runbook entry.
   - **Large/one-way:** full blast-radius map, staged progressive rollout, tested rollback/restore, a second
     reviewer, a pre-mortem, comms plan.
3. **Match the platform to the stage.** A pre-PMF startup needs a deploy that works, secrets out of the repo,
   and a rollback — *not* a service mesh and a platform team. Over-built infra is its own form of risk: more
   moving parts, more to break, more cognitive load, slower iteration.

## The non-negotiables (never right-sized away)
No matter how small, you do **not** skip:
- **secrets discipline** — never in repo/logs, even for a hobby project.
- **a rollback / a backup** — even "just redeploy the old image" must be a known, working path.
- **the ability to know it's healthy** — at minimum a health check and an uptime ping.
- **the security veto** where a real exploit or data-loss path exists.

## The discipline
- Over-working a trivial change is a real failure, not diligence — it teaches the team that your gate is
  bureaucracy and trains them to route around you.
- Right-sizing is *not* a shortcut: it's doing exactly what the stakes warrant, correctly, and no more.
- Re-size when the stage flips (prototype → real users, single-tenant → multi-tenant, internal → public) —
  the rigor that was excessive yesterday is mandatory today.
