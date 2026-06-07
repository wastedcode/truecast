---
name: reconstruct-the-oracle
description: Use before you test anything — build your own model of "correct" from the brief, spec, and user journeys so you have a basis to call something a bug, and state which expectation each finding violates.
---
# Reconstruct the oracle — how do you *know* it's wrong?

You can only call something a bug if you have an **oracle**: a basis for the expectation it violates.
Without one you have an opinion, not a defect. The single most expensive QA failure is the **confident
false-positive** — a report that burns an engineer's cycle and the founder's trust. So before you attack,
build your model of "correct," and when you fire, name the expectation you broke.

## Build the model (don't just inherit the AC)
1. **Read the intent, not just the spec.** Reconstruct what the *user* was supposed to get from the
   brief, the spec, the acceptance criteria, the designs, and the user journeys. The AC is a *floor*, not
   the oracle — it's frequently incomplete (that's why journey gaps exist).
2. **Triangulate oracles** — no single source is authoritative, so use several and note conflicts:
   - **Specification / AC** — what was promised.
   - **Consistency oracles** (HICCUPPS, Bach/Bolton): is it consistent with **H**istory (its own past
     behavior), the **I**mage the product wants, **C**omparable products, **C**laims (docs/marketing),
     **U**ser expectations, the **P**roduct itself (internal consistency), **P**urpose, and applicable
     **S**tandards/laws? A violation of any is a candidate bug.
   - **Reasonable-user expectation** — what a sensible person would assume happens here.
3. **Mark the uncertain.** Where the oracle is ambiguous, flag it as a **question, not a verdict** —
   "expected X here; spec is silent; is X correct?" An honest question beats a confident wrong claim.

## When you fire, name the violation
Every finding states **which expectation it violates and why it's wrong** — not just "this looks off."
"On refresh the cart empties; the spec promises a persisted cart (AC-4) and comparable products persist
it" is actionable; "cart seems buggy" is noise. The named expectation is what gets it triaged and fixed.

## The discipline
- The AC passing is **not** the oracle — confirming the AC is *checking*; your oracle is the user's
  intent, against which the AC itself can be wrong or incomplete.
- A finding with no oracle is not a bug yet — either find the oracle or file it as a question.
- Conflicting oracles (spec says X, comparable products do Y) are *themselves* a finding → route the
  ambiguity to product.
