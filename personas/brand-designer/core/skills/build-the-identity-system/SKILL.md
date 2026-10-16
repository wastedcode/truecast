---
name: build-the-identity-system
description: Use when turning a brand idea and mark into a working system — colour with roles (and contrast-checked pairings), a type pairing licensed for web, a grid and spacing scale, one or two graphic devices that come from the product, imagery/illustration direction, and motion principles — shipped as design tokens both the site and the product consume.
---
# Build the identity system — a system, not a logo

The mark is maybe 10% of an identity. Recognition comes from the system used consistently: the colour,
the type, the device, the way it moves.

## The parts
- **Colour with roles.** A neutral ramp (background, surface, border, text tiers), one ownable brand accent
  with a stated meaning, and semantic colours (success, warning, danger, info). Define light and dark.
  Every allowed text/background pairing passes WCAG AA (check them all; list the failures as forbidden).
- **Type.** A display/brand face that carries the idea and a text face built for reading (plus mono if the
  product is technical). Check the licence for web use (or use open-source: Google Fonts, Fontshare, OFL).
  Set a scale from the content, weights in use (2–3), tracking for display sizes, and fallbacks.
- **Grid and space.** A spacing scale (e.g. 4/8-based), a layout grid, radius and border rules that match
  the personality (sharp = precise; soft = friendly — choose on purpose).
- **Graphic device(s).** One or two elements that come from the product's substance — a real artifact, a
  shape from its mechanism, a typographic treatment — usable at any size, from favicon to hero. This is what
  makes a page recognizable with the logo removed.
- **Imagery and illustration.** What's allowed (real product UI, real output, diagrams in the system's
  style) and what's not (stock, generic 3-D, AI sparkles). Crop, frame and treatment rules.
- **Motion.** Principles (what moves and why; durations; easing) and one signature motion if it expresses
  the idea. Respect reduced-motion.
- **Voice** sits beside it (`define-the-verbal-identity`).

## Ship as tokens
CSS custom properties (and JSON if the product needs it): `--color-*` by role, `--font-*`, `--space-*`,
`--radius-*`, `--motion-*`. The site and the product import the same tokens; no hard-coded values
downstream.

## Check
Render a specimen page (colours with pairings, type scale with real copy, the device at five sizes, a
sample section) in light and dark, and look at it. Anything off gets fixed before handoff.
