# Delivery & reliability foundations — reference

The authorities and depth behind the release, reliability, and incident skills. Craft, with sources — not
opinion.

## Continuous Delivery & DORA (the deliver-faster-AND-safer thesis)
- **Continuous Delivery** (Jez Humble & David Farley) — make releasing **boring**: *"if it hurts, do it more
  often, and bring the pain forward."* Small, frequent, automated releases have a smaller blast radius and a
  faster recovery than the big-bang quarterly release. One deployment pipeline as the single path to prod.
- **Accelerate / DORA** (Forsgren, Humble, Kim; and the annual *DORA / State of DevOps* reports) — empirically,
  **speed and stability are not a tradeoff** — elite teams have both, via the practices below. The metrics:
  - **Throughput:** deployment frequency, lead time for changes.
  - **Stability:** change failure rate, failed-deployment recovery time (formerly time-to-restore).
  - (2024) a fifth metric — **rework / failed-deployment recovery** — was added; "four keys" is now really five.
  - Drivers: trunk-based development, small batches, test/deploy automation, loosely-coupled architecture, and
    **psychological safety** (a top predictor of delivery performance — which is *why* postmortems are
    blameless).
  - (2025 DORA) **AI adoption raises throughput but can increase instability** (a ~25% AI-adoption rise tracked
    with a small throughput gain and a measurable stability drop) — AI-generated change still needs the safety
    rails: review, canary, tested rollback. Speed without the rails is just faster breakage.
- **The CrowdStrike outage (Jul 2024)** — the canonical modern failure: a faulty content/config file shipped
  **globally and instantly**, no staged/canary rollout, no customer ability to delay, a validation gap in the
  test suite, and no graceful handling of bad content → ~8.5M machines down, ~$5B+ in losses. Every fix was
  systemic and is in the skills here: progressive rollout, input validation in CI, customer-controlled ramp,
  graceful degradation, tested rollback.

## Site Reliability Engineering (Google — the SRE book & workbook, sre.google)
- **"You build it, you run it"** (Werner Vogels, Amazon) — the team that ships owns prod; operability isn't a
  separate ops silo's afterthought.
- **100% is the wrong reliability target** — it's infinitely expensive and users can't perceive it past their
  own less-reliable network. Pick the *right* target.
- **SLI / SLO / error budget** — SLI = a user-centric health metric; SLO = the target over a window; **error
  budget = 1 − SLO** = the unreliability you're *allowed* to spend. The error budget is the politics-free
  arbiter of ship-fast vs. stabilize; the **error-budget policy** (freeze when blown) gives it teeth.
- **Alert on symptoms, not causes** — page on user-facing pain / SLO burn, never on CPU%; **multi-window
  multi-burn-rate** alerts page fast on fast burn, ticket on slow. Actionable-only; every page links a runbook.
- **Toil** — manual, repetitive, automatable, no-lasting-value work that **scales with the service**; cap it
  (~50% guideline) and automate it down or ops grows linearly with the system.
- **Blameless postmortems** — assume good faith, find *systemic* contributing causes, produce tracked action
  items; punishing the person destroys the reporting you need. (Origin: aviation/medicine safety culture.)

## Incident response (ICS-derived)
- **Incident Command System** — separate roles: **Incident Commander** (decides/coordinates, hands-off the
  keyboard), **Ops/Resolver** (one coordinated change stream), **Comms** (stakeholder updates). Declare early,
  size severity to impact.
- **Mitigate before diagnose** — stop the bleeding (roll back / flag off / fail over / shed load); root cause
  belongs in the postmortem, not the live incident. The fastest mitigation is usually "undo the last change" —
  which is why everything ships reversibly.

## Capacity & load (the SRE-book "Software Engineering in SRE" / capacity-planning chapters)
- **Capacity is measured, not felt.** A system's real limit is unknown until you've driven it there; the limit
  is rarely CPU — it's a connection pool, a downstream rate limit, lock contention, IOPS, or a third-party quota.
- **Worst case ≫ average.** Thundering herds, retry storms, cache-cold cold-starts, flash spikes are 5–50× the
  mean, often a near-vertical step (a marketing blast), not a ramp.
- **Little's Law** — concurrency ≈ throughput × latency; latency growth under load inflates pools/threads.
- **Load test to the knee** — a test that never breaks the system told you nothing. Find the breaking point and
  how it degrades (graceful: sheds/queues/clear error vs. catastrophic: collapse/corruption/cascade).
- **Protect against overload by design** — backpressure, bounded queues, load-shedding, timeouts, retries with
  **jitter**, circuit breakers. Verify autoscaling reacts faster than the spike; pre-scale for known events.

## Resilience verification — chaos engineering & game days
- **Chaos Engineering** (Casey Rosenthal, Nora Jones; Netflix — *Principles of Chaos*) — experiment on a system
  to build confidence it withstands turbulent conditions: form a **hypothesis about steady state**, inject a
  real-world fault (dependency down, latency, instance/AZ loss), and look for the deviation. Start in staging,
  then a contained prod slice, with an abort. Not random destruction — a controlled experiment.
- **Game days** (Allspaw/Etsy; AWS Well-Architected) — rehearse failure end-to-end including the *humans*: fire
  a realistic alert, confirm on-call is paged, the runbook works, recovery hits the time target. Finds runbook
  and escalation gaps cheaply.
- **DR fundamentals** — **RTO** (Recovery Time Objective = how long to recover) and **RPO** (Recovery Point
  Objective = how much data loss is tolerable) turn "are we resilient?" into pass/fail. **"Schrödinger's
  backup"**: a backup is unknown-good until *restored* and verified; a failover is untested until exercised
  (including failback). Most "multi-region" setups have never actually failed over.

## Reversibility & change (the through-line)
- **One-way vs two-way doors** (Bezos) — reversible decisions get speed; irreversible ones get a plan, a backup,
  and a second reviewer.
- **Expand/contract (parallel-change)** for schema/contract changes — add new, dual-write/backfill, cut over,
  then drop old; never destructive-change-in-one-deploy.
- **Hyrum's Law** — every observable behavior of a system becomes someone's dependency (including its absence);
  map downstream before you change behavior.
