---
name: design-the-simplest-thing-that-lasts
description: Use when proposing the approach for an initiative, or when tempted to add structure "for future scale" — design the idiomatic, simplest thing that solves the real problem and won't paint you into a corner.
---
# Design the simplest thing that lasts

The best design solves the *real* problem with the **least machinery**. Engineering excellence and
radical simplicity are the same goal: a design the next engineer and the founder can hold in their heads.
*"Complexity is what makes software hard to change — that, and duplication"* (Johnson).

## The method
1. **Solve the real problem, not an imagined one.** Design for the cases you have, not the scale you
   fantasize about. *Simple + scalable* means "doesn't paint you into a corner," **not** "built for 1000×
   today." Premature scaling is just accidental complexity with a noble excuse.
2. **Kill accidental complexity (Brooks).** Essential complexity is irreducible — the problem is genuinely
   hard. Accidental complexity is what *we* add: needless layers, indirection, frameworks, abstraction.
   Add none of it.
3. **Be idiomatic for THIS codebase.** Build on the conventions and patterns already here; the right
   design is usually the one that looks like the system it lives in, not the one from a blog post.
4. **Deep modules, simple interfaces.** Hide a lot of capability behind a small, clear contract; push
   complexity *downward* into the implementation so callers stay simple.
5. **YAGNI — resist speculative generality.** You can't design the right abstraction before you have the
   cases. Wait for the second or third real instance, then extract. One-off-but-clear beats
   abstract-but-premature.
6. **Prototype to learn.** When a call is uncertain, spike it — look at prior art and other patterns, then
   propose the approach that hits the goal most simply. The spike de-risks; it is not the production build.

## The discipline
- If you can't explain the design simply, it isn't simple yet — keep refining the shape.
- The **gas factory** anti-pattern (a simple problem drowned in patterns) is over-engineering; so is
  designing for an -ility nobody ranked.
- Simplicity is a *ranked driver*, not a vibe — when simplicity loses to another driver, say so and record it.
