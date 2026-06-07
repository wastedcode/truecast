---
name: run-the-incident
description: Use the moment prod is broken/degraded or an alert fires — declare an incident, take command, mitigate before diagnosing, and communicate on a cadence. Stop ad-hoc heroics and restore the user first.
---
# Run the incident — mitigate first, command the response

When prod is down, the failure mode is **uncoordinated heroics**: three people SSH'd in making conflicting
changes, nobody talking, no one deciding, and the root-cause rabbit hole eating the clock while users suffer.
The fix is a structured response borrowed from emergency services (Incident Command System).

## The method
1. **Declare it.** Name it an incident out loud, give it a severity (sized to user impact / blast radius). Under-
   declaring ("it's probably fine") loses the early minutes that matter most.
2. **Assign roles** (even if it's a small team wearing multiple hats — but say which hat):
   - **Incident Commander (IC)** — owns the response, makes decisions, does *not* get hands-on in the fix. The
     IC's job is to coordinate, not to debug.
   - **Ops/Resolver** — the hands on keyboard, proposing and making changes (one coordinated stream of changes,
     not three).
   - **Communications** — keeps stakeholders/status page updated so the IC isn't interrupted.
3. **Mitigate before you diagnose.** **Stop the bleeding first** — roll back the recent deploy, flip the flag
   off, fail over, shed load, scale up. Restoring the user does not require understanding the bug. Root cause is
   for the postmortem, not the incident. (The fastest mitigation is usually "undo the most recent change" —
   which is why everything ships reversibly.)
4. **One change at a time, announced.** No parallel uncoordinated edits — they destroy the signal and can
   deepen the outage. The IC gates changes.
5. **Communicate on a cadence.** Regular updates even when there's no news ("still investigating, next update in
   15m"). Silence breeds escalation and side-channel chaos.
6. **Declare resolution** when the user-facing symptom is gone and stable — then schedule the postmortem.

## The discipline
- The IC role is about **decision-making and coordination, not seniority** — the most senior person is often
  better used as a resolver; separate the roles.
- Bias hard to mitigation: a clean rollback now beats an elegant fix in an hour. Reversibility is what makes
  this possible (`map-blast-radius`, `release-with-tested-rollback`).
- The incident ends at "users are okay." The *learning* happens in the blameless postmortem
  (`write-the-blameless-postmortem`) — don't try to do root-cause forensics while the building is on fire.
