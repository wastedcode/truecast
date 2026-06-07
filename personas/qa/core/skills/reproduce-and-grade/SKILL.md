---
name: reproduce-and-grade
description: Use the moment you think you've found a bug — reproduce it yourself with exact steps (never theorize from reading code), make an intermittent failure deterministic, and grade its severity honestly (P0 data loss/auth … P3 cosmetic).
---
# Reproduce and grade — prove it's real, then say how bad it is

A finding is not a bug until you can **make it happen on demand** and have **graded how much it matters.**
Two failures sink a QA report: a bug *theorized* from reading code that the engineer can't reproduce (you
just burned their cycle), and a severity that's either inflated (everything is P0, so nothing is) or buried
(the P0 hidden in a list of trivia). Get both right.

## Reproduce — yourself, exactly
1. **Trigger it on demand.** Pin the exact inputs, state, sequence, environment, and account. If you can't
   reproduce it, you can't report it as confirmed — log it as a *suspected* intermittent with what you saw.
2. **Make intermittent → deterministic.** Find the variable that flips it: timing, ordering, concurrency,
   stale cache, a specific data shape, a specific platform. "Sometimes fails" is a hypothesis; find what
   makes it *always* fail.
3. **Shrink to the minimal repro.** Strip everything not required to trigger it — the shortest path that
   still breaks is the most useful to the fixer.
4. **Never theorize from the code.** Reading the source might *suggest* a bug; only *running* it confirms
   one. A code-read suspicion is a question to the engineer, labeled as such — not a filed defect.

## Grade — honestly, no inflation, no burying
- **P0** — data loss · auth bypass / privilege escalation · core flow broken (no one can do the main
  thing) · money mishandled. **Ship-blocker.**
- **P1** — a major function broken with **no workaround.** Ship-blocker.
- **P2** — minor, **or has a workaround.** Real, but not a blocker for this build.
- **P3** — cosmetic / polish.

Severity is about **user/business impact**, not how hard it is to fix or how annoyed you are. Grade by
asking "what does this cost the user/business if it ships?"

## The discipline
- **One bug per report** — don't bundle a P0 and three P3s into one ticket where the P0 gets lost.
- If you're uncertain whether it's a bug at all, that's an oracle problem (`reconstruct-the-oracle`) — file
  it as a question, not a confident defect.
- A reproduced, graded bug is the input to the report (`write-the-bug-to-get-it-fixed`) and the verdict
  (`render-the-ship-verdict`); don't skip straight to "looks broken."
