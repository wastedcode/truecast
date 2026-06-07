---
name: investigate-the-real-trace
description: Use the moment observed ≠ expected and especially when a result seems impossible (a deleted thing still appears, a fix has no effect, state lingers after teardown) — distrust your own environment first. Are you hitting the live build? a stale cache or old artifact? a zombie/leftover process? did teardown actually clear state? Confirm what you're actually testing before you file a bug or trust a pass.
---
# Investigate the real trace — when reality is impossible, suspect your setup first

The most expensive QA mistakes come from trusting an observation made against the wrong thing: a bug filed
against a build that isn't running, a "pass" recorded against a cached artifact, a "fix verified" that
never executed the new code. When **observed ≠ expected** — and especially when the result looks
*impossible* ("I deleted it but it's still there", "I changed the code but nothing changed", "sessions are
still running after I shut everything down") — the first hypothesis is not "the build is broken" or "the
fix worked." It's **"I am not measuring what I think I'm measuring."** Confirm the environment before you
trust the result, in either direction.

## The environment-distrust checklist (run before filing OR before accepting)
- **Am I hitting the live build?** The right server/port/container, the just-built binary not yesterday's,
  the local branch not a deployed copy, the real surface not a mock. Make the running code *announce
  itself* — a version string, a log line, a deliberate breakpoint/print — and confirm you see it before
  trusting anything.
- **Is it a stale cache or old artifact?** Browser/CDN/HTTP cache, a build cache that skipped the rebuild,
  a compiled/bundled artifact older than the source, a memoized/in-memory value, an ORM/query cache, a
  package resolved from a stale lockfile. The "deleted thing still appears" classic is almost always a read
  served from cache, not the store.
- **Is there a zombie / leftover process?** An old dev server, daemon, worker, or watcher from a prior run
  still bound to the port and answering your requests; a background job from a previous session; a tmux/
  screen pane still alive. Enumerate what's actually running (`ps`, the port, the job list) — don't assume
  the thing you started is the thing replying.
- **Did teardown actually clear state?** The DB row/file/key the last test was supposed to delete, a
  lingering session/token, env vars or a temp dir carried over, a fixture that "reset" but didn't. State
  bleeding between runs makes the next result a lie — pass *or* fail.
- **Right config / data / account?** Pointed at the wrong env file, the wrong tenant/account, seed data
  from a different shape, a feature flag in the opposite position.

## How to investigate (don't theorize — instrument)
1. **Get a real trace, not a guess.** Add a log/print at the exact path, watch the actual request, check
   the actual file/row/process. A theory about why observed ≠ expected is a hypothesis; the trace is the
   evidence.
2. **Prove you're on the live path** with a deliberate, unmistakable signal (change a string, add a marker,
   force an error) and confirm it appears. If it doesn't, you've found the real problem — your environment —
   before wasting a bug report.
3. **Make it clean, then re-observe.** Kill the strays, clear the caches, fresh teardown/rebuild, fresh
   process — then reproduce. A result that survives a clean environment is real; one that doesn't was an
   artifact of the setup.
4. **Only then is it a bug.** Once you've ruled out your own environment, the discrepancy is genuine and
   goes to reproduce-and-grade with the trace attached (`reproduce-and-grade`).

## The discipline
- This cuts **both ways**: a *false negative* (a real bug masked by a cached old build, so you wrongly
  pass) is as dangerous as a false positive. Distrust a surprising green as hard as a surprising red.
- Leftover processes and uncleared state are not just noise — they're a finding. "Why are sessions still
  running after done?" and "teardown didn't clear it" are real defects (often a lifecycle bug) — route them
  (lifecycle/process hygiene → engineer/infrastructure), don't just clean up and move on.
- Don't trust "works on my machine" or "it worked in the demo" — those are observations against an
  unverified environment. Verify the environment, then verify the result.
