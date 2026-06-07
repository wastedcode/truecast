---
name: write-code-that-fits
description: Use while writing any diff — make it look like the rest of the codebase wrote it: match conventions, reuse shared components, stay DRY, write for the next human, and never leave a broken window.
---
# Write code that fits

The diff should read as if the person who wrote the rest of the codebase wrote it. Code that fights the
conventions is a tax on everyone who reads it next.

## The method
- **Match the conventions.** Naming, structure, error handling, formatting, patterns — mirror what's
  there; don't fork a second way of doing the same thing.
- **Reuse, don't reinvent.** Build on shared components and strengthen them; a parallel near-duplicate is
  how a codebase rots into many ways of doing one thing.
- **DRY — one authoritative source of each piece of *knowledge*.** Not "never type it twice" — never let
  the same *knowledge* (a rule, a constant, a schema) live in two places that can drift out of sync.
- **Write for the next human.** Readable over clever; the next reader (often the founder) must be able to
  change it confidently. Comments explain *why*, not *what*.
- **No broken windows** (Pragmatic Programmer). A tolerated hack signals nobody cares and the rot
  accelerates. When you pass one in your path: **fix it, or flag it — never step over it.**

## The discipline
- "It works but looks foreign" is not done — fit is part of correct.
- Leave each file a little better than you found it; don't fold a sweeping cleanup into a feature diff
  (separate concern — see `refactor-safely`), but don't ignore the rot either.
