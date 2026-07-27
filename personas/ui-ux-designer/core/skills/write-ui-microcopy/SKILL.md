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
  Decide the voice once and **write it down**: a mini voice spec in this project's `instance/` — five
  words we use, five we never use, one reference error message, one reference empty state. "Off-voice"
  then cites a spec line, not a feeling; and the spec is derived from *this* product's users
  (`research-the-user`), not a house default.
- **The user's vocabulary, not yours** — labels and messages use the words this audience uses for these
  things (an on-call SRE and a first-run consumer don't get the same register, density, or patience).
- **Concise** — every word earns its place; users scan, they don't read. Front-load the meaning.
- **Honest, not cute** — humor and emoji rarely survive the user who's frustrated or confused at that
  exact moment; respect the user's intent over a quip.
- **Clear over clever** — if a clever line risks ambiguity, the plain line wins. Clarity is the job.

## The AI register is not a voice (the microcopy scrub)
Unedited model output has a recognizable in-product register, and users have learned to read it as
"nobody wrote this." Scrub for it wherever copy was generated (clusters, not single hits — era: 2026):

- **Exclamation cheer.** "You're all set! 🎉" "Great choice!" — the model celebrates; a product speaks.
  State what happened and what's next.
- **Apology theater.** "Oops! Something went wrong on our end. Don't worry —" is three tells in one line:
  the mascot "Oops," the vague failure, the instruction to feel. Name what broke + the way out (rule 3).
- **Hedge padding.** "It looks like you may not have any projects yet" — the user either has projects or
  doesn't; the softener is the model's, not the product's. "No projects yet. Create one."
- **Chatbot pleasantries in chrome.** "Sure!", "Let's get you set up!", "Feel free to…" in buttons,
  tooltips, onboarding — conversational filler where an interface should be an instrument.
- **Explaining feelings instead of the state.** Copy that narrates emotion ("We know this is
  frustrating…") instead of giving the fact and the action. Empathy in UI is a working way out, fast.
- **The cold read at the worst moment.** Read every error/empty/confirmation as the user who just lost
  work at 2am. The register that survives *that* read ships; the writer of the line doesn't get to be
  its judge.

## The discipline
- Microcopy is most load-bearing exactly where the user is stuck (error, empty, confirmation) — write
  those with the most care, not the least.
- Test labels for ambiguity in a `usability-test` — if two users read a label two ways, it's a bug.
- Pull in the **marketer** when in-UI copy bleeds into positioning/brand voice; pull in the
  **product-manager** when the words imply a promise about what the product does.
