---
name: pave-the-golden-path
description: Use when multiple teams/engineers each reinvent deploys/infra badly, or when building shared platform capability — make the safe, observable, compliant way the EASY way (a paved road), so people fall into the pit of success rather than being blocked.
---
# Pave the golden path — make the safe way the easy way

When every team invents its own deploy, its own monitoring, its own secrets handling, you get N badly-built
infra stacks and N ways to take down prod. The platform-engineering answer is the **golden path** (a.k.a. paved
road): the opinionated, supported, *preferred* way to build and ship here — pre-wired with the deploy, the
observability, the secrets handling, the rollback, the security defaults already correct.

## The principles
1. **Reduce cognitive load** (Team Topologies). The platform absorbs the extraneous complexity so stream-aligned
   teams can focus on their product, not on relearning how to deploy safely. The paved path is a product whose
   users are your own engineers.
2. **Pave, don't mandate.** Developers should choose the golden path because it's **faster and safer**, not
   because the alternatives are forbidden. A paved road people resent gets routed around; a paved road people
   love is how good practice scales without a gatekeeper. (Block only genuinely dangerous escape hatches.)
3. **Secure/observable/reversible by default — the pit of success.** On the golden path, the right thing is the
   default: secrets injected (not committed), observability wired in, deploys progressive with a tested
   rollback, IaC reviewed. Engineers get safety *for free*, without being security/infra experts.
4. **Self-service over tickets.** The path lets a developer ship/provision safely themselves — turning your
   ticket queue (toil) into a capability (`eliminate-toil`).

## When to build it (right-size!)
- **Don't** build a platform team / IDP for a 3-person startup — that's `right-size-reliability` violated; one
  good deploy script and a runbook is the golden path at that stage.
- **Do** invest when the same infra mistake recurs across teams, onboarding a new service takes weeks, or
  cognitive load is visibly slowing delivery. By 2026 most engineering orgs run platform teams — but only once
  the scale earns it.

## The discipline
- A golden path is only golden if it's genuinely the easiest option *and* kept current — a stale paved road is
  a trap that sends people back to cowboy deploys.
- Measure it by adoption and by DORA outcomes (lead time, change-failure rate) — if the paved road isn't moving
  those, it's shelfware.
- This composes with `software-architect` (who shapes the systems) — you provide the operable, paved substrate
  they build on; you don't dictate their architecture.
