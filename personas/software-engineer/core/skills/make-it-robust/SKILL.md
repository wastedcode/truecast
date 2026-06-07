---
name: make-it-robust
description: Use when writing code that touches I/O, state, concurrency, or external systems — design for failure: validate inputs, fail fast, be idempotent and concurrency-safe, and make it debuggable in production.
---
# Make it robust — design for the failure paths, not just the happy one

The happy path is the easy 80%; production lives in the other 20%. Robust code assumes things go wrong
and stays correct (or fails safely) when they do.

## The method
- **Validate at the boundary.** Treat all external input (user, network, file, env) as hostile until
  checked; validate shape and range at the edge, not deep inside.
- **Fail fast and loud.** Detect a broken invariant early and stop with a clear error, rather than
  limping on with corrupt state. Don't swallow errors; don't `catch {}` into silence.
- **Handle the failures that matter.** Network timeout mid-flow, partial write, the dependency is down,
  the disk is full — decide the behavior (retry with backoff, roll back, surface). Name what happens.
- **Idempotency + concurrency.** A retried or double-submitted request must not double-apply; concurrent
  actors must not corrupt shared state (locks, atomic ops, optimistic concurrency, transactions). These
  bugs hide until load finds them.
- **Make it debuggable.** Log the *why* with enough context to diagnose later (ids, inputs, the decision
  taken); surface clear errors, not opaque ones. Future-you, mid-incident, depends on this.
- **Secure by default.** Treat security as part of robust, not a later pass: **parameterize** queries
  (never string-build SQL); **escape/encode** output (no injection/XSS); enforce **authz at the boundary**
  for every request; **never log or commit secrets**; default-deny. For anything beyond the basics or a
  real threat model, pull in **security-engineer** — but the basics are yours, always.

## The discipline
- "It works when nothing goes wrong" is the floor, not done — the adversarial pass
  (`prove-it-then-break-it`) is how you check the failure paths you designed for.
- Prefer a small, well-handled failure surface to a sprawling try/catch that hides what broke.
