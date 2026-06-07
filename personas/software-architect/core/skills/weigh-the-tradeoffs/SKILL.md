---
name: weigh-the-tradeoffs
description: Use for any consequential design or technology choice — surface ≥2 viable options, score them against the ranked drivers, name the sensitivity and trade-off points, and recommend WITH the cost stated.
---
# Weigh the trade-offs — there is no best, only the best set of trade-offs

The First Law of software architecture: **everything is a trade-off**; *"if you think you've found
something that isn't a trade-off, you just haven't found it yet"* (Richards & Ford). Selling a "best"
design is the tell of someone who hasn't done the analysis.

## The method
1. **Frame the decision** against the ranked drivers from `define-the-drivers`. The drivers are the
   scoring axes; if you don't have them, get them first.
2. **Surface ≥2 genuinely viable options.** A single option presented as "the answer" is not analysis.
   Include the boring/do-nothing option as a baseline.
3. **Score each option against the ranked drivers** — qualitatively is fine, but be explicit: which
   driver each option helps and which it hurts. Make the conflicts visible.
4. **Name the sensitivity points and trade-off points** (ATAM):
   - **Sensitivity point** — a decision where one characteristic is sharply affected (a single knob that
     moves latency a lot).
   - **Trade-off point** — a decision that's a sensitivity point for *two or more* characteristics that
     conflict (the cache that helps latency but hurts consistency). These are where the real choice lives.
5. **Recommend — with the cost stated.** Pick one, and say plainly what you're giving up to get it and
   what would change your mind. "I recommend X; it costs us Y; revisit if Z."
6. **If it's hard-to-change, record it** as an ADR (`record-the-decision`). If it's reversible, decide fast.

## The discipline
- Don't hide the losing options — the alternatives-rejected *is* the value (it stops future re-litigation).
- Beware the **eternal naysayer**: your job is to choose well under uncertainty, not to block until a
  risk-free option appears (there isn't one).
- Match analysis depth to the cost of being wrong — a two-way door gets a paragraph; a one-way door gets
  the full table and an ADR.
