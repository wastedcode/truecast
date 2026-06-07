---
name: prototype-at-the-right-fidelity
description: Use when deciding how to represent a design to test or communicate it — match fidelity to the question. Low-fidelity to test a flow/concept cheaply, mid to test interaction, production code to test the real feel. Never high-fidelity a direction you haven't validated.
---
# Prototype at the right fidelity — match the artifact to the question

Fidelity is a cost/learning tradeoff. High fidelity is expensive and *anchors* feedback on polish instead
of the idea — so it's wasteful (and misleading) to high-fidelity a direction you haven't validated. Match
the artifact to the **question you're trying to answer right now.**

## Pick fidelity by the question
- **"Is this the right flow / structure?"** → **low fidelity**: a sketch, a wireframe, a paper or grayscale
  flow. Cheap, fast, throwaway — invites feedback on the *idea*, not the pixels. Validate the flow before
  spending an hour on color.
- **"Does this interaction work — does the timing/feedback/transition feel right?"** → **mid/high-fidelity
  clickable prototype**: enough realism to test the interaction, in a tool or lightweight code.
- **"Does it actually feel right with real data and real latency?"** → **production code**: design lives
  in the browser, on the real screen, with the longest plausible string and the real network. The feel
  (`polish-the-interface`, `design-microinteractions`) can only be truly judged here. The waterfall
  "Figma-over-the-wall" handoff is over — when you can, build it.

## The method
1. **State the question first**, then choose the cheapest fidelity that can answer it. Don't reach for
   high-fidelity by reflex.
2. **Validate flow and structure low** (`frame-the-flow`, `usability-test` on a wireframe catches flow
   problems for almost nothing).
3. **Escalate fidelity only as the question narrows** — once the flow is right, test the interaction;
   once the interaction is right, build it for real.
4. **Use real content** as early as fidelity allows — Lorem and "John Doe" hide the layout failures that
   the longest real name and the empty list will expose.

## The discipline
- A polished mockup of an unvalidated flow is the most expensive way to be wrong — you've anchored
  everyone on a direction that may not survive the first `usability-test`.
- Throwaway prototypes are *meant* to be thrown away — don't fall in love with the artifact; the learning
  is the deliverable.
- The feel-level craft cannot be judged from a static image; reserve those judgments for code on the real
  screen.
