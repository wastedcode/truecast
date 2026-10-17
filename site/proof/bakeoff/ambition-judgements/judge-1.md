## 1. Riskiest and safest

**Riskiest: deck-727.** It takes three risks the others avoid:
- **Two real calls in the hero.** The hero holds two real outputs side by side: security-engineer's split NO-GO, and a new product-manager run that answered a roadmap question with "Don't build `--pin` next." The second run's full report shows 18 npm downloads a month.
- **The product's own words for a rival.** It names gstack (136k★) in the FAQ and quotes gstack's own description of itself.
- **"This page was written, branded and built by three of them."** A section saying three teammates made the page. It ships only if their hand-offs are published.

**The case for it.** Every other deck proves one role, security, and then says "it says nothing yet about the other eleven." 727 is the only deck that closes that gap above the fold, with a new run you can check (`evidence/deck-727/site/proof/product-manager/README.md` has the method, cost, all 14 tool calls, a fact-check, and the report verbatim).

The PM verdict is a real call. It disagrees with the question it was asked, and that makes "the call" feel earned rather than just announced. The "made by three of them" section turns the page itself into the demo: the reader is looking at the output while reading the claim. No Linear, Vercel, Stripe, Resend, Cursor or Bun homepage can say that about itself.

The risk is managed honestly. The section ships only with published receipts and is cut otherwise. The hero's security run is labelled "one of our better ones." The 66,578-token figure finally gets a published derivation.

**Safest: deck-370.** It keeps the live H1, the live order, the live headlines and the live proof. It fixes defects and adds a measured table of what each teammate costs in tokens.

**The case against it.** It is a very clean audit of the page truecast already has. Nobody skimming it would see a new reason to install. Its one addition, the token table, answers a question most visitors haven't asked yet, and it says itself that this isn't unique against other subagents. It never takes on the hard problem: only one of twelve roles has proof, and the one measured win is something "you could ask your own agent for."

Under this rubric, a defect-free deck with no new idea ranks last. Calling its tie-forward hero "the one place truecast can beat them" is inherited from the live page, not invented here.

## 2. Table

| deck | its boldest idea (one line) | ORIGINAL | FRONTIER | HOLDS | MOVES | rank |
|---|---|---|---|---|---|---|
| deck-727 | A two-tab hero with two real calls (security NO-GO plus a new PM "Don't build `--pin` next"), and "this page was written, branded and built by three of them," shipped only with receipts | 8 | 7 | 7 | 8 | 1 |
| deck-723 | A "What you'd do instead" table near the top (main session / your own file / a free collection / truecast) with a required "In our one test" row, plus the published token receipt `fig1-usage.json` | 7 | 7 | 9 | 7 | 2 |
| deck-356 | Retire the tuned H1 for the moment itself ("Put a specialist on the call you're about to make."), put the tie and the GO/NO-GO win together in a hero strip, and change the example away from what `/security-review` already does | 7 | 6 | 7 | 7 | 3 |
| deck-953 | A new, published product-manager run with a kill rule, giving a "Get the call back" section that shows range beyond security | 6 | 6 | 8 | 6 | 4 |
| deck-736 | "Isn't it just a prompt? At catching holes, a short one tied it." as the section headline, plus a trust section that warns a repo's brief can carry hostile instructions | 6 | 5 | 8 | 6 | 5 |
| deck-655 | Promote the team loop to its own section ("Commit a teammate to the repo…"), plus "The difference is the call, not the catch." | 5 | 5 | 8 | 6 | 6 |
| deck-400 | "You could write this agent yourself. Here's what you'd still be missing." plus "The playbook is ours. The brief is yours." | 5 | 5 | 6 | 5 | 7 |
| deck-370 | A measured table of each teammate's token cost, both always-on and when it takes the job | 3 | 4 | 9 | 4 | 8 |

How the ranks separate:
- **727 vs 723.** 723's idea holds best of all, but its table is a well-made category convention, the kind uv and Railway already use. 727 does something no rival page can copy.
- **356 vs 953.** 356 is the only deck that changes the H1, and the change holds. It loses HOLDS points for three slips:
  - it links `834b03d`, a commit that isn't on main;
  - it labels the hero card `@agent-security-engineer`, but that run wasn't started with an @-mention;
  - it shows a token figure that only becomes conditional later in the deck.
- **400 near the bottom.** Its idea weakens itself: the subhead leads with a "deep playbook" right after a tie on depth. The proof line says "Same holes found," which is wrong: the counts tied, the holes differed. The meta says "Every test we ran is published," which is false. It also links `834b03d`.

## 3. Best idea, and a bolder version

**Best idea: deck-727's "This page was written, branded and built by three of them."** It is the only idea in the eight that turns the visitor's current experience into the proof. It also directly attacks truecast's real weakness: eleven of the twelve roles have no evidence. And it can be checked, because it ships only with the hand-offs published.

**Bolder version: publish the bake-off.** "We had eight homepages written for this page and judged them blind. This one won. Here are the other seven, the judges' scores and the rubric." Every section of the live page gets a margin note with three things:
- which teammate wrote it;
- what it rejected, with its scored headline search;
- what the fact-checkers caught and what the founder changed afterwards.

Then add one command, `/truecast:install product-marketer`, plus the exact brief, so a visitor can make a ninth deck for their own product and compare. That takes the "we published our tie" candour from one security test to the whole page: the losing drafts are shown too, and the page can be rerun.

{"ranks": {"deck-727": 1, "deck-723": 2, "deck-356": 3, "deck-953": 4, "deck-736": 5, "deck-655": 6, "deck-400": 7, "deck-370": 8}, "scores": {"deck-727": {"ORIGINAL": 8, "FRONTIER": 7, "HOLDS": 7, "MOVES": 8}, "deck-723": {"ORIGINAL": 7, "FRONTIER": 7, "HOLDS": 9, "MOVES": 7}, "deck-356": {"ORIGINAL": 7, "FRONTIER": 6, "HOLDS": 7, "MOVES": 7}, "deck-953": {"ORIGINAL": 6, "FRONTIER": 6, "HOLDS": 8, "MOVES": 6}, "deck-736": {"ORIGINAL": 6, "FRONTIER": 5, "HOLDS": 8, "MOVES": 6}, "deck-655": {"ORIGINAL": 5, "FRONTIER": 5, "HOLDS": 8, "MOVES": 6}, "deck-400": {"ORIGINAL": 5, "FRONTIER": 5, "HOLDS": 6, "MOVES": 5}, "deck-370": {"ORIGINAL": 3, "FRONTIER": 4, "HOLDS": 9, "MOVES": 4}}, "best_idea_deck": "deck-727"}
