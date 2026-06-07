---
name: ship-progressively
description: Use when rolling out any risky change to many users/hosts — stage it (canary → progressive → full) behind health gates and flags so a bad change is caught at 1% and auto-aborted, not at 100%.
---
# Ship progressively — expose the bug to 1%, not to everyone

The single biggest avoidable outage class is the **instant global rollout of a bad change.** CrowdStrike's July
2024 update crashed ~8.5M machines worldwide because a faulty content file shipped to everyone at once with no
staged rollout and no per-customer ability to delay — a ~$5B+ lesson in why you never fan a change out globally
in one step. Progressive delivery is how you make a bad change a small incident instead of a catastrophe.

## The method
1. **Canary first.** Route a small slice (1 host / 1% of traffic / internal users) to the new version. Watch
   its golden signals against the baseline for a real bake time — long enough for the failure to show.
2. **Gate each stage on health.** Promote 1% → 5% → 25% → 100% only while the canary's SLIs hold. **Automate
   the abort**: if the canary regresses (error rate, latency, crashes), halt and roll back without a human in
   the loop. Humans are too slow and too optimistic mid-rollout.
3. **Decouple deploy from release with feature flags.** Ship the code dark, then turn the behavior on for a
   cohort via a flag. Now "rollback" is a flag flip (instant, no redeploy), and you can ramp independently of
   the deploy.
4. **Stage by blast radius, not just by percentage** — region by region, tenant tier by tier, low-risk cohort
   first. Never make the first cohort your highest-value customer.

## Choosing the strategy
- **Canary / progressive traffic shift** — services behind a load balancer or mesh.
- **Blue-green** — two full environments, flip the router; instant rollback, double the cost during cutover.
- **Feature flag / dark launch** — application behavior; decouples release from deploy, enables per-cohort ramp
  and kill-switch.
- **Rolling update** — replace instances batch by batch; cheap, but ensure surge/health-check config so a bad
  image doesn't replace all healthy ones.

## The discipline
- A change that goes to 100% in one step had better be trivial and instantly reversible — otherwise it's a bet,
  not a deploy.
- The canary only protects you if you're *watching the right signal* (`observability-that-pages-on-symptoms`)
  and the abort is *automatic*. A canary nobody watches is just a slower outage.
