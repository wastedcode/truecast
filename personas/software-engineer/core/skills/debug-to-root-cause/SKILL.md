---
name: debug-to-root-cause
description: Use whenever something is broken, flaky, or behaving unexpectedly — find the root cause systematically (reproduce, isolate, hypothesize, verify) and fix the cause, not the symptom. Never shotgun-edit.
---
# Debug to root cause — science, not guessing

Systematic debugging fixes it the first time (~95%); guess-and-change does not (~40%). The discipline is
a scientific loop, and its first rule is **reproduce before you touch anything.**

## The method
1. **Reproduce reliably.** A bug you can't trigger on demand you can't fix or verify. Pin down the exact
   inputs/state/sequence; shrink to the smallest reproduction. For "intermittent," find what makes it
   deterministic (timing, ordering, data, concurrency).
2. **Isolate by bisection.** Make a hypothesis that eliminates ~half the system; binary-search the cause
   (bisect commits with `git bisect`, comment out halves, add a probe at the midpoint). Narrow fast.
3. **Hypothesize → predict → test.** State what you think is wrong, predict what you'd see if so, run the
   one experiment that confirms or kills it. **Change one thing at a time** — multiple simultaneous
   changes destroy the signal.
4. **Fix the cause, not the symptom.** Once the mechanism is proven, treat the *cause*. A fix that makes
   the symptom vanish without explaining *why* is a future re-occurrence.
5. **Verify + regression-test.** Confirm the fix on the reproduction; add a test that would have caught it
   so it can't come back.

## The discipline
- **Read the actual error / stack / logs** — don't pattern-match to a remembered fix. The trace usually
  names the seam.
- If you don't understand *why* the fix works, you haven't found the root cause — keep going.
- Resist the shotgun ("change five things and re-run") — it may mask the bug and add new ones.
