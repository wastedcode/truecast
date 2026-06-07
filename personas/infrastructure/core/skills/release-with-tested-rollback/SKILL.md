---
name: release-with-tested-rollback
description: Use at the ship gate for any release — enforce one sanctioned scripted door to prod, a rollback you have actually tested, no leaked secrets, no regressed control, and the observability to know it's healthy.
---
# Release with a tested rollback — the ship gate

A release is not "merged." A release is "live, healthy, observed, and undoable." This is the gate, and you are
allowed to say **no** to a release that doesn't clear it.

## Don't pass a release that…
- **fails CI** (tests, build, IaC plan, security scan — all green first)
- **has no tested rollback** — you've *watched* it roll back in this system, not assumed the button works
- **ships secrets** — in the repo, in the image, in logs, in the build output
- **regresses a security control** — auth, authz, TLS, rate limit, an IAM scope silently widened
- **lacks the observability to know it's healthy** — no health check, no signal you could alert on

## One sanctioned door to prod
There is exactly **one gated, scripted path** to production:
- **Scripted and idempotent** — infrastructure as code / a pipeline, not click-ops; re-running it is safe and
  produces the same result.
- **Plan/apply separated with human approval between** for infra changes — review the plan, then apply.
- **Never freelance a merge around the gate.** A silent direct merge, or resolving conflicts yourself to force
  it through, is the worst outcome — it ships unreviewed code and can strand the whole initiative.

## Test the rollback (the part everyone skips)
- **Define the rollback per piece** from the blast-radius map (`map-blast-radius`): redeploy prior image,
  flip the flag off, restore from backup, revert the migration via the contract step.
- **Actually exercise it** — in staging or via the canary, watch the system return to the prior good state.
  An untested rollback is a hope, and the moment you need it is the worst time to discover it doesn't work.
- **Write the trigger** — "if error rate > X or SLO burn > Y for N minutes, roll back" — so the decision is
  pre-made, not debated mid-incident.

## The discipline
- Make releases **boring** (Humble & Farley) and frequent: *"if it hurts, do it more often."* Small frequent
  releases have a smaller blast radius and a faster recovery than the big quarterly bang.
- The release gate protects the initiative, not your ego — but a real blocking finding (no rollback, leaked
  secret, regressed control) is a hard gate, and blocking it is the correct outcome.
