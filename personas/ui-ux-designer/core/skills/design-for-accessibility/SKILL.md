---
name: design-for-accessibility
description: Use on every surface — accessibility is designed in, not bolted on. ~80% of accessibility is design decisions (contrast, hierarchy, target size, focus order, labels) made before code. Design to WCAG 2.2 AA as the floor and the POUR principles.
---
# Design for accessibility — designed in, never bolted on

Around **80% of accessibility issues are design decisions** — contrast, text size, hierarchy, copy
clarity, target size, focus order, component labels — made *before* a developer writes code. So
accessibility is *your* job, up front, not a dev's checklist at the end. The goal is not compliance
theatre; it's that a real person on a keyboard, a screen reader, voice control, or low vision can do the
job. WCAG 2.2 **AA is the floor** (and the legal bar — EAA, Section 508, AODA), not the ceiling.

## POUR — the four principles
- **Perceivable** — users can sense the content (contrast, text alternatives, not relying on color alone).
- **Operable** — users can drive it (keyboard, target size, no traps, enough time).
- **Understandable** — predictable, clear, error-tolerant.
- **Robust** — works with assistive tech (semantic structure, proper roles/labels).

## What you decide at design time (the designer's checklist)
1. **Contrast.** Body text ≥ **4.5:1**, large text ≥ **3:1**, UI components/graphics ≥ **3:1** (WCAG 2.2 AA).
   Check every text-on-background and every state. The single most common failure on the web.
2. **Never rely on color alone** to convey meaning (status, error, required) — pair with an icon, label,
   or shape. Colorblind users and grayscale contexts must still parse it.
3. **Target size** ≥ **24×24px** (WCAG 2.2 AA min); ≥44×44 ideal for touch. No overlapping hit zones.
4. **Focus order + visible focus.** Tab order follows reading/logical order; every interactive element has
   a visible, considered focus indicator (designing it *out* is a violation). No keyboard traps — if you
   can hover to it, you can keyboard to it.
5. **Labels + names.** Every input has a real label (not just a placeholder); every button/icon-button/link
   has an accessible name; images have alt text intent. Form errors are programmatically associated.
6. **Hierarchy + structure.** Real heading levels in order; landmarks; meaningful reading sequence — this
   is what a screen reader navigates by.
7. **Text + zoom.** Resizable to 200% without loss; don't bake text into images; respect `prefers-reduced-motion`.
8. **Plain, clear copy** and clear error recovery (`write-ui-microcopy`).

## The method
- Bake the checklist into the design *before* handoff; annotate focus order, labels, and alt-text intent
  on the spec so the engineer implements them, not guesses.
- **Re-check on AI-generated UI specifically** — AI output reliably *misses* accessibility (contrast,
  focus, labels, breakpoints). You are the quality gate (`design-the-ai-interaction`'s sibling concern).
- Verify the *built* surface: tab through it with no mouse, run a contrast checker, zoom to 200%, check it
  with a screen reader if you can.

## The discipline
- Accessibility overlaps usability — most a11y fixes make the product better for *everyone* (clear focus,
  good contrast, big targets, plain errors). It is not a tax; it's the floor of usable.
- Consult the **software-engineer** for the semantic implementation (roles, ARIA, focus management) — you
  design the requirement; they implement it correctly.
