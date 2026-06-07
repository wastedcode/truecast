---
name: write-ui-microcopy
description: Use when writing any words inside the UI — button verbs, labels, empty/error/success messages, tooltips, confirmations, onboarding. Copy is interface; make it specific, in the product's voice, and helpful at the moment of friction. Not generic CTAs.
---
# Write UI microcopy — words are interface

The words *inside* the UI are part of the design, not an afterthought for "content" — a label, a button
verb, an error line steers behavior more than most pixels. Microcopy is yours (the product's *external*
positioning and marketing copy is the marketer's — consult them when the line carries brand weight, but
the in-product words are interface and they're yours).

## The rules
1. **Verbs the user actually wants.** Not "Submit," "Get Started," "Learn More" — the specific action:
   "Connect repo," "Re-run build," "Talk it through →." The button says what happens when you press it.
2. **Labels in the user's language** (match-to-real-world, heuristic #2) — not internal jargon or DB
   field names. The label is what the user would call the thing.
3. **Errors: name what's wrong + the way out** (heuristic #9). Not "Error 500" / "Something went wrong" —
   "We couldn't reach the server. Retry, or check your connection." Plain language, honest, no dead end.
4. **Empty states say something specific** (`design-the-states`) — what this is for and the next step, in
   voice; never "Nothing here yet 🎉."
5. **Confirmations for the destructive** — name the consequence ("Delete 3 items? This can't be undone"),
   give the escape. Match the friction to the stakes.
6. **Set expectations** — especially for slow or AI work: "This usually takes a few seconds"
   (`design-the-ai-interaction`).

## The voice discipline
- **Consistent voice** across the product — one personality (direct, honest, calm — match the product's).
  Decide the voice once; apply it everywhere.
- **Concise** — every word earns its place; users scan, they don't read. Front-load the meaning.
- **Honest, not cute** — humor and emoji rarely survive the user who's frustrated or confused at that
  exact moment; respect the user's intent over a quip.
- **Clear over clever** — if a clever line risks ambiguity, the plain line wins. Clarity is the job.

## The discipline
- Microcopy is most load-bearing exactly where the user is stuck (error, empty, confirmation) — write
  those with the most care, not the least.
- Test labels for ambiguity in a `usability-test` — if two users read a label two ways, it's a bug.
- Pull in the **marketer** when in-UI copy bleeds into positioning/brand voice; pull in the
  **product-manager** when the words imply a promise about what the product does.
