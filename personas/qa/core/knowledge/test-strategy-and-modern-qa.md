# Test strategy & modern QA — reference

The depth behind `design-the-test-strategy`, `explore-with-charters`, `verify-non-functional`,
`guard-against-regression`, `test-the-non-deterministic`, and `accept-against-reality`. Read when scoping
coverage, exploring, or judging an AI/non-functional/regression surface.

## Testing vs. checking (Bach & Bolton)
- **Checking** — confirming *known* assertions a machine can run (the engineer's green suite). Mechanical.
- **Testing** — the human act of *investigating* to find the **unknown**: learning, questioning, designing,
  exploring where no assertion was written. Requires judgment, creativity, skepticism.
- QA's value is **testing**, not re-running the checks. A green suite next to an inert feature is the
  classic ship-it-broken configuration; investigation is what catches it.

## Shift-left & preventive quality (Crispin & Gregory)
The cheapest bug is the one never built; the cost of a defect rises by orders of magnitude from refinement
→ build → production. The best testers engage **before code exists** — the whole-team approach to quality.
- **Question the story** while it's cheap: drive every AC to something **objectively testable** (observable
  behavior, clear pass/fail); an AC you can't write a test for is a defect of intent.
- **Example mapping** — for a story, lay out **rules → concrete examples → open questions**; the example
  nobody can answer is the unscoped edge (empty/error/boundary/returning/cancel) found before it ships.
- **Agile testing quadrants** (Crispin/Gregory, after Marick): Q1 unit/component & Q2 functional/story
  tests *support the team* (mostly automated, prevent + guide development); Q3 exploratory/usability &
  Q4 performance/security/reliability *critique the product* (the adversarial + non-functional pass). A
  full strategy spans all four, not just Q1/Q2.
- **Testability by design** — a build you can't observe you can't test. Demand the seams up front:
  **observability** (logs/events/error surfaces, a real read path for persisted state), **controllability**
  (seed/teardown, reach edge states, reset), **stable hooks** (selectors/test-ids/API contracts), and for
  AI features a representative input set + system-prompt access + pinnable model/version.
- Stay in lane: preventive QA is **influence through better questions**, not taking the pen — route
  untestable ACs / missing journeys → product, missing seams → engineer/architect.

## Coverage modeling — Bach's Heuristic Test Strategy Model
Coverage = the *dimensions you've touched*, not a count of cases. **SFDIPOT** ("San Francisco Depot") —
the product elements to walk: **S**tructure · **F**unction · **D**ata · **I**ntegrations · **P**latform ·
**O**perations · **T**ime. Most "we never thought of that" defects live in **D, I, T** (data lifecycle,
integration failure, concurrency/ordering/time) — exactly what unit tests skip. Pair with **quality
criteria** (capability, reliability, performance, security, usability/accessibility, compatibility,
installability) so you don't test only "does it function." A strategy names what you'll test, *why* (the
risk), how, and **what you're deliberately not testing** — coverage as a decision, not an accident.

## Lifecycle as a state machine — the transition × interrupt matrix
Anything with phases or persisted progress (draft→published, job run→complete, session open→resume→close,
auth→capture) is a **state machine** whether or not it was drawn. The author tests the *states*; the bugs
live in the **transitions**, and especially in **interrupted** transitions. Before attacking, draw it:
- **States** (incl. implicit ones — partial, orphaned, zombie, "started-never-finished"), **transitions**
  + their triggering **event**, **guards/invariants** (what must hold across a move), and **illegal
  transitions** that must be rejected (pay an expired invoice, resume a torn-down session).
- For **each transition**, probe under **crash** (kill mid-transition — recover or strand?), **kill/cancel**
  (rollback or orphan?), **resume** (re-derive correct state or trust half-written state?), **double-send**
  (idempotent or double-effect?), **out-of-order/stale** (late or duplicate event — guarded or clobbers?).
