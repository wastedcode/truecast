---
name: record-the-decision
description: Use when a call is hard-to-change or a one-way door (persistence, boundaries, public interfaces, the build/deploy path, a dependency) — record an ADR; immutable once accepted, linked from the code seam.
---
# Record the decision — the ADR, so no later call defeats this one

Architecture is *the decisions that are hard to change*. The point of recording one is that a later
decision must never **unknowingly defeat** an earlier one — the ADR is what makes the *why* survive past
the head that held it (Second Law: why > how).

## The shape (Nygard)
- **Title** — short + numbered: `0007: store money as integer minor units, never floats`.
- **Status** — proposed / accepted / superseded-by-NNNN.
- **Context** — the forces in play; what's true that makes this a real decision (not an obvious one).
- **Decision** — what we're doing, stated plainly.
- **Consequences** — what gets *easier* AND *harder*; what this now constrains downstream.
- **Alternatives rejected** — the serious options and *why not*. This is the part that stops future
  re-litigation; it is the reason the ADR exists.

## The discipline
1. **Write one when it's hard-to-change** — persistence format, a boundary, a public interface, the
   build/deploy path, a dependency/tech choice, anything a future engineer could accidentally undo.
2. **Don't ADR a two-way door** — reversible, cheap calls get decided fast and moved past; over-recording
   is its own failure.
3. **Immutable once accepted — supersede, never edit.** When the decision changes, write a new ADR that
   supersedes the old (link both ways). The log is only trustworthy if accepted records don't silently
   mutate; you keep a clear history of what governed the work and for how long.
4. **Link it from the code seam it governs.** An ADR no one can find from the code is invisible exactly
   when it's most needed — a one-line comment at the seam pointing to the ADR costs nothing and pays back
   permanently.
5. **Defer to the last responsible moment** — record at the point you have the most information; you sell
   options until you must close one.
6. **Keep them few.** Few irreversible calls, each recorded — the goal is a small hard-to-change surface,
   not a large documented one.

Where they live: in the repo (e.g. `docs/adr/NNNN-<slug>.md`), index kept current. The ADR-and-brief
templates are in `knowledge/adr-and-brief-templates.md`.
