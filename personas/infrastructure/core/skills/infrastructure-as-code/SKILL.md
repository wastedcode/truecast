---
name: infrastructure-as-code
description: Use when provisioning or changing infrastructure (cloud resources, clusters, networking, config) — define it as versioned, reviewed, reproducible code; fight drift; prefer immutable replace over hand-patching live boxes.
---
# Infrastructure as code — no snowflakes, no click-ops

Infrastructure you changed by hand in a console is a **snowflake**: undocumented, unreproducible, and a
mystery the next person (or the next incident) inherits. The standard is that your entire infrastructure is
**declared as code in version control** — the repo is the single source of truth for what *should* be running.

## The method
1. **Declare it, version it, review it.** Terraform / OpenTofu / Pulumi / CloudFormation / Helm — the tool
   matters less than: it's in git, it's code-reviewed like application code, and the desired state is the file,
   not the console.
2. **Plan before apply, always.** Generate the plan (the diff between desired and live), have a human read it,
   *then* apply. The plan is where you catch the "this will destroy and recreate the database" surprise.
   Separate plan and apply as distinct gated steps; auto-apply only what's genuinely safe.
3. **Remote, locked, encrypted state.** State lives in an encrypted remote backend with locking — never on a
   laptop, never in the repo. Two concurrent applies without a lock corrupt state.
4. **Secrets are injected, never committed.** No credentials in the IaC, the repo, or the plan output. Inject
   at runtime from a secret manager; the IaC references the secret, never contains it.
5. **Immutable over mutable.** Prefer replacing instances/images over patching live boxes (bake an image,
   deploy the new one, drain the old). Mutable in-place changes are how drift and "works on that one box"
   creep in.

## Fight drift
- **Drift = live infra ≠ the code.** It creeps in via console hotfixes, broken automation, partial applies,
  parallel tooling — and surfaces at the worst time, during the next apply.
- **Detect it on a schedule** (a periodic `plan` that alerts on any diff), so a manual console change is caught
  in hours, not discovered weeks later mid-deploy.
- **Remediate by code, not by re-doing it by hand** — fold the legitimate change into the IaC and re-apply;
  revert the illegitimate one. Either way the code becomes true again.
- **Scan the IaC** for misconfig (public buckets, missing encryption, over-broad IAM) in CI before apply.

## The discipline
- If a piece of infra exists only because someone clicked it once, it doesn't really exist — it'll be gone the
  day you need to rebuild and can't.
- Right-size: a tiny project doesn't need a multi-account Terraform mono-repo on day one — but even then,
  *write down* what's deployed and how, so it's reproducible (`right-size-reliability`).
- Tool note (2025–26): Terraform (BSL-licensed) vs OpenTofu (open-source, community-governed fork) have
  diverged at the feature level — pick deliberately per the project's licensing/governance needs.
