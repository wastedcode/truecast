---
name: respond-to-incident
description: Use when a security incident is suspected or active (breach, leaked secret, active exploit, suspicious activity) — run the NIST lifecycle: contain, eradicate the root cause, recover, then a blameless postmortem.
---
# Respond to an incident — contain fast, fix the root cause, learn blamelessly

When something is actively wrong, the order matters and panic is the enemy. Follow the NIST incident-response
lifecycle (SP 800-61); the goal is to stop the bleeding, remove the cause, restore trust, and make the system
unable to fail this way again.

## The lifecycle
1. **Preparation** (before — the cheapest phase). Know your assets, have logging/alerting that can detect, and
   have a playbook so the response isn't improvised at 3am. Build this *before* you need it.
2. **Detection & analysis.** Confirm it's real and scope it: what was accessed, by whom, since when, what's the
   blast radius? Preserve evidence (logs, snapshots) *before* you change things — you can't analyze what you
   overwrote. Establish a clear timeline.
3. **Containment.** Stop it spreading without destroying evidence: rotate/revoke the compromised credential,
   isolate the affected system, disable the exploited path, block the attacker. Short-term contain now,
   then a durable fix. **A leaked secret is compromised the moment it's exposed — rotate it, don't just delete
   the line.**
4. **Eradication.** Remove the **root cause**, not just the symptom: patch the vulnerability, remove the
   malware/backdoor, close the misconfiguration, kill any persistence the attacker established. If you only
   removed the symptom, they're still in.
5. **Recovery.** Restore clean systems, verify they're healthy and not still compromised, monitor closely for
   recurrence. Coordinate with **infrastructure** on the restore/rollback mechanics — that's their lane.
6. **Post-incident review.** Within days, while it's fresh.

## The blameless postmortem
- **Fix the system, not the person.** Blame drives the truth underground; the next incident gets hidden. Assume
  everyone acted reasonably with the information they had — ask *how did the system let this happen?*, not *who
  screwed up?*
- **Drive to systemic causes.** A leaked key isn't "Bob pasted a secret" — it's "secrets can reach the repo and
  nothing stops them." The fix is a guardrail (pre-commit scanning, a secrets manager), not a scolding.
- **Output: a timeline, the root cause, concrete action items with owners, and the guardrail that makes this
  class of failure impossible (or loud) next time.** Feed it back into preparation.

## The discipline
- Containment can conflict with evidence — capture the evidence first where you can, but stopping active harm
  wins the tie.
- Communicate clearly to stakeholders (and, where legally required, disclose) — coordinate that, don't freelance.
- Land the verdict and the postmortem durably (`write-the-security-verdict`); an incident that teaches nothing
  durable will recur.
