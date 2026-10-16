# Brand craft foundations — reference

## The core model
- **A brand is a gut feeling** about a product, held by a person (Neumeier, *The Brand Gap*). You can't
  own it; you can only shape it with consistent, distinctive signals.
- **Distinctive brand assets** (Romaniuk): colours, shapes, characters, type, sounds and phrases people link
  to one brand. Two measures: *fame* (how many category buyers link it to you) and *uniqueness* (how few
  link it to competitors). Build a few, use them consistently for years.
- **Mental and physical availability** (Sharp, *How Brands Grow*): brands grow by being easy to recall in
  buying moments and easy to find. Identity serves recall; consistency compounds.
- **Differentiation by zag** (Neumeier, *Zag*): when everyone zigs, zag — but only where it means something.

## Identity process (Wheeler, *Designing Brand Identity*, adapted)
Research → strategy (the idea) → design (territories → mark → system) → touchpoints → guidelines →
stewardship. Skipping strategy is the most common cause of a pretty, empty identity.

## Type craft essentials
- Optical kerning beats metric kerning in display sizes; check every pair in the wordmark.
- Overshoot: round letters (O, C, S) extend ~1–3% past baseline/cap height to look equal.
- Display tracking tightens as size grows; small text often needs slightly positive tracking.
- Licences: check desktop vs. web vs. modification rights. Open-source (OFL) faces allow modification and
  self-hosting; Google Fonts and Fontshare are common sources.

## Technical specs that bite
- Favicon: `favicon.svg` (can include a `prefers-color-scheme` media query), `favicon.ico` 32px fallback,
  `apple-touch-icon.png` 180×180, optional 192/512 PNGs in a web manifest.
- Social card: 1200×630 PNG/JPG, key content inside the central ~1000×500; `og:image`, `og:title`,
  `og:description`, `twitter:card=summary_large_image`. Keep text ≥ ~40px so it reads in a feed.
- GitHub README light/dark: `<picture><source media="(prefers-color-scheme: dark)" srcset="…"><img …></picture>`.
- SVG: tight `viewBox`, no embedded raster, `role="img"` + `<title>`, `currentColor` where the mark should
  inherit colour.
- Contrast: WCAG AA 4.5:1 body text, 3:1 large text and UI components; check every allowed pairing.

## Canon
Wheeler · Neumeier · Romaniuk · Sharp · Paul Rand, *Thoughts on Design* · Massimo Vignelli, *The Vignelli
Canon* · Michael Bierut, *How to* · Debbie Millman, *Brand Thinking*.
