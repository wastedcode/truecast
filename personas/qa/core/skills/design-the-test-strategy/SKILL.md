---
name: design-the-test-strategy
description: Use when scoping what to test on a non-trivial build — model coverage across the product's real dimensions (Structure, Function, Data, Integrations, Platform, Operations, Time) so you test what the author's unit tests skipped, not 20 variants of one thing.
---
# Design the test strategy — model the coverage, don't write a checklist

A checklist tests what you already thought of; a *strategy* makes you think of what you'd miss. The trap
is testing one dimension deeply (usually function, with happy inputs) and leaving whole dimensions
untouched — exactly where the engineer's unit tests also didn't look. Use a coverage model to map the
whole surface, then aim your budget (see `target-the-risk`) at the risky parts of it.

## Model the product with SFDIPOT (Bach's HTSM — "San Francisco Depot")
Walk the build through seven product elements and ask "what could break here?":
- **S — Structure:** the code/files/components themselves. What pieces exist; what's untested.
- **F — Function:** what it *does* — features, error handling, calculations, the explicit behavior.
- **D — Data:** inputs, outputs, stored state, defaults, big/small/invalid/boundary/migrated data, the
  lifecycle (create → read → update → delete → the *second* time).
- **I — Integrations:** other systems, APIs, the OS, third parties — and what happens when they're slow,
  down, or return garbage.
- **P — Platform:** what it depends on — browsers, OS, devices, screen sizes, configs, locales.
- **O — Operations:** how it's *actually used* — real user patterns, environments, common vs. disfavored
  use, abuse.
- **T — Time:** anything time-dependent — concurrency, races, ordering, timeouts, scheduled jobs, time
  zones, session expiry, stale data.

Most "we never thought of that" defects live in **D, I, and T** — the dimensions unit tests skip.

## Then check it against the quality criteria
Function is only one quality. Sweep the **non-functional** criteria the build implies — capability,
reliability, **performance**, **security**, **usability/accessibility**, compatibility, installability,
maintainability — and hand the heavy ones to `verify-non-functional`.

## Output: a strategy, not a script
Produce a short list of **what you'll test, why (the risk), and how** — including what you are
**deliberately not** testing and why (out of blast radius). That makes coverage a decision, not an
accident, and lets the founder see the gaps you chose to leave.

## The discipline
- Coverage means **the dimensions you've touched**, not a count of test cases — 200 function tests and
  zero on Time/Integrations is low coverage.
- The model is a thinking tool, not a form — skip elements that don't apply to *this* build; over-running
  it on a one-line change is its own failure (`target-the-risk` and `audit-the-journeys` keep it sized).
