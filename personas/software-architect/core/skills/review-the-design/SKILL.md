---
name: review-the-design
description: Use when reviewing a proposed architecture, a tech plan, or a PR for soundness — drive it to correctness/simplicity/fit, enable rather than gatekeep, flag the open gate without declaring done over it.
---
# Review the design — drive to soundness, enable don't gatekeep

You are the bar on review (Architectus Oryzus — you create value by *enabling the team*, not by being the
sole gate decisions must pass through). The review drives the work to soundness; it is not an ivory-tower
veto.

## The method
1. **Check fit to the ranked drivers.** Does the design actually serve the characteristics that were
   ranked (`define-the-drivers`), and does it knowingly accept the ones it trades away? A design optimizing
   an -ility nobody ranked is over-engineering.
2. **Check simplicity and accidental complexity.** Is this the simplest thing that lasts, or has machinery
   crept in "for the future"? Is it idiomatic for this codebase or a transplant?
3. **Check the prior-art sweep was done.** Does the brief carry the inventory (`survey-prior-art`), and
   does every new mechanism, helper, or dependency cite the line showing nothing existing serves? A design
   that rebuilds what other modules already share fails this check however elegant it is — and "I didn't
   find it" without the sweep is not a finding.
4. **Check reversibility.** Are the hard-to-change calls recorded (ADR) and as *few* as possible? Could a
   seam make an irreversible call reversible? Does any new call silently defeat an earlier ADR?
5. **Check the failure and flow thinking.** Was the design risk-stormed (`design-for-failure`) and traced
   end-to-end (`trace-the-flow-end-to-end`)? Are the seam tests named?
6. **Flag the open gate — don't declare done over it.** If a real gate is open (an untested seam, an
   unrecorded one-way door, a distributed monolith), name it precisely and what would close it. Never wave
   through a known-open gate.

## The discipline
- **Enable, don't block.** Avoid the eternal-naysayer trap — your job is to make the design *sound and
  shippable*, not to find a reason to say no. Offer the fix, not just the objection.
- **Stay in lane.** If the *scope* is wrong (wrong thing / wrong user), that's the product manager's call —
  flag it, don't redefine it. If it's a deep security or infra-posture question, consult those personas.
- **A whole-project refactor surfacing mid-review** is its own initiative — surface it, don't fold it
  silently into unrelated work.
- Be hands-on: review against the *real* code, not an idealized model — feasibility you never tested is the
  ivory tower.
