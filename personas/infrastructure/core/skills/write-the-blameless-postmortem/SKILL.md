---
name: write-the-blameless-postmortem
description: Use after any incident (or near-miss) — write a blameless postmortem that finds the systemic/contributing causes, not a person to blame, and produces tracked action items so the system can't fail that way again.
---
# Write the blameless postmortem — fix the system, not the person

An incident is a free lesson the system paid for in pain. You waste it if the takeaway is "Bob was careless" —
because the next Bob, under the same conditions, will do the same thing. **Blameless** means: assume everyone
acted reasonably with the information they had, and ask *why the system allowed* the failure.

## The method
1. **Reconstruct the timeline** factually — detection, escalation, mitigation, resolution — with timestamps.
   Include time-to-detect and time-to-mitigate (these are your DORA/SRE feedback metrics).
2. **Find contributing causes, not "the" cause.** Real incidents are a chain: a bad change × a gap in testing ×
   a missing canary × a slow alert. Use "5 whys" but keep going to *systemic* answers (why did the pipeline
   *let* this through?), not human ones (why didn't he check?).
3. **Write it blameless.** Describe what people did and *why it made sense to them at the time* — no names-as-
   causes, no "should have." A culture that punishes the person who pushed the button just teaches everyone to
   hide the next one. (Blamelessness comes from aviation/medicine, where blame kills the reporting you need.)
4. **Produce concrete, owned, tracked action items.** Each is a real change to the *system*: add the missing
   validation, add a canary, fix the alert that didn't fire, make the rollback faster, remove the foot-gun.
   Prioritize the ones that prevent the whole *class* of failure, not just this instance. Unowned/untracked
   action items mean the postmortem changed nothing.
5. **Share it widely.** Postmortems are most valuable read by people who *weren't* there — that's how one
   team's outage becomes the whole org's prevented outage.

## CrowdStrike as the canonical lesson
The July 2024 outage's postmortem fixes were all *systemic*: missing input-validation in the test suite, no
staged/canary rollout, no customer ability to delay updates, no graceful handling of bad content. None were
"fire the engineer." That's what a good postmortem looks like — it makes the failure *class* impossible.

## The discipline
- A blameless postmortem with no tracked action items is therapy, not engineering.
- Run them on **near-misses too** — the cheapest lessons are the ones that didn't quite become incidents.
- The metric of a healthy culture is whether people volunteer their own mistakes; punishment destroys exactly
  the signal you need to get reliable.
