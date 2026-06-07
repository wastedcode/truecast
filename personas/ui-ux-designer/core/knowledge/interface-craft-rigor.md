# Interface craft rigor — the polish + anti-slop reference

The dense, specific reference behind `polish-the-interface`, `refuse-ai-slop`, `design-the-states`,
`design-microinteractions`, and `build-on-the-design-system`. Read when a craft detail is load-bearing.
Values are exact on purpose — *0.96 not 0.95; 100ms not 80ms* — the consistency is what makes it feel right.

## The anti-slop taxonomy — name it, fix it
Adapted from Impeccable's catalog (impeccable.style — also a CLI + Chrome extension running ~29
deterministic checks without an LLM, worth tracking as a future CI gate), Anthropic's frontend-design
skill, and the patterns we keep encountering.

| Anti-pattern | The tell | The antidote |
|---|---|---|
| Purple Gradients | purple→pink / blue→purple hero/button — the signature AI tell | restrained palette, one accent that's ours, solid color |
| Gradient Text | "✨ AI-powered ✨" fill gradient | solid color; weight/size do the work |
| Cardocalypse | cards nested in cards in cards | flat hierarchy; whitespace/dividers structure |
| Side-Tab Cards | thick colored left-border on cards | own the surface OR the divider, not both |
| Inter Everywhere | Inter the only face, four weights | distinctive display + refined body; 1–2 weights |
| Template Layouts | hero + 3-col grid + final CTA | bespoke layout for this content/task |
| Bad Contrast | gray-400 on gray-900 labels | WCAG AA min; AAA on critical |
| Hero Eyebrow Chips | uppercase "INTRODUCING" pill over the h1 | if the h1 needs context, the content says it |
| Pill-Button styling | `border-radius: 999px` everywhere | the system's radius, not the chatbot default |
| Italic-Serif Display Heroes | oversized Fraunces/Recoleta italic h1 | a face+weight that fit the brand and scale |
| Body-Text-at-Viewport-Edge | prose to the screen edge, no measure | cap ~60–75ch |
| Lorem-Empty-States | "Nothing here yet 🎉" | a moment: specific copy + next step |
| Indigo-600 Buttons | Tailwind default brand color | an accent that's yours |
| Rounded-2xl on Everything | every container at 16px | radii on the system rhythm; nested = concentric |
| Animated Everything | decorative fade-ins on every mount | motion = meaning, else none |
| Non-Tabular Numbers in Data | proportional numerics in metrics/tables | `font-variant-numeric: tabular-nums` |
| Geometric (not Optical) Alignment | icon+label centered by math | nudge optically; trust the eye |
| Spinner Where a Skeleton Belongs | spinner for a known-shape list load | skeleton for known shape; spinner for indeterminate |
| Generic CTAs | "Get Started", "Learn More" | the verb the user wants |
| Emoji as Visual Content | 🎉🚀 decorating headers | real iconography, one set |
| Overused Display Fonts | Geist/Mona/Jakarta/Space Grotesk by reflex | distinctive AND purposeful for the brand |
| Marketing-Site Patterns on Product UI | Webflow hero on a dashboard | "brand work is not product UI" |
| Shadows + Borders, Arbitrary | border AND shadow AND bg, no rhythm | pick one; honor the system's separation language |
| Non-Interruptible Animations | keyframes on interactions | CSS transitions (cancelable) for interactions |

**If a draft has 3+ entries here, it needs a rethink, not a tweak.**

## The polish checklist — every surface before it ships
Right-size: a small contained tweak gets a quick pass; a foundational surface gets the depth. Both over-
and under-design are failures. Concrete values from Krehel's *make-interfaces-feel-better* + Anthropic
frontend-design + Impeccable.

**Type**
- `tabular-nums` on *dynamically-updating* numbers (counters, prices, tables, timers, log lines) — NOT
  static/phone/version numbers.
- Font smoothing once at root: `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`
- `text-wrap: balance` on headings/short blocks (≤6 lines Chromium); `text-wrap: pretty` on paragraphs/UI text.
- Hierarchy via weight + size (color carries other meaning). Body measure ~60–75ch. No generic-AI font set.

**Color** — restrained palette + one accent, system tokens only; WCAG AA body / AAA critical; no
gradients on text/hero unless brand demands; accent earns its place.

**Surfaces**
- **Concentric radius:** outer = inner + padding. Card 20px / pad 8px → inner 12px. Padding >24px → treat
  layers as independent surfaces.
  ```css
  .card { padding: 8px; border-radius: 20px; }
  .card > .row { border-radius: 12px; }   /* 20 − 8 */
  ```
