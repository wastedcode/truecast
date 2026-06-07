---
name: build-on-the-design-system
description: Use whenever you reach for a value (color, spacing, radius, type, motion) or build a component — extend tokens and shared components in place, never fork into one-off className soup. The system is what lets quality scale across surfaces.
---
# Build on the design system — extend in place, never fork

A consistent design system is what makes Linear feel like Linear — every surface speaks the same
language. The system (tokens → components → patterns) is *how you ship at quality across surfaces without
re-deciding each time*. The rule: when you reach for a one-off value — a magic 13px margin, an inline
color, a bespoke radius — **STOP.** Either it belongs in the system (add once, use forever) or it doesn't
belong at all (use the system's value).

## The layers (atomic design — Frost)
- **Tokens** (the subatomic layer): color, spacing, radius, type scale, motion timing — the atomic
  vocabulary. *Never inline these.* Tokens are the single source of truth; theming and consistency ride on
  them.
- **Components** (atoms → molecules → organisms): recurring compositions of tokens — buttons, inputs,
  cards, list rows. Build once, use everywhere; each one carries all its states (`design-the-states`).
- **Patterns / templates**: how components compose for recurring layouts.
- The labels matter less than the **mental model**: small reusable pieces compose into bigger ones, all
  drawing from one token source.

## The method
1. **Before styling, scan the system.** Is there a close-enough token/component? Use it — visual
   consistency beats pixel-perfection.
2. **New recurring pattern?** Add it to the system *once*, in the right place (token file / component
   file), document it, and reuse it on the next two surfaces — that proves the abstraction earns its keep.
3. **Genuinely one-off?** Rare and obvious (a decorative hero crop, a unique illustration). If you reach
   for a "one-off" twice, it's a component now.
4. **Leave it better:** when you touch a surface with inline duplicates of a system value, fold them back
   into the token/component in passing.

## The bar question
> *Does this respect the system, or fight it?* If "fight," refactor **before** shipping the feature —
> fighting the system once teaches every future contributor (and AI) to do the same, and the inconsistency
> compounds faster than anyone can clean it.

## The discipline
- One-off styling is fast today, slow tomorrow; the slop accumulates (`refuse-ai-slop`'s rounded-2xl and
  indigo-600 are exactly what un-systematized styling drifts into).
- The system is a **living** thing — grow it deliberately as real needs surface, not speculatively.
- Concentric radius, shadow-vs-border, optical alignment, motion timing all live as tokens — reuse them,
  don't re-derive (`polish-the-interface`).
- Consult the **software-engineer** on how the system is implemented (CSS architecture, component API) so
  your contributions land cleanly in the codebase.
