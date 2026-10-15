---
name: explain-with-visuals
description: Use whenever data, a mechanism, a comparison or a story has to land — dashboards, stat pages, tables, explainers, blog/insight posts, architecture or flow diagrams. Structure the data so the reader can understand and act, not just see it; draw diagrams that replace paragraphs, never labeled boxes; one composed visual per claim, built from real data.
---
# Explain with visuals — so the reader gets it in one look and knows what to do

Displaying data is not designing it. A table of raw fields, an internal code (`Q55`, `tier_2`), a diagram
of labeled rectangles joined by arrows — those are *storage*, handed to the reader to decode. The job is
the opposite: **decide what the reader needs to understand or do, then make the visual answer that in one
look.** The bar is the best information designers working today (newsroom graphics desks, Stripe/Linear-
grade product explainers, Tufte/Cairo/Knaflic canon) — and past them, because you can try more forms and
check every number.

## The loop
1. **Write the takeaway first, in one sentence.** "Contested strings get 4× the registrations of
   uncontested ones." If you can't write it, you don't have a visual yet — you have data. The headline of
   the visual *is* this sentence, not a label ("Registrations by type").
2. **Name the reader's next action.** Compare? Pick? Spot the outlier? Trust the number? The form follows
   the action: compare → aligned bars on a common baseline; change over time → line; part-to-whole of ≤4 →
   stacked bar (rarely a pie); rank → sorted bars/list; relationship → scatter; flow/mechanism → a diagram
   with real nouns; one number that matters → a big number *with its context* (vs what, since when).
3. **Strip to the signal.** Remove every mark that doesn't carry the takeaway: gridlines to a whisper,
   no 3-D, no legend when direct labels fit, no dual axes, no decoration. Highlight the one series that
   matters; grey the rest. Sort by the value, not alphabetically, unless lookup is the task.
4. **Translate into the reader's words.** No internal codes, enum values, DB column names, or jargon on
   the surface. "Q55" becomes the thing it means; a score gets its scale and what "good" is beside it.
   Units and timeframe on every number. Same term for the same thing everywhere on the site.
5. **Summary first, detail on demand.** The glanceable answer is above the fold; the breakdown, raw rows
   and methodology sit one click/expand away (Shneiderman: overview → zoom/filter → details on demand).
6. **Build it from real data and check it.** Every number traces to the source; totals reconcile; the same
   figure shown in two places agrees; the scale is honest (bars start at zero; no truncated axes that
   inflate change). Render it at the smallest screen it will meet.

## Diagrams that explain (not boxes)
A diagram earns its place when it replaces a paragraph the reader would otherwise have to hold in their
head. Test: cover the prose — does the diagram alone tell the story?
- **Show the mechanism, with real nouns and real values** — "your browser → Cloudflare checks the
  signature → origin", with the actual header or number on the arrow, not "Client → Service → DB".
- **One idea per diagram.** If it needs a legend of eight shapes, it's three diagrams.
- **Encode meaning in position and shape** — time flows left→right, trust boundaries are visible regions,
  the thing that matters is the biggest/most contrasted element; colour only for a category that matters.
- **Sequence for change** — a before/after pair or a 3-step strip beats one dense omnibus picture.
- **Make it native**: inline SVG/HTML that inherits the page's type and colour tokens, works in dark mode,
  and reflows on mobile (stack vertically under ~600px rather than shrinking text to illegibility).

## Storytelling with data (posts, insight pages, launch pages)
- Lead with the stake: why should *this* reader care, in their terms — then the evidence.
- One composed visual per claim; the prose says what to notice, the visual proves it.
- Ask "why would a journalist cite *this* instead of a thousand other articles?" — the answer is usually
  a number nobody else has, shown so clearly it can be screenshotted and stand alone (title, source, date
  on the image).

## The critique pass (as the best graphics editor you can name would run it)
- Can a stranger state the takeaway after 5 seconds? Without reading the body?
- Is there any mark, label or colour that carries nothing? Delete it.
- Any internal code, unexplained number, or missing unit/timeframe?
- Does every number reconcile with the source and with every other place it appears?
- Does it hold at 375px wide, in dark mode, for a colour-blind reader (don't encode by red/green alone)?
- Did you try at least one other form and is this one clearly better?

Pairs with `design-information-architecture` (what goes where), `compose-the-layout` (focal point), and
`art-direct-the-visual` (the look it's rendered in).
