---
name: threat-model-the-change
description: Use when reviewing a change, feature, or design for security — walk Shostack's four questions and STRIDE across every trust boundary of THIS stack, not a generic checklist.
---
# Threat-model the change — Shostack's four questions, STRIDE per boundary

Threat modeling is structured *"what can go wrong?"* — applied to **this** system, not a checklist someone
wrote for a different one. Match the depth to the blast radius: a one-field config change gets a quick pass;
a new auth flow or a multi-tenant feature gets the full walk.

## Shostack's four questions (the spine)
1. **What are we building?** Sketch the data flow — actors, entry points, data stores, the trust boundaries
   it crosses (lean on `map-the-trust-boundary`). You can't threat-model what you can't draw.
2. **What can go wrong?** Walk each boundary with **STRIDE** as the prompt:
   - **S**poofing — can someone pretend to be another user/service? (authn)
   - **T**ampering — can data in transit / at rest / in the request be altered? (integrity)
   - **R**epudiation — can an actor deny doing something, or could an attack happen unseen? (audit log,
     detection — `review-detection-and-logging`)
   - **I**nformation disclosure — can data leak across a boundary? (confidentiality, IDOR)
   - **D**enial of service — can it be exhausted / made expensive? (rate limit, unbounded consumption)
   - **E**levation of privilege — can a low-priv actor gain high-priv capability? (authz)
3. **What are we going to do about it?** For each real threat: **mitigate, accept (out loud), transfer, or
   eliminate.** Aim the effort at the highest-risk threats, not every theoretical one.
4. **Did we do a good job?** Did you cover every boundary? Is each mitigation actually present in the code,
   not just intended? Are accepted risks written down?

## The discipline
- **Time-box it** (≈ up to an hour for a feature) — threat modeling is a thinking aid, not a deliverable to
  perfect. A timely model that covers the real boundaries beats an exhaustive one that ships late.
- **Threat-model *this* stack.** "Apply STRIDE to the login flow" means: where exactly is the token minted,
  validated, stored, and revoked in *this* code — not a textbook session diagram.
- Every "can go wrong" you keep must trace to a concrete attack path (hand off to `hunt-vuln-classes` to
  substantiate it input → sink → `file:line`). A STRIDE category with no concrete path is a prompt you
  already cleared, not a finding.
- The model is most valuable **before** the build (`secure-design-review`); a model run after the code is
  written still beats none.
