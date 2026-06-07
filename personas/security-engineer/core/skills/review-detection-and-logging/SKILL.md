---
name: review-detection-and-logging
description: Use when reviewing a change, a design, or a system's readiness — ask "if this gets attacked or exploited in prod, would we even know?" Review the audit trail, the security-relevant logging, and the detection/alerting on abuse, then assume breach.
---
# Review detection & logging — if it's exploited, would you even know?

Prevention fails. The question every serious defender asks that a checklist never does: **when this is
attacked — not if — will anyone see it?** Most teams cannot detect an attacker in their own system; OWASP
ranks Security Logging & Monitoring Failures (A09) in the Top 10 precisely because a breach you can't see is a
breach that runs for months. A control you can't observe failing is not a control you can trust.

This is the **defensive twin** of `hunt-vuln-classes`: that skill asks "can it be broken?"; this one asks
"and if it is, can we tell?" Both are core security craft — a review that only finds bugs and never checks
detectability is half a review.

## Assume breach — design as if a control already failed
- **Defense fails; instrumentation is the backstop.** Least-privilege, input validation, and authz will be
  bypassed somewhere. Assume one already was, and ask what would catch it: an audit trail, an anomaly, a
  tripwire. Defense-in-depth (`harden-by-default`) includes *detection* as a layer, not just prevention.
- **The blast radius of an undetected compromise is unbounded in time.** A detected breach is contained in
  hours; an undetected one is exfiltrating for months. Detectability is a risk multiplier — weight it.

## What a security-relevant audit trail must capture
- **The security-decision events**, structured and queryable: authentication (success *and* failure), authz
  denials, privilege changes, password/secret/key changes, admin actions, account lockouts, MFA events,
  high-impact or irreversible actions (money, deletes, exports, external sends), and — for AI systems — **agent
  tool calls and their arguments** (`secure-ai-systems`).
- **Enough to reconstruct who-did-what-when**: actor identity, source, target object, timestamp, outcome. This
  is the **Repudiation** leg of STRIDE made concrete — without it, you can neither investigate nor prove what
  happened (`respond-to-incident` depends entirely on logs that already exist).
- **Without leaking the very secrets you're protecting.** Logs are a sink: no tokens, passwords, full PII, or
  full request bodies in them (`secrets-and-config-discipline`). Redact at the logging boundary. An over-logging
  bug is an information-disclosure finding in its own right.

## Detection & alerting — logs no one reads are theatre
- **Logs are evidence; alerts are detection.** Capturing a failed-auth flood that nobody is alerted on detects
  nothing. For the threats the model surfaced (`threat-model-the-change`), ask: what's the signal, what's the
  threshold, who/what gets paged?
- **Cover the abuse patterns**: credential stuffing / brute force (failed-auth rate), enumeration (404/403
  spikes on object ids — the IDOR-probe signature), unusual data egress / over-fetch, rate-limit and quota
  breaches, anomalous agent/tool behavior, new-or-impossible-travel sessions.
- **Tripwires and honeytokens** are cheap, high-signal detection: a fake credential, a canary record, a
  honeypot endpoint that should *never* be touched — any hit is a near-certain intrusion with near-zero false
  positives. Recommend them where prevention is uncertain.

## The discipline
- Match it to the trust model (`map-the-trust-boundary`): a local single-user tool needs little; a
  multi-tenant or money-moving or agentic system needs a real audit trail and live alerting. A missing audit
  trail on a high-impact action is a real finding — grade it (`grade-and-remediate-risk`), usually P1/P2
  (it doesn't *cause* the breach, it *hides* it), escalating to P0 when it's regulatorily required or when no
  other control exists.
- This is **preparation for incident response** done before the incident — the logs and alerts you wish you had
  at 3am must be built now, not improvised then (`respond-to-incident`).
- Don't own the logging *platform* or pipeline (that's infrastructure) — own the *security requirement*: what
  must be captured, what must be alerted, what must never be logged.
