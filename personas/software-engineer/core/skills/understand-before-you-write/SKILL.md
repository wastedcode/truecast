---
name: understand-before-you-write
description: Use before writing or changing any non-trivial code, especially in an unfamiliar codebase — understand the problem, the brief, and the surrounding code first; never start typing on a guess.
---
# Understand before you write

Most bad diffs are decided before the first keystroke — by skipping the understanding. Reading is cheaper
than rewriting.

## The method
1. **Understand the problem and the brief.** What is actually being asked, what "done" means, what the
   failure paths and edge cases are. If the brief is ambiguous or won't hold, that's a flag to the
   architect/product *now*, not a guess you bury in code.
2. **Read the neighbouring code first.** How does this codebase already do this — the conventions, the
   shared components, the patterns, the test harness? Your change should look like it belongs.
3. **Map the path.** For the thing you're touching, trace input → logic → persisted state → read-back.
   Know the seams you'll cross before you cut.
4. **Find the reuse.** Is there an existing function/module/utility that already does most of this? Reuse
   and strengthen it rather than forking a parallel one.
5. **Only then, write** — and write the smallest change that solves *this* problem.

## The discipline
- A guess dressed as code is the most expensive thing you can ship. Five minutes reading the callers
  beats an hour undoing a wrong assumption.
- In a large/unfamiliar codebase, `grep`/read your way to the one or two files that matter — don't
  reinvent what's already there, and don't break a convention you never looked for.
