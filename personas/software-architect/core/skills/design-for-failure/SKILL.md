---
name: design-for-failure
description: Use before calling any design done, and for anything with concurrency, persistence, or external dependencies — risk-storm the design: attack it, then decide resilient vs fail-fast and name the test per risk.
---
# Design for failure — attack the design before reality does

Tracing the happy path tells you the design *can* work; it doesn't tell you what happens when it doesn't.
Before a design is done you deliberately **attack** it. *"A complex system that works is invariably found
to have evolved from a simple system that worked"* (Gall) — and the failure thinking is what gets you
there.

## The method
1. **Risk-storm the design.** Walk each component and seam and ask, deliberately:
   - **Load** — what happens at 10× traffic? Where's the bottleneck, the unbounded queue, the O(n²)?
   - **Partition / dependency down** — an external service times out or returns garbage; the DB is
     unreachable. Does the system degrade, block, or corrupt?
   - **Restart / crash** — mid-operation. Is there partial state? Is recovery clean and idempotent?
   - **Concurrency** — two writers, double-submit, the second-time case, the race on shared state.
   - **Boundary inputs** — empty, malformed, oversized, malicious at every seam.
2. **Classify each risk: resilient or fail-fast.** Not everything must survive everything. Decide *per
   risk* whether to retry/fallback/degrade gracefully, or to fail fast and loud. A silent wrong answer is
   worse than a clean error. When you choose resilience, name the **mechanism**, not just the intent —
   the stability patterns (Nygard, *Release It!*) are the vocabulary:
   - **Timeout** on every remote call — no unbounded wait; an integration point with no timeout is the
     classic cascading-failure seed.
   - **Circuit breaker** — stop hammering a failing dependency; fail fast while it's down, probe to recover.
   - **Bulkhead** — isolate resource pools so one drowning dependency can't sink the whole system.
   - **Backpressure / bounded queue** — shed or reject load rather than let an unbounded queue OOM.
   - **Idempotency key / dedup** — so a retry or double-submit doesn't double-charge or double-write.
   - **Graceful degradation** — a defined reduced mode (cached/stale answer, feature off) beats a hard down.
   Pick the pattern that fits the risk; don't list all five for everything.
3. **Name the second- and third-order effects.** What does this design *constrain* downstream? What
   other decision does it now make hard to reverse?
4. **Name the test per non-trivial risk.** Each meaningful failure mode you chose to handle gets a test
   the engineer must write — the architecture brief carries it.

## The discipline
- Design failure handling *into* the architecture, not bolted on after the incident.
- Don't over-insure: making everything bulletproof against failures that can't happen is over-engineering.
  Resilience is a ranked driver, spent where the blast radius justifies it.
- This complements `trace-the-flow-end-to-end`: that maps where data goes; this asks where it breaks.
