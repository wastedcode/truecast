---
name: beat-the-frontier
description: Use before any substantive design deliverable and as the last pass before handing it over — your version of the engine's "beat the frontier" loop. Name who designs this kind of surface best today, set the bar above them, pre-empt every ask a demanding design lead would make (IA, every state, mobile, consistency, real data), render and inspect the work, and critique it as that designer would until nothing material is left.
---
# Beat the frontier — design

Avoiding slop is the floor. The bar is **the best designer shipping this kind of surface today, and past
them** — the user should never have to come back with "this is ugly", "what about mobile?", "why is there
empty space here?", or "did a designer even look at this?". Every one of those is an ask you could have
answered first. You can render every breakpoint, try more directions and check every state in less time
than a human team takes to try one. Do that.

## 1. Name the frontier (seeds as of 2026-10 — search for who's leading now before you rely on them)
| Kind of work | Who sets the bar | Look at |
|---|---|---|
| Product UI, B2B tools | Linear design team (Karri Saarinen); Vercel design / Geist | the "new Linear" relaunch; Geist + Vercel's web-interface guidelines |
| Interaction + motion detail | Rauno Freiberg; Emil Kowalski | devouringdetails.com; emilkowal.ski, Sonner/Vaul |
| Marketing + launch art direction | Stripe design (stripe.com, Sessions, Press); Linear/Vercel launch pages | the latest launch page each has shipped |
| Visual identity, hardware→software | Teenage Engineering; Nothing | product + site language |
| Platform conventions | Apple HIG (incl. 2025 Liquid Glass) | the HIG section for your component |
| Information design | newsroom graphics desks; Tufte · Cairo · Knaflic canon | a recent graphic explaining a hard topic |
Cover every leader relevant to *this* deliverable. Open their latest work (WebFetch/screenshot it) and write down
the specific moves you're taking — never the look wholesale.

## 2. What their work does that competent work doesn't
- The real product, real data, real output carries the page — not blobs, stock or abstract shapes.
- Information architecture is decided first: what matters most, what's shown vs. collapsed, and why.
- Every interactive state is designed: hover, focus-visible, active, disabled, loading, empty, error,
  overflow, optimistic, and the signed-in/first-visit/returning variants.
- Type is tuned to the content: a scale derived from the real longest headline and densest table, tabular
  figures in data, a deliberate measure.
- Motion explains (origin, state, cause) and stays out of the way of keyboard actions.
- Optical correction over geometric; concentric radii; one icon set, one weight.
- One idea per page, executed in every detail (`art-direct-the-visual`); data structured to act on, not
  displayed (`explain-with-visuals`).

## 3. Table stakes — the canon you already exceed
Norman, *Design of Everyday Things* · Krug, *Don't Make Me Think* · Nielsen's 10 heuristics · WCAG 2.2 AA ·
Refactoring UI · Butterick, *Practical Typography* · Tufte / Knaflic for data. Meeting these is not the bar;
it's the entry ticket.

## 4. Where you go past them
- **The composite, first:** one deliverable that carries the signature move of *every* leader in §1 at
  once — something none of them could produce alone — and then the coverage below, which none of them can
  afford. Beating any one of them is a miss.
Humans can't afford these; you can, so they're part of your bar:
- Render **every** state at **every** breakpoint (375 · 768 · 1280 · 1440+), light and dark, with the
  longest real string, an empty dataset and a huge one — and look at each screenshot.
- Explore **at least 5 genuinely different directions** before converging, and say why the winner won.
- Check contrast and target size on **every** pair, not a sample; click **every** control.
- Reconcile **every** number shown against its source and against every other place it appears.

## 5. The asks to pre-empt (do these before anyone asks)
- **IA first:** what is this surface for, what's most important, what's above the fold, what's collapsed —
  and the reason for each. Summary first, detail on demand.
- **Mobile:** designed, not reflowed. Filters, tables and long lists work with a thumb.
- **All the permutations:** has sort × has filter × user typing × empty × loading × error × huge list ×
  signed in/out. Search is debounced; long dropdowns become filterable lists.
- **Consistency:** the same concept looks and is named the same everywhere; facts (dates, counts,
  timezones — the viewer's) agree across pages; every entity that can be linked is linked.
- **Readable, not displayed:** no internal codes, enum values or jargon on the surface; units and
  timeframes on every number; diagrams that explain, not boxes.
- **Pixel audit:** no dead/blocky whitespace, nothing squished or overlapping, no two treatments for one
  kind of element.
- **Not busy:** adding a feature doesn't add clutter — find the simplest form (Nielsen would ask).
- **Honest:** no invented stats, logos or testimonials; leave the slot empty until a real one exists.
- **Feels fast:** no layout shift, perceived speed handled (skeletons, optimistic updates).
- **The house rules:** the project's design principles and the version the founder already approved.

## 6. The critique pass — be the designer you named
Render it, put it next to the exemplar, and review it in their voice: Where would Linear's team say the
density or hierarchy is off? What would Rauno call un-considered in the interaction? Would Stripe's art
directors sign the hero? Then run `heuristic-evaluation`, `refuse-ai-slop` and `polish-the-interface`. Fix,
re-render, repeat until a pass finds nothing material.

## 7. The Frontier check (end of the deliverable, ≤6 lines)
- **Benchmark:** every leading exemplars you held it against (named, linked).
- **Where this beats each of them:** concretely, one line per leader.
- **Covered:** the founder's constraints + the pre-empted asks above (call out any you judged N/A and why).
- **Critique caught:** what the last passes found and you fixed.
- **Verified:** breakpoints × themes rendered and inspected; controls clicked; numbers reconciled.
