---
name: build-the-messaging-house
description: Use when copy across surfaces is inconsistent or ad-hoc, when you need a reusable messaging framework the whole team can derive from (homepage, deck, ads, onboarding all ladder to the same core), to pressure-test whether a proof point actually discriminates (true-but-weak stats) or whether naming a customer/competitor is a good look, or to audit README/docs/changelog/marketing for drift against each other and against the real shipped surface.
---
# Build the messaging house — one core message, pillars, proof

Positioning (`write-the-positioning`) is the strategy; the messaging house is the **reusable structure**
that turns it into words every surface and every teammate can derive from — so the homepage, the sales
deck, the ad, and the onboarding all say the *same true thing* in their own register.

## The structure
1. **The core message (the roof)** — one sentence: the single most important thing this product means to
   this audience. Derived from positioning's value + category. This is the "if they remember one thing."
2. **3–5 message pillars (the columns)** — the themes that support the core (e.g. *simplicity, speed,
   trust*). Each pillar is a benefit the audience cares about, not a feature. More than ~5 and nothing is
   memorable; fewer than 3 and it's thin.
3. **Proof points under each pillar (the foundation)** — the evidence that makes the pillar believable:
   a capability, a metric, a customer story, a screenshot, a third-party validation. **Every pillar must
   stand on real proof** or it's a claim you can't back (`honor-the-voice`). True isn't enough — see the
   proof-point discipline below.
4. **The supporting layer** — the elevator pitch (1 sentence), the short pitch (1 paragraph), the boiler
   (the "about" line), and the one-liner per pillar. These are the building blocks all copy reuses.

## Proof points: true is the floor, not the bar (discriminate, and check the look)
`honor-the-voice` gates that a claim is *true*. The messaging house gates that it's *good proof* — true
proof can still be weak proof. Before a proof point earns a place under a pillar, it must pass both checks:
- **(a) Does it discriminate / move belief?** A true stat that any competitor could also claim, or that a
  skeptic shrugs at, is not proof — it's filler. The test is: *would a reasonable skeptic update toward us
  because of this?* A true-but-non-discriminating number is the classic trap — e.g. **"6 of 600"** is
  technically true and actively *weak*: the denominator undercuts the claim and it differentiates nothing.
  Cut it, or find the cut of the data that actually discriminates (the segment where it's 6 of 8, the
  trajectory, the outcome). Prefer proof that the **alternative structurally cannot match**
  (`differentiate-and-counter`) — that's what moves belief.
- **(b) The good-look / punching-down check, before you name names.** Naming a specific customer or
  competitor is a *judgment call*, not a free win. Before naming: do you have the right to use the customer
  (permission, and does association with them flatter or cheapen the brand)? Does naming a competitor read
  as a **confident contrast or as punching down / insecure mudslinging** — and is calling out a smaller or
  sympathetic player a good look at all? When in doubt, make the point with the contrast, not the name. A
  proof point that wins the argument but reads as a bad look is a net loss.

## The method
- Map each pillar to the **job** it serves (`message-the-job-not-the-feature`) and the **awareness stage**
  where it lands (`sequence-by-awareness`) — pillars aren't all said to everyone.
- Pressure-test: can every line on the homepage, deck, and landing page be traced to a pillar? Anything
  that can't is either off-message (cut it) or a missing pillar (rare — add deliberately).
- Keep it **one page.** A messaging house nobody can hold in their head won't be used; the team will
  re-improvise and the message will fragment.

## Audit for drift — against each other AND against the real shipped surface
The house keeps surfaces consistent with each other; this keeps them consistent with **reality**. Two
kinds of drift, both corrosive — run this audit periodically and before any launch:
1. **Cross-surface drift** — the homepage, deck, ads, and onboarding have wandered off the house and now
   contradict each other (different core claim, a pillar dropped on one surface, a stale tagline). Trace
   every surface back to the house; reconcile or re-derive.
2. **Drift vs. the real product (the DevRel check).** This is the one that burns trust: the **README, the
   docs, the changelog, and the marketing copy describe a surface the product no longer has** — a renamed
   command, a removed flag, a feature pitched that shipped differently or not at all, a screenshot of old
   UI, a "new in v2" note for something that's been default for a year. Walk the *actual shipped surface*
   (the real CLI/API/UI, the real flags, the real behavior) and reconcile every claim against it.
   Anything the product can't currently back is `honor-the-voice` debt — fix the copy or flag the gap; do
   not let docs/README/changelog narrate a product that isn't there.
- Write like a **DevRel who uses the product**, not an LLM summarizing a spec: if you wouldn't recognize
  the described product from running it, it has drifted.

## The discipline
- The house is the **antidote to drift**: when a new artifact is needed, you don't write from scratch, you
  derive. When someone proposes off-message copy, the house is the referee.
- Revisit when positioning changes, a pillar stops resonating in testing, or a new segment needs its own
  emphasis (same core, re-weighted pillars) — not on a calendar.
