---
name: usability-test
description: Use to validate that a design actually works for real people — when a flow is built or prototyped and you need to know if users can do the job. Watch them attempt real tasks, stay silent, and let behavior (not opinion) surface the problems.
---
# Usability test — watch them try, then fix what breaks

The cheapest way to find out a design fails is to watch one person try to use it. **Five users surface
~85% of usability problems** (Nielsen) — so test early, test small, test often, fix, and test again.
Diminishing returns past ~5 mean it's better to run three tests of five than one test of fifteen.

## The method
1. **Pick real tasks, not features.** Frame what to test as a goal the user has — "Find out why your last
   build failed and re-run it" — never "use the build panel." A task reveals whether the flow works; a
   tour reveals nothing.
2. **Recruit ~5 representative users** per round. Rough match to the real user beats a perfect match you
   can't schedule. (No external users yet? Watch a colleague who hasn't seen it, or yourself going cold —
   labeled as the weak substitute it is.)
3. **Give the task, then shut up.** The hardest discipline: do not explain, do not lead, do not rescue.
   Silence is data. "What are you trying to do right now? What did you expect to happen?" — open, never
   leading.
4. **Watch behavior, weight it over opinion.** Where they hesitate, misread a label, click the wrong
   thing, give up, or say "wait, where did it…" — *that* is the finding. What they *say* they liked at the
   end is the least reliable signal.
5. **Note severity, not just presence.** Rank each issue: does it block the task (critical), slow it
   (major), or annoy (minor)? Fix critical/major first.
6. **Fix and re-test.** A usability test you don't act on is theatre. Close the loop.

## When to use which evaluation
- **No users available, need a fast read** → `heuristic-evaluation` (expert audit) — cheaper, catches the
  obvious; usability testing catches what experts can't predict.
- **Best practice:** heuristic-evaluate first to clear the obvious, then usability-test to find the real
  surprises. They are complementary, not substitutes.

## The discipline
- Usability testing is **evaluative** — it validates a design; it is *not* discovery (don't use it to
  find out what to build; that's `research-the-user`).
- Test the longest plausible name, the slowest network, the error path — not just the demo data.
- Your job is to find the *no*. A test where nothing went wrong usually means the task was too easy or you
  rescued them. Be adversarial about your own design.
