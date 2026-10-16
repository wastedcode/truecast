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
- **Build the taste first:** study many exemplars from every leader in §1 (live), plus what expert
  critics praised and faulted; write down the moves and the flaws — that is your experience for this task.
- **Search the space:** concept × layout/composition × type system × colour × density × imagery (real UI, diagram, data) × motion × interaction model — render every candidate at 375 and 1440 and keep the ones that win side by side. Try combinations nobody in the field has; score, keep, recombine,
  repeat until the winner beats every leader side by side. Say how many you tried.
- Render **every** state at **every** breakpoint (375 · 768 · 1280 · 1440+), light and dark, with the
  longest real string, an empty dataset and a huge one — and look at each screenshot.
- Search well beyond 5 genuinely different directions before converging, and say why the winner won.
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
- **The primary flow, walked for real:** run the page's main action exactly as a visitor would (copy →
  paste → run in the actual tool). If you can't run it, design it so it can't fail: one command per copy
  button, steps in order, what they'll see at each step. Every entry point (hero, per-item buttons, final
  CTA) leads into a path that works for a first-time visitor.
- **A homepage arc, not a document:** a focal hero, then varied beats — change scale, layout and ground
  between sections; at least one full-bleed moment; a signature device carried through. Set a length budget
  against the exemplars' page heights; never show the same block twice.
- **Fold balance:** at 1024–1920 the hero's columns end together; no dead block beside a tall visual;
  the hero visual is meaningful in its first frame (no blank panel while an animation starts).
- **Dark theme designed, not swapped:** surfaces step up in elevation (cards clearly separate from the
  page, ≥ ~1.15:1 luminance step plus border); check every component in dark, not just text contrast.
- **Typography controlled at every width:** headline and eyebrow line breaks chosen at 320/390/768/1440
  (`text-wrap: balance`, deliberate breaks) — no orphaned word or leading separator; no letter-spacing on
  monospace; underlines with arrows render as one continuous unit.
- **Code is copyable by eye:** never wraps mid-token or mid-object — size it, let it scroll, or reflow it
  deliberately; every command block gets the same copy affordance; rendered samples never mix raw markup
  (`**`) with formatting.
- **Responsive truth:** hiding or eliding content on small screens never changes what a label claims
  ("verbatim", "full"); the hierarchy (what's primary) stays the same at every width; repeated rows align
  to one grid with equal widths.
- **Nav and footer:** every nav label matches where it lands; the footer names the maker, license, year,
  and where to get help/report security issues.
- **Diagrams:** every element labelled; the point lands in one look (`explain-with-visuals`).
- **Keyboard:** focus rings never clipped; no long runs of decorative tab stops.
- **One dataset, one visual language:** the same data (and the brand's signature device) is drawn one way
  everywhere on the surface — never bars here and bands there.
- **Comparisons show every item at every width:** a figure that compares N things shows all N on a phone
  (reflow, wrap, small multiples) — no hidden sideways scroll for the thing the figure exists to show.
- **Feedback where the eyes are:** confirmation appears next to the control the user is looking at — after
  any scroll/jump, at the destination; anchored targets clear the sticky header (`scroll-margin-top`).
- **Primary command on one line at desktop widths:** the hero's copy target never wraps where a section
  below shows it on one line.
- **The first screen carries the payoff at every width:** on a phone too, the reason it beats the reader's
  alternative is visible before the first scroll — reorder or condense for small screens; don't just stack.
- **No dead columns:** in any multi-column section, both columns end within a line or two of each other at
  1024–1920; a sidebar that ends early gets content, sticks, or the layout changes.
- **Mobile length budget:** the page at 375 is measured against the exemplars at the same width; collapse
  long lists/trees behind summaries on small screens rather than shipping a page 1.5× the desktop length.
- **Copy by selection works too:** a wrapped command, selected and copied by hand, yields runnable text
  (no CSS-only continuation characters that selection skips; no block-level splits that insert newlines).
- **Copy edits keep the receipts:** when you change any sentence during a fix, re-check it against the
  claim ledger and the source; a fix never broadens a claim. Regenerate every derived asset it appears in.
- **Generated figures are rebuilt from the tree at hand-off:** any number, bar or list drawn from source
  files (word counts, versions, file trees) is produced by a generator with a `--check` mode; before hand-off
  you re-run every generator against the current tree and the check is clean, and the hand-off names the
  commands. A figure that was right when drawn and wrong at merge is a false claim.
- **Typographic roles are semantic:** a face or style that means something on the page (e.g. mono = literally
  typed/printed) is used only for that, everywhere.

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
