---
name: make-it-work-right-fast
description: Use to sequence your work on a change — make it work, then make it right, then make it fast, in that order; keep one concern per change; don't tangle a feature with a refactor.
---
# Make it work, make it right, make it fast — in that order

Kent Beck's order is a discipline, not a slogan. Doing the three at once produces a tangle where none is
done well.

## The method
1. **Make it work.** Get to correct behavior on the real path first — a green test proving the thing the
   user needs actually happens. Resist polishing before it works.
2. **Make it right.** Now clean it: clear names, the right structure, failure paths, fits the codebase.
   This is where most of the value is; "works" was just the floor.
3. **Make it fast — only if it matters.** Optimize last, and only what you've *measured* to be slow
   (`make-it-fast-when-it-matters`). Most code is fast enough.
- **One concern per change.** Don't tangle a feature with a refactor with a perf tweak — each is a
  separate, reviewable step. If a change is hard because the code is in the way, **make the change easy
  first** (refactor, `refactor-safely`), *then* make the easy change.

## The discipline
- A diff that mixes a feature + a refactor + a rename is unreviewable and risky — split it.
- "Make it right" is not optional polish; skipping it is how you become the tactical tornado.
