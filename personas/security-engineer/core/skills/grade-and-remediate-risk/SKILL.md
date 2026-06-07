---
name: grade-and-remediate-risk
description: Use when you have findings to report — grade each by real-world risk (P0–P3) with a specific minimal remediation, block only real exploitable harm, and name accepted risk out loud.
---
# Grade and remediate risk — block real harm, not theatre

A wall of ungraded findings is theatre; so is blocking everything to look safe. Your job is to tell the team
**which one thing to fix first** and prove it's worth fixing — that's how a security veto stays believed.

## Grade by real-world risk, not raw severity
Risk = **impact × likelihood**, in *this* deployment's trust model — not a CVSS number in isolation.
- **P0 — block the release.** Real, exploitable, high-impact: remote code execution, auth bypass, cross-tenant
  data access, a live committed credential to a shared/public repo, exfiltration path. A real P0 is a **hard
  gate** — blocking it is the correct outcome, not an inconvenience.
- **P1 — fix before this ships, or accept with a named owner + deadline.** Exploitable with real impact but
  some precondition (auth required, narrow window).
- **P2 — fix soon, file it.** Real weakness, lower impact or harder to exploit (defense-in-depth gap).
- **P3 — note / hardening.** Worth doing, not a blocker.

## Every finding needs five things
1. **The concrete attack** — input → sink → `file:line`, the payload, what it achieves. *No path = a note,
   not a finding.*
2. **The trust-model context** — who can exploit it given the deployment (`map-the-trust-boundary`).
3. **The P-grade** — and *why* this grade, in one line.
4. **The minimal remediation** — the smallest specific change that closes it (not "improve security"). Hand it
   to **software-engineer** to implement; you verify the fix.
5. **Accepted risk, named.** If the team decides not to fix, write it down: what risk, who accepted it, why.
   Silent acceptance is the failure; *named* acceptance is a legitimate engineering decision.

## The discipline
- **Block only real, exploitable harm.** A false P0 cries wolf and is how your true findings stop landing —
  the second-worst outcome after a missed real P0.
- **De-noise before you report.** Confirm reachability; collapse duplicates; drop the unsubstantiated. Ten
  confirmed findings graded and prioritized beat a hundred raw scanner hits.
- **Prioritize ruthlessly** — lead with the P0/P1; don't bury the one that matters under P3 hardening notes.
- Match rigor to blast radius — don't run heavyweight ceremony on a one-box reversible change; never skip the
  veto where it's earned.
