# Threat modeling & security principles — reference

The depth behind `threat-model-the-change`, `map-the-trust-boundary`, `harden-by-default`,
`grade-and-remediate-risk`, and `respond-to-incident`. Read when a review needs structure.

## Shostack's four-question framework (the spine of threat modeling)
1. **What are we building?** — a data-flow diagram: actors, processes, data stores, data flows, and the
   **trust boundaries** they cross. You can't model what you can't draw.
2. **What can go wrong?** — enumerate threats systematically (STRIDE below) at each boundary.
3. **What are we going to do about it?** — for each: mitigate / accept / transfer / eliminate.
4. **Did we do a good job?** — coverage check; are mitigations actually present; are accepted risks recorded.
Time-box it (≈ an hour per feature). It's a thinking aid, not a deliverable to perfect. Most valuable
**before** the build. (Adam Shostack, *Threat Modeling: Designing for Security*.)

## STRIDE — the per-element threat prompt
| Letter | Threat | Property violated | Asks |
|---|---|---|---|
| **S** | Spoofing | Authentication | can someone impersonate a user/service? |
| **T** | Tampering | Integrity | can data be altered in transit / at rest / in request? |
| **R** | Repudiation | Non-repudiation | can an actor deny an action (no audit log)? |
| **I** | Information disclosure | Confidentiality | can data leak across a boundary (IDOR, over-fetch)? |
| **D** | Denial of service | Availability | can it be exhausted / made expensive? |
| **E** | Elevation of privilege | Authorization | can a low-priv actor gain high-priv capability? |

## Trust boundaries & deployment model
A trust boundary is where data/control crosses from a less-trusted zone to a more-trusted one. The
**deployment model decides what's in scope**:
- **Local / single-user / loopback** — reaching the port ≈ owning the box; classic web findings often out of
  model; focus on input→sink, data-loss, concurrency, secrets-on-disk.
- **Hosted / multi-tenant / public** — untrusted callers; authn/authz, tenant isolation, IDOR/CSRF, rate
  limits all in scope; broken access control is the top risk.
- **Re-run from scratch when the model flips** (local→hosted, loopback→public, private→open-source). The
  written trust model *is* the boundary until then.

## Saltzer & Schroeder principles (still bite)
Least privilege · fail-safe (default-deny) defaults · complete mediation (check every access to every object)
· economy of mechanism (simplicity is security) · open design / no security-through-obscurity (assume the
attacker has your source) · separation of privilege · least common mechanism · psychological acceptability
(secure must be usable, or it gets bypassed). Plus modern: **defense in depth**, **secure by design / secure
by default**.

## Risk grading (P0–P3)
Risk = **impact × likelihood** in *this* trust model — not raw CVSS.
- **P0** block: real, exploitable, high-impact (RCE, auth bypass, cross-tenant data, live committed secret in
  shared/public repo). A real P0 is a hard gate.
- **P1** fix-before-ship or accept with owner+deadline: exploitable, some precondition.
- **P2** fix soon: real weakness, lower impact / harder to exploit.
- **P3** note / hardening.
Block only real exploitable harm; a false P0 cries wolf and erodes the veto. De-noise (confirm reachability,
drop unsubstantiated) before reporting. *No traced path = a note, not a finding.*

## Detection, logging & "assume breach" (the defensive twin of finding bugs)
Prevention fails; OWASP **A09 Security Logging & Monitoring Failures** is Top 10 because an undetected breach
runs for months. The depth behind `review-detection-and-logging`.
- **Assume breach.** Design as if a control already failed; detection is a defense-in-depth *layer*, not an
  afterthought. The blast radius of an *undetected* compromise is unbounded in time.
