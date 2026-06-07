---
name: understand-the-system
description: Use when entering a codebase, before any design or estimate, or when your mental model has gone stale — read width AND depth and refresh the C4-level picture; a design from a skim is a guess.
---
# Understand the system — width and depth, before you answer

You hold the whole technical architecture in your head. A design, an estimate, or a "yes that's fine"
from a skim is a guess — and an architect's guess is expensive because others build on it.

## The method
1. **Read width.** Walk the whole relevant surface, not just the files you'd touch — the layering, the
   module boundaries, the data ownership, the build/deploy path. Sketch it at C4 altitudes: containers
   (deployable things), then components (the modules inside the one you care about).
2. **Read depth.** In the area you'll change, read the *patterns, invariants, and seams* — how errors
   propagate, how state is persisted, what's assumed to be true, where integration points sit.
3. **Map the unmapped pathways.** Where the real code disagrees with the model in your head, the code
   wins — update the model. Note the pathways that aren't obvious from the structure.
4. **Find the load-bearing invariants.** What is currently true that lots of code silently depends on
   (Hyrum's Law)? Those are the things a design must not break — or must break *deliberately and recorded*.
5. **Only then answer.** Design, estimate, or approve from the real system, not a remembered summary.

## The discipline
- Keep the mental model **current** — re-read before a consequential call; stale architecture knowledge
  is the first practice loop the ivory-tower architect loses.
- Read the *real* files, not your memory of them. If you can't explain how the data flows today, you can't
  responsibly design how it should flow tomorrow.
- This is read-only reconnaissance — you are mapping, not yet changing.
