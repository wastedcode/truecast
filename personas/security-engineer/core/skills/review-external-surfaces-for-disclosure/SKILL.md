---
name: review-external-surfaces-for-disclosure
description: Use to scan everything an outsider can read — README, marketing copy, docs, public config, AND error messages, stack traces, debug pages, response headers, and logs — for leaked secrets, internal stack/architecture detail, or proprietary-pipeline disclosure.
---
# Review external surfaces for disclosure — what an outsider can read shouldn't tell them how to attack you (or how it works)

Two different surfaces leak two different things, and both are the security engineer's to catch:
1. **Authored copy** — README, marketing/landing copy, public docs, changelog, error-page text. The risk is
   **proprietary-pipeline / IP disclosure**: copy that says exactly *how it works* hands competitors your
   approach and hands attackers your stack to target. (Shared concern with **product-marketer** — they own the
   voice and the message; you own the *don't-leak-IP-or-attack-surface* requirement.)
2. **Machine-emitted output** — error messages, stack traces, debug pages, verbose API responses, response
   headers, and logs that reach an outside reader. The risk is **secret/stack leakage**: exceptions that print
   a connection string, a 500 page that dumps a stack trace and file paths, headers advertising exact framework
   versions, a log line with a token in it. This is OWASP **A09 (Security Logging & Monitoring Failures)** and
   the LLM **System-Prompt / Sensitive-Information-Disclosure** classes turned inside out — output, not input.

## What to scan, and for what
- **Secrets in output.** Grep error text, log statements, and API responses for keys, tokens, passwords,
  connection strings, internal hostnames/IPs, and PII. A secret in a log is a **committed secret** — treat it
  as compromised and rotate (`secrets-and-config-discipline`). Never log the credential, the raw request body,
  or the session token.
- **Stack/version fingerprinting.** Verbose error pages, stack traces, `X-Powered-By` / `Server` headers,
  default error templates, and debug endpoints reachable in prod tell an attacker your exact framework, version,
  and file layout — i.e. which CVEs to try. Outside-facing errors should be **generic** ("something went wrong,
  ref `<id>`"); the detail goes to the internal log, keyed by that id.
- **System-prompt / internal-instruction leakage** in AI features — assume it leaks; it must hold no secret and
  no sole authorization logic (`secure-ai-systems`).
- **Proprietary-pipeline / IP disclosure in copy.** Does the README/landing/docs name the internal stack,
  the algorithm, the vendor components, the data pipeline, the model, the infra topology? External copy should
  say **WHAT it does and the outcome** — *"proprietary ranking,"* *"runs on a secure cloud backend"* — and
  **never the HOW**: not the specific datastore, queue, model, library, or the step-by-step pipeline. Naming
  the stack is both a competitive leak and a free attack-surface map.

## The discipline
- **Distinguish leak from finding.** A fingerprint header is a low-grade hardening note; a connection string in
  a public error or an API key in a log is a P0/P1 — grade by what it actually exposes
  (`grade-and-remediate-risk`), don't theatre-flag every version string.
- **Coordinate the copy fix, don't rewrite the voice.** When marketing copy over-discloses, hand
  **product-marketer** the specific line + the WHAT/outcome reframe ("say *proprietary algorithm*, don't name
  the datastore") — you own the disclosure *requirement*, they own the wording.
- **This belongs in the verdict.** Add "external surfaces (copy + error/log output)" to the attack surface you
  record reviewed (`write-the-security-verdict`); it's an easy surface to skip and an easy one to leak from.
- **Re-scan when the deployment model flips to public/open-source** — internal-only assumptions evaporate and
  what was a harmless internal log is now an external disclosure (`map-the-trust-boundary`).
