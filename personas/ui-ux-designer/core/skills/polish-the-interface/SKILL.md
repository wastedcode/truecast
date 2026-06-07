---
name: polish-the-interface
description: Use on every surface before it ships — the pre-merge craft pass. Work the polish checklist (tabular nums, optical alignment, concentric radius, shadow-vs-border, focus, type hierarchy) and apply the honest gate; right-size depth to the surface's importance.
---
# Polish the interface — the details that make it feel inevitable

The difference between "works" and "feels like Linear" is a layer of details that get cut first under
deadline and invented worst by AI. Work the checklist on every surface that ships; each item earns its
check or earns a *reason* it doesn't apply. **Right-size:** a small contained tweak gets a quick pass; a
foundational surface (the home, the primary flow) gets the depth. Over- and under-polishing are both failures.

## The checklist
**Type**
- `tabular-nums` on *dynamically-updating* numbers (counters, prices, tables, timers) — NOT static/phone/version numbers.
- Font smoothing set once at root: `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`
- `text-wrap: balance` on headings/short blocks; `text-wrap: pretty` on paragraphs/UI text.
- Hierarchy via **weight + size** (color carries other meaning). Body measure capped ~60–75ch.

**Color**
- Restrained palette + one accent; system tokens only. No gradients on text/hero unless the brand demands.

**Surfaces**
- **Concentric radius:** outer = inner + padding (card 20px / pad 8px → inner 12px). Padding >24px → treat as independent surfaces.
- **Shadow for elevation, border for structure** — not both arbitrarily. Light mode = 3-layer transparent shadow; dark = single ring.
- **Image outlines** `1px` inset pure black/white at low opacity — never tinted neutrals (read as dirt).

**Alignment**
- **Optical, not geometric:** icon-side padding −2px vs text; play (▶) shifted +2px right; adjust asymmetric SVGs themselves. Trust the eye.

**Motion** (see `design-microinteractions`)
- CSS transitions for interactive states (cancelable); keyframes for one-shots only; stagger ~100ms between semantic groups; motion conveys meaning or is cut.

**Tactile + states**
- Press scale `scale(0.96)` on `:active` — always 0.96. Focus ring present, visible, quiet. Hover reveals affordance or carries info. Empty/loading/error designed (`design-the-states`).

**A11y + content** (see `design-for-accessibility`)
- WCAG AA contrast; keyboard order intentional; hit areas ≥24×24 (WCAG 2.2 min), ≥40×40 for comfortable touch.
- Real test strings: longest plausible name, deepest nesting, slowest network — does it hold up?

## The honest gate
> *Would Linear / Vercel / Raycast / Apple ship this?* If "no — they'd refine more," that's the next pass.
Name which reference you're aiming for the *shape* of — "density like Linear, focus like Apple, metrics
typeface like Vercel" — open it, learn the pattern, re-make it for your context. Never copy the look.

## The discipline
- Polish sits **on top of** usability, never instead of it. A polished unusable flow is still a failure —
  run `heuristic-evaluation` / `usability-test` first.
- These values are exact on purpose — 0.96 not 0.95, 100ms not 80ms — the consistency *is* the feel.
- Polish lives in code with real data on the real screen, not a Figma mockup
  (`prototype-at-the-right-fidelity`).
