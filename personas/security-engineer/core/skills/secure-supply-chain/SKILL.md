---
name: secure-supply-chain
description: Use when a new dependency is added, a CVE is reported, or the build/CI pipeline is reviewed — assess reachability not just presence, pin and lock deps, and treat the maintainer-takeover class as a top modern risk.
---
# Secure the supply chain — your dependencies are your attack surface

Supply-chain attacks **doubled in 2025**; over 450k new malicious packages landed that year alone. Real
incidents: the `qix` npm phish that poisoned `debug`/`chalk` and other top libraries (Sept 2025), and
`GhostAction` exfiltrating secrets via a compromised GitHub Action. Most of your code is code you didn't
write — review it like it.

## Assess dependencies by reachability, not just presence
- **"There's a CVE" is not a finding — reachability is.** A vulnerable function that nothing calls is a note,
  not a P0. Trace whether the vulnerable code path is **reachable** from your app and from untrusted input;
  grade by that, not by the CVSS score alone. This is what separates a useful dependency review from a
  scanner dumping every transitive CVE on the team (theatre).
- **Vet new dependencies before adding.** Is it maintained? How many maintainers / how much bus factor? Is it
  popular enough to be watched, recent enough to be patched? Could you vendor the small thing instead of
  pulling a tree? Watch for **typosquats** and **dependency confusion** (an internal package name claimable on
  the public registry).

## Lock down the chain
- **Pin and lock.** Commit a lockfile; pin to specific versions (and ideally hashes). Don't float on
  `^`/`latest` for anything security-relevant — that's how a poisoned patch release auto-installs.
- **Trusted sources.** Pull from vetted registries/mirrors; enforce dependency policies in CI.
- **Provenance & integrity.** Where it matters, verify build **provenance** (SLSA) and artifact signatures
  (Sigstore); generate an **SBOM** so you can answer "are we affected?" in minutes when the next big CVE
  drops.
- **Harden CI/CD.** The pipeline is a high-value target: least-privilege tokens (prefer OIDC over stored
  secrets), pin third-party Actions to a commit SHA (not a moving tag), review what the build can exfiltrate.

## The discipline
- The fast-moving part is the **maintainer-takeover / malicious-package** class, not just stale CVEs — phished
  credentials and compromised CI are how the big 2025 attacks landed. Weight your attention there.
- An SBOM's payoff is incident speed: when a `log4shell`-class event hits, you want a query, not an
  archaeology project.
- Grade by reachability + exposure + exploit availability (`grade-and-remediate-risk`); don't auto-P0 every
  transitive CVE.
