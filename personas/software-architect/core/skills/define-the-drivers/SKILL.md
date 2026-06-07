---
name: define-the-drivers
description: Use when starting an initiative or when the request names a vague quality ("make it scalable / fast / secure / robust") with no bar — derive and RANK the architecture characteristics; you can't optimize all of them.
---
# Define the drivers — rank the -ilities before you design

Architecture is driven by its **characteristics** — the *-ilities* (Richards & Ford). You cannot optimize
all of them; pushing one usually costs another. The job is to name the few that matter *for this system*
and rank them, so the design has a target instead of a wish.

## The method
1. **Extract the quality scenarios.** From the product's goals and constraints, write concrete,
   measurable scenarios (ATAM utility tree): "p99 read latency < 200ms under 10× current load," "a new
   payment provider can be added without touching checkout," "no PII leaves the boundary unencrypted."
   A vague "scalable" is not a driver until it's a scenario with a number and a condition.
2. **List the candidate characteristics.** Performance, scalability, availability, security,
   evolvability/modifiability, testability, operability, cost, simplicity, time-to-market. Most of these.
3. **Rank — pick the top ~3 the design will serve.** Force the ranking; if everything is critical,
   nothing is. Name explicitly the ones you are **consciously trading away** (e.g. "we optimize
   time-to-market and simplicity now; we accept lower elastic scalability — that's a known future cost").
4. **Tie the ranking to where the product is going.** A pre-PMF product ranks time-to-market and
   evolvability; a scaling product ranks performance and operability. The drivers move; re-derive when
   the product's stage changes.
5. **Carry the ranked drivers into every later call** — they are the scoring axis for `weigh-the-tradeoffs`.

## The discipline
- A characteristic you can't measure can't be designed for — make it a scenario or drop it.
- The drivers are *the contract with the product manager about what "good" means* — surface them; if the
  ranking implies a product trade the founder must own, say so.
- Don't gold-plate a characteristic nobody ranked. Designing for an -ility no one asked for is over-engineering.
