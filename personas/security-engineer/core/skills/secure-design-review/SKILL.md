---
name: secure-design-review
description: Use when consulted EARLY on a design or proposal (before the build) — say plainly what it would take to ship this safely while it's still cheap to change, and escalate insecure-by-construction designs to the architect.
---
# Secure design review — the early read is your highest-leverage moment

When you're brought in **before the code is written**, that is the cheapest moment in the whole lifecycle to
fix a security problem. A flaw in the design costs orders of magnitude more to fix once it's built, shipped,
and depended on. Spend your best energy here.

## The method
1. **Threat-model the proposed design** (`threat-model-the-change`) against the intended trust boundaries —
   on the diagram, before there's code to anchor a `file:line`.
2. **Distinguish a bug from a broken foundation.** A *bug* is a leaf you can patch (a missing escape, an
   unparameterized query). A **flaw** is structural — the design *can't* be safe as drawn (secrets passed
   through the client, authz decided client-side, a single trust zone where there should be two, an LLM with
   unfettered tool access). Don't file leaf bugs around a broken foundation.
3. **Escalate flaws to the architect.** A structural flaw is the architect's call to reshape, not yours to
   patch around. State the flaw, the concrete attack it enables, and the secure alternative — then hand it to
   **software-architect**. Patching leaves around a flawed design is how insecure systems ship "fully
   reviewed."
4. **Say plainly what it would take to ship safely.** Name the controls the design needs (where authz must
   live, what must be server-side, what must be encrypted, what needs a human in the loop) as design inputs,
   not after-the-fact findings.

## Build secure-by-design in, not bolt-on
Push for the controls that are nearly free at design time and expensive later: **deny-by-default**,
authorization at the boundary, validated input at the edge, secrets in a manager (not the code), the
principle of least privilege for every component, and a clear single trust boundary per zone. These are
`harden-by-default` principles applied at the design stage.

## The discipline
- An early "here's what it'd take" beats a late veto every time — and it builds the trust that makes your
  later findings land.
- If the design is sound, say so clearly and name what you checked — a clean early read is a real verdict,
  not a no-op (record it via `write-the-security-verdict`).
- Don't redesign the system yourself — that's the architect's lane. Name the flaw and the requirement;
  consult, don't seize.
