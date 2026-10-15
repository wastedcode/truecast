---
name: beat-the-frontier
description: Use before any substantive security review, threat model or verdict, and as the last pass before handing it over — your version of the engine's "beat the frontier" loop. Name who does offensive and defensive security best today, set the bar above them, cover every known attack class for this surface, reproduce every finding, fold break attempts into the test suite, and critique the work as those researchers would until nothing material is left.
---
# Beat the frontier — security

A scan is the floor. The bar is **the best security researchers and audit teams working today, and past
them**. The user should never have to come back with "what about things I didn't cover?", "did you try to
break it?" or "is that even exploitable?". Every one of those is a pass you could have run first.
Autonomous agents already find real bugs at scale (Big Sleep, XBOW, 2025). You can trace every input,
check every attack class and verify every finding. So do it.

## 1. Name the frontier (seeds as of 2026-10; search for who's leading now before you rely on them)
| Kind of work | Who sets the bar | Look at |
|---|---|---|
| Vulnerability research | Google Project Zero; DeepMind Big Sleep | Big Sleep's 2025 autonomous finds (FFmpeg, ImageMagick) |
| Autonomous offensive testing | XBOW | its 2025 HackerOne run and write-ups |
| Audits + static analysis | Trail of Bits | public audit reports; Semgrep/CodeQL rules |
| Web attack classes | James Kettle / PortSwigger Research | request smuggling, race-condition research |
| Startup baselines + crypto | Latacora (Ptacek); Filippo Valsorda | "cryptographic right answers"; age, Go crypto |
| The canon | Ross Anderson | *Security Engineering* |
Cover every leader relevant to *this* surface, read their most relevant recent work, and write down the specific
moves you're taking.

## 2. What their work does that competent work doesn't
- A threat model specific to this system: assets, trust boundaries, attacker capabilities.
- Taint traced from real input to the dangerous sink, with a working PoC at `file:line`. Not a scanner
  dump.
- Severity graded by exploitability × blast radius, not CVSS theatre.
- Variant analysis: one bug becomes a query that finds all its siblings.
- Fixes that remove the bug class (parameterized APIs, safe-by-default wrappers), not one instance.
- Supply chain pinned and attested; secrets and internal stack kept out of logs, errors and public copy.

## 3. Table stakes: the canon you already exceed
Anderson, *Security Engineering* · OWASP ASVS / Top 10 · Shostack, *Threat Modeling* · NIST SSDF ·
Google, *Building Secure and Reliable Systems*. Meeting these gets you in the door. It isn't the bar.

## 4. Where you go past them
- **The composite, first:** one deliverable that carries the signature move of *every* leader in §1 at
  once — something none of them could produce alone — and then the coverage below, which none of them can
  afford. Beating any one of them is a miss.
- Check **every** known attack class for this surface (§5), not a sample.
- Trace **every** entry point to its sinks. Run variant analysis across the **whole** repo, not just the
  diff.
- Audit **every** dependency, config and error path for disclosure.
- Reproduce **every** finding before it's reported. Maintainers now drown in hallucinated AI bug reports;
  never add to that.

## 5. The asks to pre-empt (do these before anyone asks)
- **Every known attack class for this surface**, enumerated and checked. Examples: injection, authz/IDOR,
  SSRF, deserialization, request smuggling, races/TOCTOU, replay. For money or contracts: reentrancy,
  rounding/decimals, odd token behaviours, fee-on-transfer, price manipulation, and the incident record of
  the past several years. For crypto: nonce reuse, downgrade, key handling.
- **Try to break it, then keep the attempts.** Every break attempt becomes a regression test in the suite
  (`harden-by-default`), so the next change is checked too. Nothing is deferred.
- **Execute, don't reason.** Run the exploit on a local fork, testnet or staging copy. A PoC you reproduced
  beats an argument.
- **Blast radius of destructive or shared-credential operations** (`map-the-trust-boundary`): what one
  leaked key or one bad delete can reach.
- **Nothing internal leaks:** secrets, stack details and internal field names stay out of logs, errors,
  docs and marketing (`review-external-surfaces-for-disclosure`).
- **One clear verdict** (`write-the-security-verdict`): GO/NO-GO, the exploitable findings, accepted risk
  named. Plain words, short.

## 6. The critique pass: be the researcher you named
Review it the way they would. What would Project Zero find in the input you didn't trace? What variant
would Trail of Bits' query turn up? What new attack class would Kettle try on this protocol? Then run
`threat-model-the-change`, `hunt-vuln-classes` and `grade-and-remediate-risk`. Fix, re-test, and repeat
until a pass finds nothing material.

## 7. The Frontier check (end of the deliverable, ≤6 lines)
- **Benchmark:** every leading exemplars you held it against (named, linked).
- **Where this beats each of them:** concretely, one line per leader.
- **Covered:** the founder's constraints, plus the attack classes and pre-empted asks above (say which are N/A and why).
- **Critique caught:** what the last passes found and you fixed.
- **Verified:** PoCs reproduced, break attempts added to the suite, variants swept.
