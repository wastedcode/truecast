---
name: hunt-vuln-classes
description: Use when auditing code that takes user or network input — hunt the OWASP web vuln classes by tracing untrusted input to a dangerous sink, and substantiate every finding input → sink → file:line + the concrete attack.
---
# Hunt the vuln classes — trace input → sink → file:line

You are the attacker, not a scanner. For each dangerous **sink**, find the **source** of untrusted input
that reaches it, and state the **concrete attack**. *If you can't trace it, it's a note, not a finding* —
never ship "XSS might be possible."

## The standing input-handling posture (verify these hold)
- **Injection (SQL/NoSQL/OS/LDAP) — parameterize, always.** Bind every *value* (`?` / named params); never
  string-concatenate request data into a query or shell. An interpolated identifier (table/column) must come
  from a code literal, never request data. OS commands: no shell string-building from input; use arg arrays.
- **XSS — escape by default; no raw-HTML sink.** Render through the framework's auto-escaping; avoid raw-HTML
  injection (`dangerouslySetInnerHTML`, `innerHTML`, `v-html`). Markdown/rich text goes through a
  **sanitizing** renderer, never raw HTML. Set a Content-Security-Policy as defense-in-depth.
- **SSRF — no user-controlled URL to a server-side fetcher** without an allowlist; block requests to internal
  ranges and cloud metadata endpoints (169.254.169.254). This is a top modern web risk.
- **Path traversal — encode + resolve by lookup.** Resolve entities by a registry/DB lookup, not by building
  filesystem paths from request strings (`../`); never `path.join(base, userInput)` unchecked.
- **Insecure deserialization — never deserialize untrusted data** into live objects (pickle, Java
  serialization, unsafe YAML). Use data-only formats and schema validation.
- **SSTI / eval — never feed request data into a template engine or `eval`/`exec`.**

## The hunt
1. **Enumerate the sinks** — query builders, command exec, HTML render, file ops, deserializers, redirects,
   outbound fetchers, template engines.
2. **Trace each sink back to a source** — does any untrusted input (request body/query/header/cookie, an
   uploaded file, a fetched page, **LLM/agent output**) reach it without validation/encoding in between?
3. **State the concrete attack** — the exact payload and what it does. That's a finding; grade it with
   `grade-and-remediate-risk`.

## The discipline
- **Semi-trusted content is input, not markup.** Content authored by an LLM/agent or fetched from an external
  page is a semi-trusted source even when the human is trusted — escape it, don't trust it.
- Scanners and SAST find candidates; **you confirm reachability.** A finding without a traced path from a
  real source is the false-positive that erodes trust — run it down or downgrade it to a note.
- Block only *real, exploitable* harm; document accepted risk. Drowning a team in unconfirmed findings is
  theatre (`grade-and-remediate-risk` is how you keep the signal high).
