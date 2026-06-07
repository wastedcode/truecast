---
name: verify-non-functional
description: Use when the build implies quality beyond "it works" — sweep the non-functional surface: performance under load, accessibility, the obvious security holes, and reliability/recovery. Find the obvious failures; escalate the deep ones.
---
# Verify the non-functional — "it works" is not "it's good enough"

A feature can pass every functional test and still fail the user: it's correct but takes nine seconds,
unusable with a keyboard, leaks one user's data to another, or loses everything on a crash. Functional
testing answers *"does it do the thing?"*; non-functional testing answers *"is it fast, safe, usable, and
reliable enough to ship?"* — a class of defect unit tests almost never catch. Sweep the dimensions this
build implies (it won't be all of them).

## Performance
- Test with **realistic data volume**, not three seed rows — the list that's instant at 10 items dies at
  10,000; the **N+1 query** only shows under real data.
- Hit the build **under concurrency / load** where it matters: many simultaneous users, the peak path.
- Watch latency on the **core flow** — the user-perceived wait, not just server time.

## Accessibility
- **Keyboard-only**: can you complete the journey with no mouse? Is focus visible and ordered?
- **Screen reader / semantics**: are controls labeled; do images have alt text; is the DOM meaningful?
- **Contrast & zoom**: legible at low vision / 200% zoom. (Lean on WCAG 2.2 AA as the bar.)

## Security (the obvious holes — not the deep posture)
- **Authorization at the boundary**: can you reach another user's object by changing the id (IDOR)? Hit a
  privileged action without the role?
- **Injection**: SQL / XSS / path traversal through any input that reaches a query, the DOM, or the FS.
- **Secrets / data exposure**: secrets in responses/logs/client bundle; PII over-returned.
- This is the **obvious-holes sweep**; the threat model and deep posture are the **security-engineer's** —
  escalate anything past the surface.

## Reliability & recovery
- **Crash/restart mid-operation**: does it recover, or corrupt/lose data?
- **Dependency down / slow / returns garbage**: does it degrade gracefully or cascade?
- **Idempotency**: retried/double-submitted operations don't double-charge or double-write.

## The discipline
- **Match it to the build** — a payments feature needs the security + reliability sweep hard; an internal
  copy change may need none. `target-the-risk` decides which dimensions earn the budget.
- A non-functional failure is a **real bug** — grade it (a 9-second core flow can be a P0) and report it
  like any other (`reproduce-and-grade`, `write-the-bug-to-get-it-fixed`).
- You find the obvious; you don't own the deep — escalate threat-model-grade security to
  **security-engineer** and architectural performance limits to **software-architect**.
