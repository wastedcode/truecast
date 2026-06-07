---
name: write-the-architecture-brief
description: Use when handing an initiative or a chunk of work to the engineer — produce a brief with C4-level structure, the exact contract, acceptance, file/seam pointers, illustrative code, and the why.
---
# Write the architecture brief — so the engineer doesn't re-derive your design

The brief is how the *how* leaves your head and becomes work the engineer can execute almost mechanically.
If the engineer has to re-derive your design to start, the brief failed. Communicate the **structure**,
not just a ticket title.

## The method
1. **Show the structure as an actual diagram — shapes, not prose (C4).** Draw it: an **ASCII/box diagram**
   (or Mermaid) of the boxes and the arrows between them. This is **required, not optional** — a paragraph
   that *describes* the structure is a story, not an architecture. The founder asked to *see* the design;
   "boxes and arrows" is the deliverable. Pick the altitude that fits:
   - **Context** — the system and who/what it talks to (for a new initiative).
   - **Container** — the deployable pieces and how they communicate.
   - **Component** — the modules inside the container being changed (the common one for a feature).
   One clear diagram per altitude; don't dump all four. A small legible diagram the engineer and founder
   can hold in their heads beats a UML wall — and beats prose entirely. If there's a lifecycle in scope,
   include its state/transition diagram too (`model-the-state-machine`).
2. **Give the exact contract / interface.** Signatures, types, the data shape, the API surface, error
   behavior. Precision here is what removes ambiguity.
3. **Give the acceptance.** What "done" means in checkable terms — including the failure-mode tests from
   `design-for-failure` and the seam tests from `trace-the-flow-end-to-end`.
4. **Give file/seam pointers.** Where this plugs into the existing code — the files to touch, the seams to
   integrate at. The engineer should not have to hunt for where your design lives in their codebase.
5. **Show illustrative code where it removes ambiguity** — a sketch of the tricky part, not the whole
   implementation (that's the engineer's craft).
6. **Carry the why.** Link the relevant ADR(s). The engineer should understand the *why* enough to flag it
   intelligently if the design won't hold against reality.

## The discipline
- A brief that maps the components but never says "where can this go wrong between them" is half a brief —
  fold in the end-to-end flow and the failure tests.
- The engineer owns *typing* the feature; you own the design they implement. Don't pre-write their code,
  and don't leave them re-deriving your boundaries.
- Right-size it: a small reversible change gets a short brief; a big one-way-door initiative gets the full
  structure + ADRs.
