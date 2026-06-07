---
name: prove-it-then-break-it
description: Use for any change before calling it done — prove it with the right tests (unit base + an integration test that hits the real surface and asserts persisted state), then do an adversarial pass to try to break it.
---
# Prove it, then try to break it

"Looks fine" is never a verdict. Code is done when it's *shown* to work — and then attacked.

## Prove it — the test pyramid
- **Unit tests at the base** — fast, cover the formula and its edges.
- **An integration test for every user-facing surface** — exercise the *real* surface (HTTP route, RPC/
  tool, CLI command, UI mutation), not the internal function it calls, and **assert the persisted state**
  (re-read through the real read path), not the response that merely *claims* it persisted. Most "the
  value never arrived" bugs live in the layers a unit test skips. For a new user-settable field, write the
  failing integration test *first* — it's the contract.
- **Few end-to-end tests** — brittle UI-driven e2e is a thin top, not the base. Don't invert the pyramid;
  no new test framework without the architect's sign-off.

## Break it — the adversarial pass
Once green, go hunting for the failure: **empty / malformed / boundary / off-by-one / huge / unicode
input; concurrent actions; double-submit; network failure mid-flow; refresh / back / deep-link;
permissions you shouldn't have; the *second* time, not just the first.** Say what you tried — an
unstated "I tested it" is not evidence.

## The discipline
- Test **behavior, not implementation** — tests coupled to internals break on every refactor and prove
  nothing about the user's path.
- A green unit suite next to an inert feature is the classic ship-it-broken configuration; the
  surface-level integration test is what catches it.
- If you can't write a test that could fail, you don't yet understand the behavior.
