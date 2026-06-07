---
name: compose-the-layout
description: Use when laying out any screen or composing a set of elements — make the eye go where it should. Establish visual hierarchy (one focal point, deliberate scan path), group with Gestalt, structure with a grid and whitespace, and disclose progressively. This is the affirmative craft, not just refusing slop.
---
# Compose the layout — make the eye go where it should

`refuse-ai-slop` says what *not* to do; `polish-the-interface` works the micro details. This is the
**affirmative** discipline between them: composing a screen so a user's eye lands on the right thing first,
follows the right path, and groups things the way you intend. A screen with everything shouting equally
says nothing (Krug: *don't make me think*). Hierarchy and grouping are how a layout *means* something
before the user reads a word.

## Establish visual hierarchy
- **One clear focal point per view.** Decide the single most important thing (usually the primary action or
  the key data) and make it win — via **scale, contrast, weight, color, and whitespace around it**. If
  three things are emphasized, nothing is. Squint at the screen: what do you see first? Is it what should
  win?
- **Rank everything into a few levels** — primary / secondary / tertiary. Each level reads at a glance as
  its level. Use *size and weight* for hierarchy before color (color carries other meaning, and fails for
  colorblind users — `design-for-accessibility`).
- **Design the scan path.** Western readers scan **F-pattern** for text-dense layouts (left rail, top
  lines) and **Z-pattern** for sparse/marketing layouts. Place the most important elements where the eye
  already goes; don't fight the scan.

## Group with Gestalt (how the eye organizes)
- **Proximity** — related things sit close; unrelated things get space. *Spacing groups more reliably than
  borders or boxes* — reach for whitespace before adding a card (avoids Cardocalypse).
- **Similarity** — things that look alike read as the same kind; vary the look to signal "different kind."
- **Common region / enclosure** — a shared background or border binds a group (use sparingly; proximity first).
- **Continuity & alignment** — elements on a shared edge read as related and create a path the eye follows;
  misalignment reads as "unrelated" or as sloppiness. Everything aligns to something on purpose.

## Structure with the grid and whitespace
- **A grid is the skeleton.** Columns + consistent gutters give rhythm and alignment; it's what makes a
  layout feel engineered rather than placed. Break the grid only deliberately, for emphasis.
- **Whitespace is structure, not waste.** Negative space creates grouping, focus, and breathing room; it's
  the cheapest way to signal importance and the first thing crammed layouts lose. Density done right (Linear)
  is *deliberate* spacing, not *absent* spacing.
- **Spacing on the token rhythm** — the scale, not one-off pixels (`build-on-the-design-system`).

## Manage attention over the whole flow
- **Progressive disclosure.** Show the essential now; reveal advanced/secondary on demand (a "more"
  control, a second step, a detail panel). Don't put everything on one screen because it fits — cognitive
  load is the cost. Especially load-bearing on small screens (`design-responsive-layout`).
- **One primary action per surface.** Secondary and tertiary actions are visibly de-emphasized; a screen
  with three equal-weight primary buttons has no primary action.

## The discipline
- The squint test and the "what do I see first?" test are fast and ruthless — run them on every layout.
- This is upstream of polish: get the hierarchy and grouping right *first*, then `polish-the-interface`
  the details. Polishing a composition with no focal point is polishing noise.
- Composition rides the system's grid, spacing, and type scale — don't re-derive them
  (`build-on-the-design-system`); it must hold at every breakpoint (`design-responsive-layout`).
