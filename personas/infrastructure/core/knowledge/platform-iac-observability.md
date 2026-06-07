# Platform, IaC, observability & cost — reference

The depth behind `infrastructure-as-code`, `observability-that-pages-on-symptoms`, `tame-cloud-cost`, and
`pave-the-golden-path`. Modern (2025–26) practice, with sources.

## Infrastructure as Code
- **The repo is the source of truth.** Entire infra declared as code, version-controlled, code-reviewed; the
  desired state is the file, not the console. The console is for *reading*, not *changing*.
- **The non-negotiables** (per modern IaC guidance): **separate plan and apply with human approval between**;
  **encrypted remote state with locking** (never on a laptop, never in the repo); **inject secrets at runtime**,
  never commit them; **scan the plan** (e.g. Checkov-class tools) for misconfig — public buckets, missing
  encryption, over-broad IAM — before apply.
- **Drift** = live infra ≠ code. Creeps in via console hotfixes, broken automation, partial applies, parallel
  tooling; surfaces at the worst time (next apply). **Detect on a schedule** (periodic plan that alerts on a
  diff) so manual changes are caught in hours; **remediate by code**, not by re-doing it by hand.
- **Immutable infrastructure** — replace instances/images rather than patching live boxes; kills config drift
  and "works on that one server." GitOps applies the git branch→review→merge→deploy flow to infra.
- **Tooling (2025–26):** Terraform (HashiCorp, BSL-licensed) remains the largest installed base; **OpenTofu**
  (open-source, Linux Foundation, community-governed fork) is the choice when open governance matters and has
  **diverged at the feature level** (e.g. provider-defined functions, early variable eval), not just licensing.
  Pulumi (general-purpose languages), CloudFormation/CDK (AWS-native), Helm/Kustomize (k8s) — pick per stack;
  the discipline (declare/version/review/plan/secrets/drift) is constant across tools.

## Observability
- **Goal:** ask new questions of prod *without shipping new code*. The "three pillars" (metrics, logs, traces;
  profiling emerging as a fourth) are *means*, not the goal — and treating them as three siloed stores is an
  anti-pattern (Honeycomb's critique): you want **correlated, high-cardinality, structured** telemetry you can
  pivot across (a latency spike → the trace → the log line that explains it).
- **Standardize on OpenTelemetry** (CNCF) for vendor-neutral instrumentation — avoids per-vendor agent lock-in.
- **The monitoring methods:**
  - **Four golden signals** (Google): latency, traffic, errors, saturation — the floor for request services.
  - **RED** (Tom Wilkie): rate, errors, duration — per request-driven service/endpoint; great for SLI dashboards.
  - **USE** (Brendan Gregg): utilization, saturation, errors — per resource (hosts, pools, disks, queues).
- **Alerting:** page on **user-facing symptoms / SLO burn**, never on causes (CPU/mem thresholds = noise).
  **Multi-window multi-burn-rate** (MWMBR) alerting pages fast on fast budget burn, tickets on slow burn. Every
  page must be **actionable** and **runbook-linked**; prune flaky alerts relentlessly (alert fatigue trains the
  team to ignore the real one).

## Progressive delivery (deploy ≠ release)
- **Canary** (1% → ramp, gated on health, auto-abort on regression) · **blue-green** (two envs, flip the
  router; instant rollback, double cost during cutover) · **feature flags / dark launch** (decouple release
  from deploy; instant per-cohort kill-switch) · **rolling update** (batch replace; mind surge/health config).
- Stage by **blast radius** (region/tenant/cohort), not just percentage; never canary on your highest-value
  customer first. The canary only protects you if you watch the right signal and the abort is automatic.

## Cloud cost / FinOps (FinOps Foundation framework)
- **Cost is a shared engineering responsibility**, continuous, not a finance-only quarterly cleanup. ~**$44B/yr
  is cloud waste** (FinOps Foundation 2025 State of FinOps; waste reduction is now the #1 practitioner priority).
- **Inform → Optimize → Operate:** make spend visible and **attributable** (tag by team/service/env; budgets +
  anomaly alerts) → kill idle/zombie resources, right-size, buy commitment discounts for the steady baseline,
  autoscale/scale-to-zero, watch egress & storage tiers → make cost review routine; cost-estimate new resources
  at the IaC plan stage.
- **Don't optimize cost into an outage** — cost respects the SLO; right-sizing away your spike headroom or
  betting spot instances on stateful workloads trades a bill for an incident.

## Platform engineering (Team Topologies; platformengineering.org)
- **Golden path / paved road** — the opinionated, supported way to ship here, pre-wired with deploy, observ-
  ability, secrets, rollback, security defaults; an **Internal Developer Platform** is the product that serves
  it. Goal: **reduce cognitive load** (Team Topologies — platform teams absorb complexity so stream-aligned
  teams focus on product).
- **Pave, don't mandate** — adoption because it's faster/safer, not because alternatives are blocked; **self-
  service over ticket queues**; secure/observable/reversible **by default** (pit of success). By 2026 most eng
  orgs run platform teams — but **right-size**: don't stand up an IDP for a 3-person startup; a good deploy
  script + runbook *is* the golden path at that stage.
