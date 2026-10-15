---
name: apply-across-touchpoints
description: Use before calling any identity work done — apply the system to every surface the product actually has (homepage hero, README header in GitHub light/dark, social/OG card, favicon set, docs, CLI output, package page, slides), render each, and review them side by side for consistency and craft.
---
# Apply across touchpoints — the identity lives where people meet it

An identity shown only on a presentation board hasn't been tested. People meet the brand in a browser tab,
a GitHub page, a link preview, a terminal. Design for those.

## The touchpoint set (adapt to the product — find every surface it really has)
| Touchpoint | Spec to meet |
|---|---|
| Homepage hero | the idea readable in 5 seconds at 1440 and 390 wide |
| Favicon set | `favicon.svg`, 32px `.ico`, 180 `apple-touch-icon` — legible in a crowded tab bar |
| Social / OG card | 1200×630 PNG, safe area, legible at feed size; `og:image` + `twitter:card` wired |
| README header | renders in GitHub light *and* dark (use `<picture>` with `prefers-color-scheme` sources) |
| Docs | the system's type and colour, quieter |
| CLI / terminal output | the brand in 16 ANSI colours or none; works in light and dark terminals |
| Package / marketplace listing | name, one-liner and icon consistent with the site |
| Slide / talk title | one template slide |

## The review
Render every touchpoint (headless browser via Bash; Read the PNGs) and lay them out on one board. Check:
- One idea visible in every one; same names, same colours by role, same type.
- Each passes its spec (sizes, safe areas, light/dark).
- Pixel level: spacing, alignment, kerning, colour values — nothing anyone would ask you to nudge.

Ship the assets in the repo where the surfaces load them, with the wiring (meta tags, `<link rel="icon">`,
README markup) done, not described.
