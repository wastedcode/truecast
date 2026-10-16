---
name: design-the-mark
description: Use when creating or refining a wordmark, symbol, favicon or avatar — explore broadly, then draw like a type designer (optical kerning, overshoot, stroke contrast, an explainable construction), and test at 16px, one colour, reversed and on noise before exporting clean SVG and raster sizes.
---
# Design the mark — drawn, not typed

A wordmark is not a font with a name typed in it. It's drawn: each letter pair spaced by eye, details
adjusted so it reads at a glance and at 16px.

## Explore, then draw
1. **Explore broadly** — 20+ quick sketches across approaches: pure wordmark, wordmark + symbol, symbol
   from a letter, symbol from the product's mechanism, a typographic quirk (a ligature, a cut, a character
   swap). Most will be bad; that's the point.
2. **Shortlist 3** that express the brand idea and pass `test-distinctiveness`.
3. **Draw** the winner in SVG:
   - Start from a typeface whose licence allows modification (or an open-source face), outline it, then
     customise: tighten or open spacing by eye, adjust one or two letterforms to carry the idea.
   - **Optical kerning** — round and diagonal letters need less space than straights; check every pair.
   - **Overshoot** — round letters slightly exceed the baseline/cap height so they look the same size.
   - **Consistent stroke logic** and terminals; no accidental tangents or near-misses.
   - **Construction** you can explain in a sentence (grid, angle, ratio).

## Test before shipping
- 16×16 and 32×32 favicon (simplify to a symbol or monogram if the wordmark doesn't survive), 180×180
  touch icon, 512 avatar (circle-cropped too).
- One colour, reversed, on light, dark, and a busy photo.
- Beside its name in body text, in a nav bar, in a README header (GitHub light and dark).
- Clear space and minimum size defined.

## Export
SVG (clean paths, viewBox tight, no embedded raster, `<title>` for accessibility), favicon set
(`favicon.svg` + `.ico` fallback + `apple-touch-icon.png`), PNG at 1×/2×, a mono version. Name files
predictably.
