---
name: beat-the-frontier
description: Use before any substantive infra/ops deliverable and as the last pass before handing it over — your version of the engine's "beat the frontier" loop. Name who runs production best today, set the bar above them, pre-empt every ask a demanding SRE lead would make (commands that run first time, real limits, cost caps, scoped and reversible changes, verified live), and critique the work as they would until nothing material is left.
---
# Beat the frontier — infrastructure

Shipping it is the floor. The bar is **the best platform team running production today, and past them**.
The user should never have to come back with "that command is broken", "why yet another user?", "does
the vendor even have that limit?", "did you deploy?" or "be careful with the creds". Every one of those
is a check you could have done first. You can read every vendor limit, dry-run every command and verify
every change live in less time than one human on-call takes to page in. So do it.

## 1. Name the frontier (seeds as of 2026-10; search for who's leading now before you rely on them)
| Kind of work | Who sets the bar | Look at |
|---|---|---|
| SLOs, hazard analysis, postmortems | Google SRE (STPA/CAST) | sre.google STPA practices; *SRE Workbook* |
| Observability | Charity Majors / Honeycomb | wide events, high-cardinality debugging |
| Public incident write-ups | Cloudflare; AWS post-event summaries | Cloudflare Nov-2025 outage; AWS us-east-1 Oct-2025 (aws.amazon.com/message/101925) |
| Cell architecture, static stability | AWS Builders' Library | shuffle sharding, static stability articles |
| Resilience engineering | Lorin Hochstein / Learning from Incidents | incident analysis essays |
| Platform simplicity | Fly.io / PlanetScale engineering blogs; Kelsey Hightower | recent ops write-ups |
Cover every leader relevant to *this* deliverable, read their latest relevant write-up, and write down the
specific moves you're taking.

## 2. What their work does that competent work doesn't
- SLOs and error budgets actually gate releases.
- Progressive delivery: canary → automated analysis → tested rollback. **Config and generated data go
  through the same gate as code.** Both of 2025's biggest outages were config/data propagation failures.
- Kill switches, plus validation (size, schema) on generated artifacts before they propagate.
- Wide-event tracing per request, so new questions don't need a redeploy.
- Game days run on a schedule; postmortems name contributing factors, not "human error".
- Infra as code with drift detection; capacity plans backed by load tests.

## 3. Table stakes: the canon you already exceed
Google *SRE* + *SRE Workbook* · *Accelerate* / DORA · Majors et al., *Observability Engineering* · Nygard,
*Release It!* · Allspaw on blameless postmortems. Meeting these gets you in the door. It isn't the bar.

## 4. Where you go past them
- **The composite, first:** one deliverable that carries the signature move of *every* leader in §1 at
  once — something none of them could produce alone — and then the coverage below, which none of them can
  afford. Beating any one of them is a miss.
- Read **every** published limit, quota and pricing page for the platforms you touch before you set a
  pace or budget.
- Dry-run **every** command and config change; enumerate **every** path a config or data file
  propagates through.
- Verify **every** change live (the real endpoint, the real job run, the real log line) and keep the
  runbook current every time.

## 5. The asks to pre-empt (do these before anyone asks)
- **Commands that run first time** (`hand-over-commands-that-run`): dry-run or test them yourself. Use
  the right user and shell (root vs `sudo`, the service user, the env and HOME it needs, modules
  installed for *that* user). No placeholders. Write output to a file you can read back. Say whether
  the command is reversible and how.
- **Reuse before adding.** Use the existing service user, timer, job and deploy script. Every new user,
  daemon or service needs a reason.
- **Real limits, not guesses.** Look up the published rate limits and quotas. Pace up to the real limit
  and back off on 429/backpressure. Don't accept an arbitrary throttle or "budget" nobody can source.
- **Hard cost caps** on any run that spends money: a ceiling, the expected bill, and a kill switch.
- **Scoped and additive.** Before touching DNS, certs, creds or shared infra, list exactly what will
  change. Prove the change is additive and inside the one zone or scope. Never leak or print secrets.
- **Back up before delete.** Double-check the target list and keep a restore path.
- **Alerts fire only on real failures.** No alarming email on a night the job actually succeeded.
- **Self-verify.** Ask for read access to logs and status early, so you can confirm things yourself
  instead of asking the human to paste output.
- **Narrow kills.** Kill processes by exact PID/unit, never a broad pattern that hits your own session.
- **"Done" = live and shown:** the URL, the command, the log line. Write down how it was done (secrets
  uploaded, certs issued) in the runbook (`author-the-runbook`).

## 6. The critique pass: be the SRE you named
Review it the way they would. Would Google SRE ask what hazard this config path creates? Would a
Cloudflare postmortem author ask what happens when this generated file is twice the expected size? Would
Charity ask how you'd debug it at 3am without a redeploy? Then run `map-blast-radius`,
`release-with-tested-rollback` and `know-the-platform`. Fix, re-verify, and repeat until a pass finds
nothing material.

## 7. The Frontier check (end of the deliverable, ≤6 lines)
- **Benchmark:** every leading practices or exemplars you held it against (named, linked).
- **Where this beats each of them:** concretely, one line per leader.
- **Covered:** the founder's constraints, plus the pre-empted asks above (call out any N/A and why).
- **Critique caught:** what the last passes found and you fixed.
- **Verified:** commands dry-run, limits sourced, change seen live, rollback path, runbook updated.
