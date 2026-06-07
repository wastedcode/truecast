---
name: secure-ai-systems
description: Use when reviewing an LLM feature, AI agent, RAG system, or tool/MCP integration — treat the OWASP LLM Top 10 as its own attack class: prompt injection, excessive agency, tool poisoning, system-prompt leakage.
---
# Secure AI systems — the LLM is a new, unsolved attack surface

AI features bring attack classes that classic web security doesn't cover, and **prompt injection has no
complete fix** — even frontier models remain vulnerable after best-effort defenses. So **defense-in-depth is
the only viable strategy**, and the security control is *outside* the model: in the permissions, the
boundaries, and the human-in-the-loop. (OWASP Top 10 for LLM Applications, 2025.)

## The attack classes that matter
- **Prompt injection (LLM01).** The model can't reliably separate instructions from data; untrusted content
  (a user message, a fetched web page, a RAG document, an email being summarized) can carry instructions the
  model obeys. Treat **all model-reachable content as untrusted input**. Direct (user) and **indirect**
  (content the model reads) both count — indirect is the sneaky one.
- **Excessive agency (LLM06).** The dangerous trio: excessive **functionality** (tools beyond the task),
  excessive **permissions** (tools with broader privilege than needed), excessive **autonomy** (high-impact
  actions with no human gate). Scope the tools, scope their credentials, gate the irreversible actions.
- **Tool / MCP poisoning.** Agents act on **tool descriptions**, not just code — a malicious description can
  hijack behavior. Vet tool/MCP definitions like dependencies (`secure-supply-chain`); pin and review them.
- **System-prompt leakage (LLM07).** Assume the system prompt *will* leak — never put secrets, credentials, or
  the only line of authorization in it. It's not an access control.
- **Sensitive-data disclosure & RAG poisoning.** Vector stores need access control and tenant isolation;
  poisoned documents become retrieved "facts." **Unbounded consumption** — token/cost exhaustion — is a DoS
  and a billing attack; rate-limit and cap.
- **Output handling.** Model output flowing into a sink (HTML, SQL, a shell, a downstream tool) is **untrusted
  input** — escape/validate it exactly like user input (`hunt-vuln-classes`).

## The defenses (layered, outside the model)
1. **Least-privilege tools + scoped credentials** — the agent can only reach what its task needs; its tokens
   carry its own (minimal) authz, not a human's broad one (`review-authn-authz`).
2. **Human-in-the-loop on high-impact / irreversible actions** — money, deletes, prod changes, external sends.
   Autonomy is earned by reversibility.
3. **Input/output filtering and boundaries** — separate untrusted content from instructions where you can;
   validate and constrain tool inputs/outputs; sandbox tool execution.
4. **Monitoring & limits** — log agent actions for audit/repudiation; cap tokens, calls, and cost.

## The discipline
- The fix for prompt injection is **not a better prompt** — it's least privilege + a human gate on what the
  model can actually *do*. Design assuming the model will be tricked.
- Grade an AI finding by what the model can reach with its current tools/permissions — an injectable model with
  no dangerous tools is lower risk than one wired to send email and move money (`grade-and-remediate-risk`).