- The richest seam is **crash + resume on the same transition** — the source of most "phantom state" and
  "broke the second time" bugs. A transition that's neither idempotent nor guarded is a P0 awaiting a
  double-send/redelivery. A lifecycle fragile *by construction* (no single owner of state) → escalate the
  architect. The drawing is the coverage record; an arrow with no probe is untested.

## Runtime forensics — when observed ≠ expected, distrust your environment first
The costly QA error is an observation made against the wrong thing — a bug filed against a build that isn't
running, a "pass" against a cached artifact, a "fix verified" that never executed. When observed ≠ expected
(especially when the result is *impossible*: deleted thing still appears, code change has no effect, state
lingers after teardown), the first hypothesis is **"I'm not measuring what I think I am."** Confirm before
trusting, in either direction:
- **Live build?** right server/port/branch/binary; make the running code announce itself (version string,
  log line, deliberate marker) and confirm you see it.
- **Stale cache / old artifact?** browser/CDN/HTTP, build cache that skipped a rebuild, memoized value,
  query/ORM cache, stale lockfile — the "deleted thing still appears" classic is a cached read.
- **Zombie / leftover process?** an old dev server/daemon/worker/watcher still bound to the port answering
  you; enumerate what's actually running (`ps`, the port, the job list).
- **Teardown actually cleared state?** lingering row/file/key/session/token, carried-over env or temp dir.
- Then **instrument, don't theorize** (real trace > guess), **clean and re-observe**, and only then is it a
  bug. Cuts both ways — a surprising *green* (real bug masked by a cached old build) is as dangerous as a
  surprising red. Leftover processes / uncleared state are themselves findings → route to engineer/infra.

## Measurement rigor (the general experimental discipline)
When a verdict rests on a **measured quantity** — a perf number, an accuracy/conversion/error rate, a noisy
or probabilistic output — one sample is an anecdote. Settle it like an experimentalist: a **labelled
reference set** (fixed + representative so runs compare; grows from escaped failures), a **baseline/control**
(measure the *change* vs. prior/prod, everything else held fixed — "9s vs 1.2s before", not "9s"), **saved
structured results** (per-case outcome + score + conditions + version + timestamp, not a console glance),
and **significance** (repeat it; is the delta bigger than run-to-run noise before you call it real?).
Re-measure on every relevant change against the same set + baseline — measured behavior regresses silently.
This is general rigor; the AI/LLM eval below is one instance of it, not a separate mechanism.

## Exploratory testing & session-based test management (SBTM)
Exploratory testing = **simultaneous learning, test design, and execution**, steered by discovery — the way
you find the bugs nobody scripted. Structure it so it's accountable:
- **Charter** — a one-line mission ("explore X under condition Y to discover Z"), risk-led.
- **Time-boxed session** — typically 60–120 min, focused, uninterrupted; one charter.
- **Notes** = the coverage record for unscripted work (what tested, found, blocked, new questions).
- **Debrief** — findings → reproduced/graded bugs; open questions → new charters.
"Follow the smell": when the system wobbles, abandon the plan and dig — that's the bug cluster.

## Test shapes — pyramid vs. trophy vs. ice-cream-cone (context-driven)
- **Pyramid** (Cohn/Fowler): many fast **unit**, fewer **integration**, few **e2e**. Test behavior, not
  implementation.
- **Trophy** (Rauch/Dodds): *"write tests, not too many, mostly integration"* — integration carries the
  most confidence per cost for modern web apps.
- **Ice-cream cone** (anti-pattern): mostly slow manual/e2e, few unit → slow feedback, flaky, defects slip.
  The inversion to avoid.
- The honest stance (context-driven): **there is no universal best shape** — pick the mix that fits the
  risk and the system. QA doesn't own the shape (engineer does) but flags an inverted, flaky one.

## Non-functional surface
- **Performance** — realistic data volume (the N+1 hides until real data), concurrency/load, core-flow
  latency (user-perceived).
