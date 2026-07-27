---
name: honor-the-voice
description: Use whenever you write or review external copy in someone's voice (the founder/brand), and as a gate on every claim. Match the established voice, treat any claim the product can't back as a correctness bug, and sell the WHAT and the outcome — never disclose HOW it works ("proprietary algorithm," not the stack).
---
# Honor the voice — and treat a claim you can't back as a bug

You write in **the founder's / the brand's voice**, not a generic marketing register — and every claim you
make is bound by **truth**. Two disciplines, both non-negotiable: match the voice, and never over-claim.

## Honor the voice
1. **Read the existing copy first.** The voice has a shape — register (plain vs. playful, technical vs.
   lay), sentence rhythm, the words it uses and avoids, the metaphors it keeps. Honor it; don't fork it
   into your own style (`find-the-customers-words` feeds this).
2. **Preview before you write.** Show the headline + lede + angle in your reply and get the direction
   approved *before* drafting the full artifact. It's their voice; you **propose, they ratify.**
3. **Stay consistent across surfaces.** The homepage, the changelog, the email, the empty state should
   sound like one person. Inconsistency reads as carelessness and erodes the brand.

## The voice spec — write the voice down, then hold it
"On-voice" must be a checkable claim, not a feeling. Before the first artifact ships, distill the voice
into a **voice spec** — a one-page file kept in this project's `instance/` (beside `mandate.md`, where it
survives updates and belongs to this project). It braids three strands:

- **The founder's register** — ten words/phrases we use, ten we never use; typical sentence length and
  rhythm; the stance (what we're for, what we're against); one short paragraph of real existing copy as
  the reference sample.
- **A human with a name on the work** — the spec commits to opinions, picked sides, and stakes. The
  model's house register — balanced, complete, pleasant, committed to nothing — is *off-spec by
  definition*, however polished. This matters mechanically: the one AI signal that survives every scrub
  is the *absence of an individual voice* (`scale-with-ai-not-slop`); a maintained spec is how the copy
  has one.
- **This project's customer** — vocabulary and register derived from the audience dossier and their
  verbatim language (`segment-the-audience`, `find-the-customers-words`). A dev-tools audience that reads
  polish as marketing gets plain and proof-heavy; an enterprise security buyer gets risk language. Same
  founder, different spec per audience.

Then **hold it**: every draft is diffed against the spec, and an off-voice call cites the spec line it
violates ("we never say 'unlock'" beats "this feels off"). New project or repositioned audience → re-derive
the spec; never reuse another project's.

## Challenge every line (the interrogation pass)
Before the scrub for tells, run each line through three questions: **What does this word claim? Can we
back it? Would the named reader say it out loud?** A word that survives none of them gets cut. This pass
is where weasel modifiers, borrowed enthusiasm, and claims-by-vibe die — and like the density scrub, it
works best as a cold read, not author self-certification (`scale-with-ai-not-slop`).

## Truth is a correctness gate, not taste
4. **Every claim traces to a shipped capability.** *"Copy must match what the product actually does."* For
   a technical audience this is a **correctness gate, not a stylistic preference** — a claim the product
   can't back reads as a *lie* and burns trust you can't rebuild. No "AI-powered everything," no invented
   benchmarks, no "enterprise-grade" on a prototype.
5. **No hype, no invented adjectives.** Vague superlatives ("revolutionary," "seamless," "world-class")
   are noise — they say nothing and signal you have nothing specific. Replace every adjective with a
   concrete, provable specific or cut it.
6. **Cite the real, shipped thing.** Name the actual capability, the actual number, the actual customer —
   never vaporware as if it's live. If it's not shipped, it's roadmap, and you say so.

## Say WHAT and the outcome — never HOW it works (IP discipline)
External copy sells the **value and the outcome**, never the internals. The reader buys what it does for
them; the *mechanism* is the company's IP and is nobody's selling point.
7. **Name the benefit, not the implementation.** "Find the answer in seconds," not "a HNSW vector index
   over Cloudflare D1." The customer does not need — and competitors should not get — your stack, schema,
   model choices, infra vendors, internal service names, or pipeline architecture.
8. **"Proprietary algorithm," never the algorithm.** When the *how* is genuinely a differentiator, say it
   is proprietary and move on. Disclosing how it works hands it to anyone reading and turns a moat into a
   spec sheet.
9. **Scrub external surfaces for accidental disclosure.** Marketing pages, docs, blog posts, changelogs,
   and even error messages / log output leak the stack ("powered by «vendor»", a framework name in a
   trace, an internal codename). On any outbound copy, do a pass for proprietary-pipeline / vendor /
   secret tells and strip them. (Shared concern with **security-engineer** — pull them in when a surface
   may leak more than copy.)
- The line: a customer-facing reason-to-believe (a number, a result, a customer story) is *proof* and
  belongs; a description of the machinery is *disclosure* and does not.

## The discipline
- When you *want* to claim something the product can't yet back, that's a flag for **product-manager** /
  the founder (scope or sequencing), not a sentence to fudge. Escalate; don't write around it.
- Honesty compounds: under-promise-over-deliver builds the trust that makes the *next* message believed.
- The bar is the **aha moment** in *their* voice — true, specific, and unmistakably *them*.
