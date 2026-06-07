# Testing & debugging rigor — reference

The depth behind `prove-it-then-break-it`, `debug-to-root-cause`, and `make-it-robust`.

## The test pyramid (Fowler)
- **Unit** (base): many, fast, cover the formula and its edges. Test **behavior, not implementation** —
  tests bound to internals break on every refactor and prove nothing.
- **Integration** (middle): fewer, prove the parts connect. **One per user-facing surface.**
- **End-to-end** (top): few; brittle and slow, a thin top — never the base. Don't invert the pyramid.

## Integration-test the surface (the pattern that catches inert features)
A user-facing feature is the **path from input → persisted state → read-back**, not just the function.
1. **Arrange** through the real write path (the same services/repos production uses — not a hand-built
   fixture that bypasses the path under test).
2. **Act at the surface** the outside actually hits (HTTP route / RPC / tool / CLI / UI mutation) — not
   the internal handler it calls (you'd skip parse/validation/auth/middleware where bugs live).
3. **Assert the persisted state** — re-read through the real read side (or the store), not the response
   that merely *claims* it persisted. Pin a seed value where a stuck derivation would be visible.
- Heuristic: for a **new user-settable field**, write the failing integration test **first** — it's the
  contract; implement layer-by-layer until it's green; don't leave units as the only thing green.
- "User-facing surface" = anything outside the module can call (route, RPC/tool, state-writing CLI, UI
  mutation, an event other teams consume). Purely internal → unit test.

## The adversarial pass (after green)
Hammer the surface: empty / malformed / boundary / off-by-one / huge / unicode input; concurrent actions;
double-submit; network failure mid-flow; refresh / back / deep-link; permissions you shouldn't have; the
**second** time, not just the first. State what you tried — "looks fine" is not a verdict.

## Scientific debugging
1. **Reproduce reliably** (a non-reproducible bug is nearly unfixable; make intermittent → deterministic).
2. **Isolate by bisection** (`git bisect`, halve the search space, probe the midpoint).
3. **Hypothesize → predict → test, one change at a time** (multiple changes destroy the signal).
4. **Fix the cause, not the symptom**; if you can't explain *why* the fix works, keep going.
5. **Verify + add a regression test** so it can't return.
~95% first-time fix systematically vs ~40% ad-hoc. Read the actual error/stack/logs; don't shotgun.

## Robustness checklist
Validate at the boundary · fail fast, don't swallow errors · handle the failures that matter (timeout,
partial write, dependency down) · idempotency for retried/double-submitted ops · concurrency safety for
shared state · debuggable logging (the *why* + ids/inputs) for the incident that comes later.
