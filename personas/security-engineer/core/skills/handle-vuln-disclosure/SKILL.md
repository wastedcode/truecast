---
name: handle-vuln-disclosure
description: Use when a vulnerability is reported from OUTSIDE the team (a security researcher, a user, a bug bounty, an embargoed upstream CVE) — triage it without shooting the messenger, drive coordinated disclosure on a clear timeline, and stand up the intake so reports have somewhere to land.
---
# Handle vulnerability disclosure — receive the report, don't shoot the messenger

A vulnerability found by an outsider is a **gift that arrives badly wrapped**: it's a real finding you didn't
have to pay to discover, delivered with the implicit threat that someone else may already have it. How you
*receive* it decides whether the next researcher reports it to you or drops it publicly. Coordinated
disclosure is its own discipline (ISO/IEC 29147 *receiving* and 30111 *handling*; Katie Moussouris's life's
work) — it is **not** the same as `respond-to-incident` (an active breach you detected) and not the same as
`hunt-vuln-classes` (a vuln you found yourself).

## When a report comes in
1. **Acknowledge fast, judge slowly.** A prompt "got it, we're looking" buys goodwill and time. Do **not** get
   defensive, threaten the reporter, or dismiss it before you've reproduced it — hostility toward researchers
   is how findings go straight to Twitter or to an attacker instead.
2. **Reproduce and scope it like your own finding** — input → sink → `file:line`, the concrete attack, the
   trust model it lives in. Then grade it (`grade-and-remediate-risk`). An external report is a *candidate*
   until you've confirmed reachability, same bar as any finding (no theatre, no auto-P0 on an unproven claim).
3. **Decide: is it also live?** If there's any sign it's being exploited, or a live credential/data is exposed
   *right now*, it's **both** a disclosure and an incident — branch to `respond-to-incident` to contain in
   parallel while you coordinate the fix. Triage that question first.

## Drive coordinated disclosure
- **Agree a timeline, in writing.** Industry norm is ~90 days to fix before public disclosure, accelerated if
  it's being actively exploited. Keep the reporter informed — silence is what makes researchers go public early.
- **Fix the root cause, then look for siblings.** The same bug class often recurs elsewhere; patch the reported
  instance and sweep for the pattern (`hunt-vuln-classes`).
- **Credit the reporter** (unless they decline) and, if you run a program, honor any bounty/safe-harbor terms.
  Reputation is the currency that keeps reports coming to you instead of around you.
- **Disclose what users need** to protect themselves — a security advisory / CVE for an affected dependency or
  product, with the fixed version and any workaround. Coordinate timing with any embargo.

## Stand up the intake (preparation)
- **A `security.txt` and a published disclosure policy** so a researcher knows *where* to send a report and
  *that they won't be sued for sending it* (safe harbor). No intake = reports land in a sales inbox, or nowhere.
- A defined triage owner and SLA so reports don't rot. Build this before you need it — the same "preparation"
  discipline as incident response.

## The discipline
- **The relationship is a control.** Treating researchers as adversaries shrinks your free vuln pipeline and
  raises the odds of a 0-day drop. Treat them as unpaid red-teamers.
- **Embargoed upstream CVEs** (a dependency maintainer privately warns you ahead of public release) are a
  disclosure event too: patch under embargo, ready your own advisory, coordinate with `secure-supply-chain`.
- Land the outcome durably (`write-the-security-verdict`): what was reported, the confirmed grade, the fix,
  the advisory, and the systemic guardrail so this class doesn't recur.
