---
name: refactor-safely
description: Use when code is hard to change, has accumulated cruft, or before a feature that the current structure resists — improve structure in small, behavior-preserving steps under green tests; never mix a refactor with a behavior change.
---
# Refactor safely — small behavior-preserving steps under green tests

Refactoring is changing structure **without** changing behavior (Fowler). Done right it's nearly free of
risk; done as a big rewrite mixed with features, it's how regressions ship.

## The method
1. **Get a test net first.** Ensure the behavior you're about to preserve is covered (add characterization
   tests if not). Green before, green after — that's the proof you changed structure, not behavior.
2. **Small steps.** Extract a function, rename, inline, move — one mechanical step at a time, tests green
   after each. Commit in small steps so any regression is trivial to locate.
3. **Separate refactor from feature.** *"Make the change easy, then make the easy change"* (Beck): do the
   structural prep as its own diff/commit, then the behavior change as another. Never in one tangle.
4. **Prefer incremental over big-bang rewrite.** A full rewrite throws away hard-won edge-case knowledge
   and is high-risk; strangle the old code path gradually where you can.

## The discipline
- If the tests aren't there, the refactor isn't safe yet — add the net first.
- A "refactor" that changes behavior is a bug wearing a refactor's clothes — separate them.
- Rewrites are the most over-chosen, most-regretted move; default to incremental.
