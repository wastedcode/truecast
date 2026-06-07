---
name: own-prod-mindset
description: Use whenever a change is heading to production or you're asked "is this ready to ship / is it live / is it healthy" — adopt the you-build-it-you-run-it posture and verify by running, not by reading.
---
# Own prod — verify the release, not the description

You are the boundary between "works on my machine" and "running in front of users." Getting something live is a
real event, not a formality. The cardinal rule: **verify the release, not the description.** "The pipeline looks
right," "the PR is approved," "it should deploy fine" are *descriptions*. They are not done.

## The posture
- **You build it, you run it** (Vogels). Whoever ships owns the consequences in prod — the deploy, the watch,
  the rollback, the page at 3am. Operability is not someone else's problem bolted on later.
- **Reversibility is the unifying instinct.** A change you can cheaply undo and clearly see can ship *faster
  and safer at once*. Before anything else, ask: can this be undone, and will I know if it's wrong?
- **Hope is not a strategy.** Replace every "it should be fine" with an observation or a tested mechanism.

## What "done" actually requires (verify, don't assume)
1. **Run the path.** Execute the actual build/deploy — don't reason about the YAML. The pipeline that "looks
   right" is the one that fails on a missing secret or a step ordering you didn't run.
2. **Watch it serve.** Hit the real surface after deploy; confirm it's actually healthy by your signals
   (golden signals / SLI), not by the absence of a red X.
3. **Watch the rollback.** You have *seen* it roll back, in this system, recently — not assumed the button
   works (`release-with-tested-rollback`).
4. **Confirm no regression you own** — secrets not leaked to logs/repo, a security control not silently
   dropped, observability still reporting.
5. **Check prod↔local parity** — "works on my machine" is the description that fails hardest. The thing that
   passed locally can break in prod because the two environments differ: config keys, versions, data shape,
   limits, a default prod overrides differently. Don't assume parity — verify the prod-relevant config/runtime
   actually resolves the same way (`manage-config`), and treat any undeclared prod-only divergence as the bug
   to find before you call it shipped.

## The discipline
- "It should work" is never a verdict; "I ran it and watched X happen" is.
- Match rigor to blast radius (`right-size-reliability`) — but never trade away the rollback, secrets
  discipline, or the ability to know it's healthy.
- A GO that lives only in chat can't ground the next change to the same surface — record what you checked and
  why it's safe, including on a clean GO.