- **Accessibility** — keyboard-only completion, visible/ordered focus, screen-reader semantics + alt text,
  contrast + 200% zoom. Bar: **WCAG 2.2 AA**.
- **Security (obvious holes)** — IDOR/missing-authz at the boundary, injection (SQL/XSS/path), secrets &
  PII exposure in responses/logs/bundle. Deep posture → security-engineer.
- **Reliability/recovery** — crash/restart mid-op (recover vs. corrupt), dependency down/slow/garbage
  (degrade vs. cascade), idempotency on retry/double-submit.

## Regression & flaky tests (modern CI)
- Protect the **few highest-value journeys** as a fast (<~5 min) PR-blocking smoke gate — a handful of
  journeys covers the majority of production risk; broad/slow suites run nightly/pre-release.
- **Test impact analysis** selects tests by what changed — never trusted alone on auth/data/money.
- Every confirmed bug → a permanent regression check (so it can't silently return).
- **Flaky tests:** detect → **quarantine** (out of the blocking suite, non-gating) → **own** (assign +
  deadline, find the cause) → fix or delete. **Never auto-retry-past** — a flake can hide a real
  concurrency bug; a suite people don't trust launders broken builds.

## Testing the non-deterministic (AI/LLM, 2025–26) — measurement rigor applied
An instance of the measurement-rigor discipline above. Probabilistic outputs **break** pass/fail assertion
QA ("a QA crisis" — LogRocket 2025). Apply the same reference-set / baseline / saved-results / significance
spine and test for **meaning, quality, accuracy, safety** with probabilistic scoring over many cases:
- **Eval set** — real inputs across easy/common/hard-edge/adversarial; grown from production failures.
- **Graders** — deterministic (exact/format/schema) > rubric-based (LLM-judge or human, spot-checked) >
  composite. Define "correct" explicitly.
- **Acceptance** — target pass rate **+ a worst-case floor** (a 95% mean can hide a catastrophic 5% tail)
  **+ guardrails** (groundedness/hallucination, refusal/safety, latency, cost/call).
- **Failure taxonomy** — bucket misses for targeted fixes.
- **Red-team** — prompt injection / jailbreak, unsafe-content (under- and over-refusal), hallucination
  under ambiguity, bias/fairness across demographics/locales.
- **Re-run on every prompt/model/version change** — these regress *silently*.

## Acceptance against reality
AC → acceptance tests (one AC may need several). Do the **whole user journey yourself** through the real
surface; **verify persisted state** by re-reading through the real read path (the success message is not
proof). Cover the second-time/empty/error/returning states. Verify against the user's *intent* (oracle),
against which the AC itself can be wrong/incomplete. A green CI run is a precondition, not the verdict.

## Authorities & sources
- Bach — Heuristic Test Strategy Model / SFDIPOT (satisfice.com); Bach & Bolton — testing vs. checking
  (developsense.com / satisfice.com).
- Kaner, Bach, Pettichord — *Lessons Learned in Software Testing* (context-driven principles).
- Lisa Crispin & Janet Gregory — *Agile Testing* / *More Agile Testing* — whole-team approach, shift-left,
  the agile testing quadrants. Matt Wynne / Seb Rose — example mapping (rules/examples/questions).
- Elisabeth Hendrickson — *Explore It!* + the Test Heuristics Cheat Sheet (exploratory heuristics).
- Session-Based Test Management (Jon & James Bach) — charters + time-boxed sessions.
- Cohn/Fowler test pyramid; Rauch/Dodds testing trophy; ice-cream-cone anti-pattern (industry).
- Modern AI/LLM QA 2025–26: probabilistic scoring, evals, red-teaming, the "QA crisis" of assertion-based
  testing against non-deterministic outputs (LogRocket, Confident AI, industry guides).
- WCAG 2.2 AA (W3C) — accessibility bar. OWASP — injection / IDOR / access-control basics.
