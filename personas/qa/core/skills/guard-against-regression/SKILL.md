---
name: guard-against-regression
description: Use when protecting working behavior across changes — keep a fast, risk-prioritized regression gate on the highest-value journeys, and quarantine-and-own a flaky test instead of retrying past it.
---
# Guard against regression — protect what already works

New code breaks old behavior. The cheapest place to catch that is a **regression gate** — a curated set of
checks that the highest-value journeys *still* work after every change. But a regression suite can rot into
a slow, flaky tax that teams learn to ignore (rubber-stamping red as "probably flaky") — which is worse
than no suite, because it launders broken builds. So keep it **small, fast, risk-led, and trustworthy.**

## Build the gate
- **Cover the few journeys that matter, not everything.** Identify the highest-value / highest-traffic
  user journeys (the core flow, auth, payments) and protect *those* as a fast smoke gate — a handful of
  journeys covers the majority of production risk. Don't mirror the whole app.
- **Keep it fast and on the merge path.** A PR-blocking smoke suite should run in a few minutes; reserve
  the broad/slow suite for nightly or pre-release. A gate slow enough to skip is a gate that gets skipped.
- **Add a regression check for every bug you find.** A confirmed bug becomes a permanent check so it can't
  silently return — this is how the suite earns its keep over time.
- **Select by risk on big changes** — focus the regression effort on what the change touches and its blast
  radius (`target-the-risk`); don't re-run the universe for a one-line change, but never trust impact
  analysis alone on auth/data/money.

## Handle flakiness — quarantine and own, never retry-past
A flaky test (passes/fails on the same code) destroys the signal — people stop trusting red. The fix is
**not** auto-retry-until-green (that hides real intermittent bugs):
1. **Detect** — a test that fails non-deterministically.
2. **Quarantine** — pull it from the blocking suite into a non-gating bucket so it stops blocking good
   merges and stops masking bad ones.
3. **Own it** — assign it and a deadline; investigate the cause (timing, ordering, shared state, unstable
   data, a real race). Quarantine is **temporary**, not a graveyard.
4. **Fix or delete** — restore it once stable, or remove it if it tests nothing real. A flaky test left
   "green via retries" can be hiding a genuine concurrency bug — treat that flake as a possible P-bug.

## The discipline
- A green regression suite people *trust* is worth more than a comprehensive one they ignore — protect the
  trust.
- "It's just flaky" is a hypothesis to investigate, not a verdict to wave through.
- The gate complements the engineer's tests and your adversarial pass — it locks in *yesterday's* truths
  while you hunt *today's* unknowns.