- **Security-relevant audit events** (structured, queryable, retained): authn success **and** failure, authz
  denials, privilege/role changes, secret/key/password changes, admin actions, MFA + lockout events,
  high-impact/irreversible actions (money, deletes, exports, external sends), and **AI-agent tool calls +
  args**. Capture actor / source / target / time / outcome — this is STRIDE's **Repudiation** leg made real,
  and the raw material `respond-to-incident` needs to exist *before* the incident.
- **Don't leak into the log**: no tokens, passwords, full PII, or full bodies — redact at the boundary
  (over-logging is itself an information-disclosure finding).
- **Logs are evidence; alerts are detection.** For each modeled threat: what's the signal, the threshold, who
  gets paged? Cover credential stuffing / brute force, enumeration (403/404 spikes = IDOR-probe signature),
  anomalous egress, rate/quota breaches, anomalous agent behavior, impossible-travel sessions.
- **Tripwires / honeytokens / canaries** — cheap, near-zero-false-positive detection where prevention is
  uncertain (Thinkst Canary; "most defenders can't detect the attacker in their network" — Haroon Meer).
- Grade a missing audit trail by what it hides (`grade-and-remediate-risk`): usually P1/P2 (it doesn't *cause*
  the breach, it *conceals* it), P0 when regulatorily required or the sole control. Own the *requirement*; the
  logging *platform* is infrastructure's.

## Coordinated vulnerability disclosure (receiving outside reports)
The depth behind `handle-vuln-disclosure` — distinct from incident response (an active breach you detected)
and from hunting your own bugs.
- **ISO/IEC 29147** (vulnerability *disclosure* — how to **receive** reports) + **ISO/IEC 30111** (vulnerability
  *handling* — how to triage/fix internally). Katie Moussouris's framework; the basis of modern bug-bounty/VDP
  practice.
- **Don't shoot the messenger:** acknowledge fast, reproduce/grade like your own finding, never threaten the
  reporter — hostility sends the next finding to an attacker or to public disclosure instead of to you.
- **Coordinated timeline:** norm ~90 days to fix before public disclosure, accelerated if actively exploited;
  keep the reporter informed; credit them; honor bounty/safe-harbor terms.
- **Intake (preparation):** a published `security.txt` (RFC 9116) + disclosure policy with **safe harbor**, a
  triage owner, and an SLA — so reports land somewhere, not in a sales inbox. If a report is also live, branch
  to incident response in parallel. Embargoed upstream CVEs are a disclosure event too (coordinate with
  `secure-supply-chain`).

## NIST incident-response lifecycle (SP 800-61 Rev. 3, 2025)
Preparation → Detection & analysis → Containment, eradication & recovery → Post-incident review. Rev. 3 aligns
IR to the CSF 2.0 functions (Detect / Respond / Recover) and frames IR inside risk management. Core moves:
preserve evidence before changing things; contain without destroying evidence; eradicate the **root cause**
(not the symptom); recover clean and monitor; **blameless** postmortem that fixes the *system* (a guardrail)
not the person. A leaked secret is compromised on exposure — rotate, don't just delete.

## Cited authorities
- Adam Shostack — *Threat Modeling: Designing for Security*; the four-question framework
  (shostack.org/files/papers/The_Four_Question_Framework.pdf).
- Saltzer & Schroeder — *The Protection of Information in Computer Systems* (the design principles).
- OWASP Top 10:2021 (owasp.org/Top10) and the OWASP Cheat Sheet Series (cheatsheetseries.owasp.org).
- NIST SP 800-61 Rev. 3 (2025) — Incident Response Recommendations (csrc.nist.gov/pubs/sp/800/61/r3/final).
- Microsoft STRIDE (Kohnfelder & Garg).
- Katie Moussouris — coordinated vulnerability disclosure; ISO/IEC 29147 (disclosure) & 30111 (handling);
  RFC 9116 (`security.txt`).
- Haroon Meer / Thinkst — assume breach, honeytokens & canaries, detectability as a first-class control.
- OWASP A09 Security Logging & Monitoring Failures; OWASP Logging Cheat Sheet.
