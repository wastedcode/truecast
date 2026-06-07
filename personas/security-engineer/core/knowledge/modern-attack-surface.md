# Modern attack surface (2025–26) — AI/LLM, supply chain, secrets

The depth behind `secure-ai-systems`, `secure-supply-chain`, and `secrets-and-config-discipline`. These are
the fastest-moving surfaces; this is the current (2025–26) state.

## OWASP Top 10 for LLM Applications (2025)
The dedicated list for AI systems — distinct from the web Top 10.
- **LLM01 Prompt Injection** — #1 for the second edition. The model can't separate instructions from data in
  one channel. **Direct** (user input) and **indirect** (instructions hidden in content the model reads — a
  web page, RAG doc, email, file). **No complete fix exists**; even frontier models remain vulnerable after
  best-effort defenses → defense-in-depth is the only viable strategy.
- **LLM02 Sensitive Information Disclosure** — model leaks training data, secrets, or another user's context.
- **LLM03 Supply Chain** — poisoned models, datasets, plugins, or tool/MCP definitions.
- **LLM04 Data & Model Poisoning** — including **RAG/embedding poisoning**: malicious content injected into a
  vector store becomes retrieved "fact"; insufficient vector-store access control leaks across tenants.
- **LLM05 Improper Output Handling** — model output flowing unescaped into a sink (HTML/SQL/shell/tool) =
  injection. Treat model output as untrusted input.
- **LLM06 Excessive Agency** — excessive **functionality** (tools beyond task) + excessive **permissions**
  (over-privileged tool credentials) + excessive **autonomy** (high-impact actions, no human gate).
- **LLM07 System Prompt Leakage** (new in 2025) — assume the system prompt leaks; never put secrets or the
  sole authorization logic in it. It is not an access control.
- **LLM08 Vector & Embedding Weaknesses** · **LLM09 Misinformation** (renamed from "Overreliance" — the model
  generates/propagates false info) · **LLM10 Unbounded Consumption** (token/cost exhaustion = DoS + billing
  attack; rate-limit and cap).

**Tool / MCP poisoning** (2025): agents act on tool *descriptions*, not just code — a poisoned description in
the MCP layer can hijack behavior; the poison is in the description, not the code. Vet tool/MCP definitions
like dependencies.

**Defenses (all outside the model):** least-privilege tools + scoped credentials; human-in-the-loop on
high-impact/irreversible actions; input/output filtering and boundaries; sandboxed tool execution; monitoring,
audit logging, and hard limits on tokens/calls/cost. The control is never "a better prompt."

## Software supply chain (2025 reality)
- Supply-chain attacks **doubled in 2025**; global cost ~\$60B, projected \$138B by 2031. Sonatype counted
  450k+ new malicious packages in 2025 (cumulative >1.2M).
- **Landmark 2025 incidents:** the `qix` npm maintainer **phish** that pushed malicious updates to 18 popular
  libraries (`debug`, `chalk`, `ansi-regex`, …); **GhostAction** — a compromised GitHub Action modified to
  exfiltrate secrets. The fast-moving threat is **maintainer takeover / malicious package**, not just stale
  CVEs.
- **Controls:** pin + lock (lockfiles, version+hash pins, no floating `^`/`latest` for security-relevant
  deps); trusted/vetted registries + mirrors; verify build **provenance** (SLSA) and signatures (Sigstore);
  generate an **SBOM** for fast "are we affected?" answers; harden CI/CD (least-priv tokens, prefer OIDC over
  stored secrets, pin third-party Actions to a commit SHA). Watch for **typosquatting** and **dependency
  confusion**.
- **Grade by reachability**, not just presence — a vulnerable function nothing calls is a note, not a P0.
  Dumping every transitive CVE on a team is theatre.

## Secrets management (current practice)
- Never in repo / logs / client bundles. Use a secrets manager (Vault, cloud KMS/Secrets Manager); pre-commit
  secret scanning so they can't land.
- **CI/CD: OIDC federation** to mint short-lived runtime credentials beats long-lived stored secrets.
- Prefer **short-lived, least-scope** credentials; know how to rotate everything; a committed secret is
  **compromised — rotate it**, don't just delete the line.
- **Insecure defaults are fail-open bugs**: hardcoded fallback creds, debug-on, permissive CORS, disabled TLS
  verification. The default must be the secure setting.

## Shift-left without theatre (the failure mode to avoid)
Pushing security gates earlier fails when it dumps **low-fidelity, unconfirmed findings** on developers:
alert fatigue → "alert blindness" → real findings dismissed with the noise, or the gate bypassed entirely.
Effective practice = **high-fidelity signals** (confirmed reachability), automated triage/de-noising,
developer-friendly remediation, and reserving the *blocking* veto for real exploitable harm. The credibility
of the security function is itself a security control — spend it carefully.

## Cited sources
- OWASP Top 10 for LLM Applications 2025 (genai.owasp.org/llm-top-10/).
- Prompt injection has no complete fix / defense-in-depth — Obsidian, Lakera, arXiv reviews (2025–26).
- Supply-chain 2025 data + qix/GhostAction — Sonatype via Aikido (aikido.dev), Oligo Security.
- SLSA / SBOM / Sigstore — slsa.dev; OWASP supply-chain guidance.
- Secrets Management & OAuth2 Cheat Sheets — cheatsheetseries.owasp.org.
- Shift-left failure modes — Endor Labs "Shift Down"; developer-friction analyses (2025).
