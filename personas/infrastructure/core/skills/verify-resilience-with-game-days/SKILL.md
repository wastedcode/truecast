---
name: verify-resilience-with-game-days
description: Use when reliability/recoverability is being assumed rather than proven — deliberately inject the failure (dependency down, AZ/region loss, restore from backup, failover, on-call paged) in a controlled game day or chaos experiment, so you learn the system breaks before a real outage teaches you.
---
# Verify resilience with game days — you don't have a backup until you've restored from it

A reliability claim you have never tested is a hope. "We have a backup," "we can fail over to the secondary,"
"the system degrades gracefully if the cache is down," "on-call will get paged" — every one of these is an
*assumption* until you have deliberately caused the failure and watched the system (and the humans) handle it.
**Untested recovery fails exactly when you need it.** The discipline (Chaos Engineering — Rosenthal, Jones;
Netflix; game days — Allspaw/AWS) is to find the weakness by injecting controlled failure, not by waiting for
the real one.

## What to deliberately break (and prove)
- **Backup → restore.** A backup you've never restored is Schrödinger's backup. Restore it to a clean
  environment, on a clock, and confirm the data is complete and the restore time meets your RTO. This is the
  single most-skipped, most-catastrophic gap.
- **Failover / region or AZ loss.** Kill the primary and prove the secondary takes over within your RTO/RPO —
  *and* prove failback. Most "multi-region" setups have never actually failed over; the first real test is the
  outage.
- **Dependency failure.** Make the database, cache, queue, or a third-party API time out or return errors.
  Does the service degrade gracefully (clear error, fallback, shed load) or cascade into a full outage? Verify
  timeouts and circuit breakers actually fire.
- **The human path.** A **game day** tests people and runbooks, not just code: fire a real(istic) alert, see if
  on-call is paged, can find the runbook, and can recover within the time that matters. Gaps in the runbook and
  the escalation chain surface here, cheaply.

## Run it safely (controlled, not reckless)
1. **Hypothesis first.** "We believe that if the cache dies, latency rises but no requests fail." Chaos
   engineering tests a *belief about steady state*, not random destruction.
2. **Start small and contained** — staging first, then a blast-radius-limited slice of prod, with a clear abort
   and a watching human. Have the rollback ready (`map-blast-radius`, `release-with-tested-rollback`).
3. **Define RTO/RPO before you test, then measure against them.** Recovery Time Objective (how long to
   recover) and Recovery Point Objective (how much data you can lose) turn "are we resilient?" into pass/fail.
4. **Every weakness found becomes a tracked fix** — feed it into the runbook and the action-item list, same as a
   real incident (`write-the-blameless-postmortem`, `author-the-runbook`). A game day that finds nothing was
   either too gentle or is the rare good news — record which.

## The discipline
- The cheapest incident is the one you caused on purpose, on a Tuesday afternoon, with everyone watching and a
  rollback ready — not the one at 3am you've never rehearsed.
- Right-size it (`right-size-reliability`): a side project doesn't run chaos experiments — but even there,
  **once** restore the backup and confirm it works. Anything holding real user data earns at least that.
- This is the proactive twin of `run-the-incident`: game days build the muscle and expose the gaps *before* the
  real incident needs them.
