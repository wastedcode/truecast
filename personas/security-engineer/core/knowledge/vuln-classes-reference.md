# Vulnerability classes reference — the OWASP web Top 10 and how each bites

The depth behind `hunt-vuln-classes`, `review-authn-authz`, and `cryptography-sanity-check`. Read when a
finding needs grounding. Source: OWASP Top 10:2021 (the current web baseline) + OWASP Cheat Sheet Series.

## OWASP Top 10:2021 (web) — in risk order
1. **A01 Broken Access Control** — the #1 risk; found in ~94% of tested apps, ~318k CWE occurrences. IDOR,
   missing function-level authz, privilege escalation, JWT/metadata tampering, CSRF (CWE-352), forced
   browsing, missing tenant scoping. *Fix:* deny-by-default, server-side checks at every object, ownership
   checks on every id, tenant-scoped queries. → `review-authn-authz`.
2. **A02 Cryptographic Failures** — sensitive data in the clear, weak/reversible password hashing, weak
   ciphers (ECB, unauthenticated CBC), nonce reuse, predictable randomness, disabled TLS verification. →
   `cryptography-sanity-check`.
3. **A03 Injection** — SQL/NoSQL/OS/LDAP injection **and XSS** (folded in here in 2021). Untrusted input
   reaching an interpreter. *Fix:* parameterize values; escape output; sanitizing renderer for rich text;
   arg-arrays not shell strings. → `hunt-vuln-classes`.
4. **A04 Insecure Design** — flaws that no amount of clean implementation fixes; missing threat modeling. →
   `secure-design-review`, `threat-model-the-change`.
5. **A05 Security Misconfiguration** — default creds, verbose errors, permissive CORS (`*`), open cloud
   buckets, unnecessary features enabled, missing hardening. → `secrets-and-config-discipline`,
   `harden-by-default`.
6. **A06 Vulnerable & Outdated Components** — known-vulnerable dependencies; the supply-chain surface. →
   `secure-supply-chain`.
7. **A07 Identification & Authentication Failures** — weak passwords/MFA, session fixation, credential
   stuffing, user enumeration, broken logout/rotation. → `review-authn-authz`.
8. **A08 Software & Data Integrity Failures** — insecure deserialization, unsigned updates, compromised
   CI/CD pipelines, untrusted plugins. → `secure-supply-chain`, `hunt-vuln-classes`.
9. **A09 Security Logging & Monitoring Failures** — can't detect or investigate a breach; no audit trail
   (repudiation), no alerting on abuse. → `review-detection-and-logging` (proactive review),
   `respond-to-incident` (uses the logs at incident time).
10. **A10 Server-Side Request Forgery (SSRF)** — server fetches a user-controlled URL; pivot to internal
    services and cloud metadata (169.254.169.254). *Fix:* allowlist + block internal ranges/metadata. →
    `hunt-vuln-classes`.

## The dangerous-sink catalog (where to look)
| Sink | Vuln | Safe pattern |
|---|---|---|
| SQL / query builder | SQLi | parameterized values; identifiers from code literals only |
| HTML render | XSS | framework auto-escape; sanitizing renderer for markdown; CSP |
| OS command / shell | command injection | arg arrays; no shell string-building from input |
| File path | path traversal | resolve by registry/DB lookup, not `path.join(base, input)` |
| Deserializer (pickle/Java/YAML) | RCE | never deserialize untrusted data; data-only formats + schema |
| Outbound fetch | SSRF | allowlist; block internal ranges + metadata endpoint |
| Template engine / eval | SSTI / RCE | never feed request data into templates or `eval`/`exec` |
| Redirect target | open redirect | allowlist destinations |

## Access-control specifics
- **IDOR**: `GET /resource/:id` must verify the subject may access *that* object — not merely that they're
  authenticated. The single most common breach class.
- **Function vs. object level**: check both — can this role call this endpoint, *and* may they touch this
  record / this tenant's data.
- **CSRF**: for cookie-based auth, require a CSRF token or `SameSite` cookies on state-changing requests.

## JWT / OAuth / OIDC pitfalls
- Reject `alg:none`; verify with a **server-chosen** algorithm (never trust the token header's `alg` to pick
  the verifier); validate `iss`, `aud`, `exp`, signature against the provider's keys.
- HMAC-signed JWTs with weak secrets are **offline-crackable** (Hashcat/John) — use high-entropy secrets or
  asymmetric keys.
- OIDC = authentication (validate the ID token); OAuth = API authorization. Use PKCE; validate `state` and
  `redirect_uri`; prefer short-lived, sender-constrained (mTLS / DPoP) tokens.

## Crypto misuse quick table
| Need | Right | Wrong |
|---|---|---|
| password storage | argon2id / bcrypt / scrypt | MD5/SHA-*, plaintext, reversible |
| encryption | AES-GCM / ChaCha20-Poly1305 (authenticated) | ECB, unauthenticated CBC |
| nonce/IV | unique per key | reused |
| randomness (tokens/keys) | CSPRNG (`crypto.randomBytes`, `secrets`) | `Math.random()` / `rand()` |
| secret comparison | constant-time equal | `==` |
| transport | TLS, verified certs | disabled cert verification |
