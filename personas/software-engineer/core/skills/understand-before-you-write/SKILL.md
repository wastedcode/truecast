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
4. **Find the reuse — sweep the whole repo, then the ecosystem.** "Is there one nearby?" is the trap:
   the existing owner is often a shared helper in a section you're not thinking about, already used by
   modules unrelated to yours. So search by *concept*, not by radius — name the mechanisms your change
   needs (retry, pagination, validation, export…), grep the **whole repo** for each, walk the shared-code
   homes (`lib/`, `shared/`, `common/`, `utils/`, internal packages), check the dependency manifest for
   libraries already paid for, and read how the nearest analogous feature *anywhere* in the codebase did
   it. Reuse and strengthen the owner you find rather than forking a parallel one — and if the brief
   carries a prior-art inventory from the architect, honor it. Then, before hand-rolling anything
   non-trivial — date parsing, retry/backoff, argument
   parsing, a state machine, auth, crypto — **search for a maintained library or established prior art.**
   A mature, tested, widely-used dependency usually beats the subtly-wrong version you'd write under time
   pressure (the edge cases are why it exists). Weigh it honestly: dependency cost / maintenance / supply
   chain vs. the cost of owning a hand-rolled equivalent — and *never* hand-roll crypto or auth primitives.
5. **Only then, write** — and write the smallest change that solves *this* problem.

## The discipline
- A guess dressed as code is the most expensive thing you can ship. Five minutes reading the callers
  beats an hour undoing a wrong assumption.
- In a large/unfamiliar codebase, `grep`/read your way to the one or two files that matter — don't
  reinvent what's already there, and don't break a convention you never looked for.
