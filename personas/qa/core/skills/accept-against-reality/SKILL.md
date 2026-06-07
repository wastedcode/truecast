---
name: accept-against-reality
description: Use at the acceptance gate — verify the build by doing the user's flow yourself end-to-end and confirming persisted state, not by checking that "the parts exist per spec" or that a green suite ran.
---
# Accept against reality — do the flow, don't read the checklist

"The components are all built per the spec" is not acceptance — it's an inventory. A feature can have every
part present and still not *work*: the parts don't connect, the value never persists, the second step
overwrites the first. Acceptance is the act of confirming the **user actually gets what they were supposed
to get** — by becoming the user, end-to-end, against reality.

## How to accept
1. **Acceptance criterion → acceptance test.** Each AC may need several concrete tests; an AC isn't met
   until each of its tests passes *and* the implied unscoped states hold (`audit-the-journeys`).
2. **Do the whole journey yourself** — start to finish, as the user, through the **real surface** (the UI,
   the API, the CLI the user actually touches) — not the internal function, and not by trusting the
   author's demo.
3. **Verify persisted state, not the claim.** Re-read the result through the real read path (reload the
   page, re-query the record, log back in). The response that *says* "saved" is not proof it saved — the
   classic inert-feature bug lives exactly between the success message and the database.
4. **Test the boundaries of "done"** — the second time, the empty case, the error case, the returning
   user. Acceptance that only covers the happy path accepts a half-built feature.
5. **Confirm it against the oracle**, not against the author's expectations — you're verifying the *user's*
   intent (`reconstruct-the-oracle`), against which the AC itself can be wrong.

## Don't confuse the engineer's checks with your acceptance
The engineer's green suite is *checking* (known assertions). Acceptance is *verifying delivered value* —
you investigate whether the promise actually landed in reality. A passing CI run is a precondition, not the
verdict.

## The discipline
- "It runs / the demo worked / the tests are green" → keep going; **you** haven't done the flow yet.
- An AC that can't be objectively tested is itself a defect → route the ambiguity to product before you
  accept against it.
- Acceptance produces a verdict (`render-the-ship-verdict`), not a thumbs-up — say what you exercised and
  what you didn't reach.