- **Shadow for elevation, border for structure.** Light-mode 3-layer transparent shadow:
  ```css
  box-shadow:
    0 0 0 1px rgba(0,0,0,0.06),       /* border ring */
    0 1px 2px -1px rgba(0,0,0,0.06),  /* lift */
    0 2px 4px 0    rgba(0,0,0,0.04);  /* ambient */
  ```
  Dark mode = single ring `0 0 0 1px rgba(255,255,255,0.08)`. Dividers stay borders.
- **Image outlines:** `outline: 1px solid rgba(0,0,0,0.1); outline-offset: -1px;` (dark: white at 0.1).
  Never tinted neutrals — they read as dirt.

**Alignment** — optical not geometric: icon-side padding −2px vs text; play (▶) +2px right; adjust
asymmetric SVGs themselves. Spacing on the token rhythm; no one-off pixels.

**Motion** (see below) · **Tactile:** press `scale(0.96)` on `:active` (always 0.96); focus ring present,
visible, quiet, consistent; hover reveals affordance or carries info; disabled distinguishable + explains
why if non-obvious.

**Interaction & a11y** — keyboard order intentional, everything keyboardable; hit areas ≥24×24 (WCAG 2.2
AA), ≥40×40 comfortable for touch; one icon set, consistent stroke/caps/joins, no emoji glyphs.

**Content** — real test strings (longest plausible name, deepest nesting, slowest network); numbers/dates
in human voice + locale; no Lorem; no generic CTAs.

## The motion patterns (exact)
- **CSS transitions** for interactive state changes (cancelable, retargetable). **Keyframes** for one-shot
  staged sequences ONLY (a confirmation toast, a staggered reveal).
- **Enter:** opacity 0→1 + translateY 12px→0 + (optional) blur 4px→0; ~300ms.
- **Exit:** opacity 1→0 + translateY 0→−12px; ~150ms — faster than enter, but never zero.
- **Stagger:** ~100ms between semantic groups (heading → description → buttons). Not 80, not 120.
- **Icon swap:** scale 0.25→1, opacity 0→1, blur 4px→0 (spring if available; else cross-fade both icons).
- Respect `prefers-reduced-motion`.

## The underrated three states
- **Empty = a moment.** Specific copy + the affordance for the next step. Not "Nothing here yet 🎉." Often
  deserves more care than the populated state (first impression).
- **Loading = skeleton over spinner.** Skeleton when shape is known; spinner for indeterminate/short/modal;
  nothing under ~300ms (the flash is worse than the wait).
- **Error = name what's wrong + the next step**, in voice. Specific, not "Something went wrong."

## The reference bar — steal the pattern, not the look
- **Linear** — information density done right; keyboard-first; calm motion; one accent + neutrals.
- **Vercel** — restrained monochrome + one accent; type as hierarchy; tabular nums everywhere;
  engineered-feeling surfaces (consistent borders, concentric radii, spacing rhythm).
- **Raycast** — command/chat as the primary verb; list rows that earn their density; subtle custom icons.
- **Apple** — optical alignment as religion; typography does almost everything, color little; considered
  focus rings; empty states are moments.
- **Anti-references:** marketing-site templates on product UI; "AI-powered" gradient+sparkle landing pages;
  generic Tailwind-default looks (indigo-600 + gray-900 + rounded-2xl + Inter = "didn't decide").
- Before a new surface, name which reference you're aiming for the *shape* of, open it, learn the pattern,
  re-make it for your context. **Never copy; understand then re-make.**

## Design in the system (atomic — Frost)
- **Tokens** (subatomic, single source of truth): color, spacing, radius, type scale, motion timing —
  never inline these. **Components**: recurring token compositions, each carrying all its states. **Patterns/
  templates**: how components compose. Labels matter less than the model.
- One-off value? STOP: use a close-enough system value, or add a recurring pattern to the system once
  (token/component), document it, reuse on the next two surfaces. Genuine one-offs are rare and obvious.
- Bar question: *does this respect the system, or fight it?* If "fight," refactor before shipping —
  fighting it once teaches every future contributor (and AI) to do the same.

## Sources
- Impeccable — impeccable.style (anti-slop catalog + deterministic detection CLI/extension).
- Anthropic — frontend-design skill ("commit to a bold aesthetic direction").
- Krehel — make-interfaces-feel-better (the exact polish/motion values).
- W3C WCAG 2.2 — target size, contrast, keyboard.
- Brad Frost — Atomic Design + design tokens.
- Reference bar: Linear, Vercel, Raycast, Apple product UIs.
