---
name: beat-the-frontier
description: Use before writing any non-trivial change and as the last pass before handing it over — your version of the engine's "beat the frontier" loop. Name who writes this kind of code best today, set the bar above them, pre-empt every ask a demanding reviewer would make (real-data proof, query cost, reuse, current libraries, every caller), and critique the diff as that engineer would until nothing material is left.
---
# Beat the frontier — engineering

Green tests are the floor. The bar is **the best engineer shipping this kind of code today, and past
them** — the user should never have to come back with "did you actually check the rows?", "why is this
query reading half the table?", "we already have this", or "why is this 6,000 lines?". Every one of those
is an ask you could have answered first. You can read every caller, enumerate every error path and verify
against real data in less time than a human takes to skim one file. Do that.

## 1. Name the frontier (seeds as of 2026-10 — search for who's leading now before you rely on them)
| Kind of work | Who sets the bar | Look at |
|---|---|---|
| Correctness-critical systems code | TigerBeetle (Joran Dirk Greef) | `docs/TIGER_STYLE.md` — assertions, bounds, no surprises |
| Written design before code | Oxide Computer | their public RFDs |
| Careful, legible application code | Mitchell Hashimoto (Ghostty); antirez | their write-ups and commits |
| Disciplined agent-assisted engineering | Simon Willison | simonwillison.net coding-agents notes |
| Minimal, readable code | Andrej Karpathy | nanoGPT / nanochat |
| Module design | John Ousterhout | *A Philosophy of Software Design* |
Pick the 2–3 closest to *this* change. Read the relevant piece of their work and write down the specific
practice you're applying.

## 2. What their work does that competent work doesn't
- Deep modules: small interface, real complexity hidden; no pass-through layers.
- Invariants asserted in production code, not only in tests.
- Explicit bounds on every queue, buffer, retry, timeout and result set.
- Bugs fixed at the root with a regression test that failed first.
- Small reversible commits, each builds and passes.
- Property/fuzz tests on parsers and state machines.
- Performance claims backed by a measurement, not a feeling.

## 3. Table stakes — the canon you already exceed
Ousterhout · Fowler, *Refactoring* · Kernighan & Pike, *The Practice of Programming* · Feathers, *Working
Effectively with Legacy Code* · *Software Engineering at Google* · TigerStyle. Meeting these is the entry
ticket, not the bar.

## 4. Where you go past them
- Read **every** caller of anything whose interface you change.
- Enumerate **every** error path and edge input, and test the ones that matter.
- Verify against **real data** — the actual rows, the actual response — not just fixtures.
- Check the changelog of **every** dependency you add or bump.

## 5. The asks to pre-empt (do these before anyone asks)
- **Prove it on real data:** spot-check actual rows/outputs; reconcile totals against an external or
  independent reference; sanity-bound every number (can it even be that big?).
- **Query cost:** read the query plan and rows-read before shipping any query on a large table; add the
  index or summary table now, not after the bill.
- **Reuse first:** concept-grep the whole repo and sibling projects for an existing solution; never build a
  second copy of anything (`understand-before-you-write`).
- **Current best-in-class:** verify the library/vendor choice against the live landscape (search it); no
  hand-rolled versions of solved problems; state the trade-off.
- **Simplicity pass:** delete every piece of state, rule, flag and layer the change doesn't need; the
  diff should be the smallest that's fully correct (`tame-complexity`).
- **Every surface:** a change that crosses the system lists and updates all of them — schema, API, UI,
  docs, config, billing, logs.
- **Show, don't claim:** the exact command, payload or prompt you ran and its real output; a dry run on
  one item before a batch.
- **Live after deploy:** hit the real endpoint/page with real parameters and show the result.
- **Commands for others run first:** anything handed to a human is tested in their shell/user/env, with
  no placeholders.
- **The user's words:** what was asked, with its nuance — diff your result against the request.

## 6. The critique pass — be the engineer you named
Review the diff in their voice: Would TigerStyle find an unbounded loop or an unasserted invariant? Would
Ousterhout call a module shallow? Would an Oxide RFD reviewer ask which alternative you rejected? Then run
`review-the-diff` and `prove-it-then-break-it`. Fix, re-verify, repeat until a pass finds nothing material.

## 7. The Frontier check (end of the deliverable, ≤6 lines)
- **Benchmark:** the 2–3 practices/exemplars you held it against (named).
- **Where this beats them:** concretely.
- **Covered:** the user's constraints + the pre-empted asks above (any judged N/A, and why).
- **Critique caught:** what the last passes found and you fixed.
- **Verified:** tests, real-data spot checks, query plans, live check — with the evidence.
