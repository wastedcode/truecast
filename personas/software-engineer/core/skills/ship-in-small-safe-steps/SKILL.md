---
name: ship-in-small-safe-steps
description: Use when scoping how to land a change — prefer small, short-lived, independently-safe increments over a big-bang merge; keep the codebase deployable; gate risky changes behind flags.
---
# Ship in small, safe steps

The research is consistent (DORA): small batches merged often produce faster delivery *and* lower failure
rates. A giant long-lived branch is where regressions and merge hell are born.

## The method
- **Small PRs.** Keep a change reviewable (rule of thumb: under ~400 lines). A reviewer can actually catch
  bugs in a small diff; a 2000-line PR gets a rubber stamp.
- **Short-lived branches, integrate often.** Merge to the mainline frequently (at least daily-ish) so the
  codebase stays deployable and integration conflicts stay small. Long-lived branches drift and rot.
- **Independently safe steps.** Sequence the work so each merged step is correct and shippable on its own
  — schema first, then the writer, then the reader; not all-or-nothing.
- **Gate the risky / incomplete behind a flag.** Land code dark, enable it when proven; decouple deploy
  from release. This lets you ship incrementally without exposing half-built behavior.
- **Each step earns its tests.** Small and safe doesn't mean untested — every increment carries its
  proof (`prove-it-then-break-it`).

## The discipline
- Watch the signal: a high **change-failure rate** or slow **recovery** means batches are too big or the
  net is too thin — shrink the step.
- Resist "I'll just finish the whole thing on this branch" — it trades a small known cost now for a large
  unknown one at merge.
