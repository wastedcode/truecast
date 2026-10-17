I've read all eight decks, the rubric and the evidence, and checked each deck's new receipts against the repo. Here is the judgement.

## 1. Riskiest and safest

**Riskiest: deck-727.** It does four risky things at once:
- Its hero is a tabbed card with two calls from two teammates. One is a new product-manager run whose published receipt shows truecast had 18 npm downloads in a month.
- It names gstack in the FAQ.
- Its subhead says "Six of them end on a call", deliberately scoped to six of the twelve.
- It has a conditional section headed "This page was written, branded and built by three of them."

**Strongest case for it:** it's the only deck that shows the product's range without claiming it. Every other deck admits "tested on one of twelve" and stops there. 727 puts a second role on the first screen: product-manager saying "Don't build `--pin` next", with a published, fact-checked receipt. It then makes the page itself the proof. A solution-aware skeptic can't argue with a page they're reading that says it was written by three of the teammates, with the hand-offs published.

The risk is handled properly. The "made by three" section only ships if the receipts are published under `site/proof/homepage/`, and otherwise it is cut whole. The awkward part of the PM receipt is linked unedited rather than hidden. The fair-test run in tab 1 is labelled "one of our better ones." The deck also published the derivation behind the 66,578 / 2,780 token figures in `site/proof/README.md`, which brings them back with a source. None of the six benchmark homepages (Linear, Stripe, Vercel, Resend, Cursor, Bun) has a section that says the page was made by its own product.

**Safest: deck-400.** It is HEAD's live page, re-audited. It keeps the H1, the test section, the roster, the install steps and the trust section. Its one structural addition is a "You could write this agent yourself" comparison table. It has very few defects.

**Strongest case against it:** under this rubric, being correct isn't enough. 400 creates no new evidence, adds no new proof of range, and shows a visitor nothing they couldn't already see on truecast.dev today. Its own close admits the test "says nothing yet about the other eleven", and it does nothing to change that. Its comparison table is weaker than 723's, which adds a locked "In our one test" row. It also keeps the `834b03d` link that three other decks caught as not being in main's history. It is a careful edit, not an idea.

## 2. Scores and ranking

| deck | its boldest idea (one line) | ORIGINAL | FRONTIER | HOLDS | MOVES | rank |
|---|---|---|---|---|---|---|
| deck-727 | "This page was written, branded and built by three of them," gated on published hand-offs, plus a two-role hero card with a new PM receipt | 9 | 8 | 7 | 9 | 1 |
| deck-723 | A "What you'd do instead" grid whose "In our one test" row (the tie) must never be removed, plus a published `fig1-usage.json` receipt and a token-burn FAQ | 7 | 8 | 9 | 8 | 2 |
| deck-370 | A measured context-cost table: each teammate costs about 60–250 tokens per session until called and about 5k in its own context when it takes the job ("run it yourself") | 8 | 7 | 8 | 7 | 3 |
| deck-953 | "Ask about the call you're about to make. Get the call back." A second role with a new receipt, which corrected our prompt and had its own overreach marked | 6 | 6 | 9 | 7 | 4 |
| deck-356 | Swaps the H1 for "Put a specialist on the call you're about to make" and says "Claude Code already reviews your diff. These cover the rest of the job." | 6 | 6 | 6 | 7 | 5 |
| deck-655 | "The difference is the call, not the catch," plus the team loop promoted to its own section | 6 | 6 | 8 | 6 | 6 |
| deck-736 | The H2 "Isn't it just a prompt? At catching holes, a short one tied it," plus a trust card warning that a brief is instructions, so read one you didn't write | 6 | 5 | 7 | 6 | 7 |
| deck-400 | A "You could write this agent yourself" comparison table, otherwise HEAD refined | 3 | 5 | 9 | 5 | 8 |

Notes on how the defects counted:
- **356:** its idea stands, but its claim ledger is wrong in two places. It says `834b03d` is in this branch's history, and it says "In the review above it opened two" with no published log behind it. The hero card also labels a run `@agent-security-engineer` when that run wasn't an @-mention.
- **736:** it changes the version floor to 2.1.295. 723 cites Claude Code's docs for 2.1.292, so 736 is more cautious than the source needs. That doesn't break its idea.

## 3. Best single idea, and a bolder version

**Best idea: deck-727's "This page was written, branded and built by three of them,"** shipped only if the receipts are public. It is the one proof of range that a rival can't copy and a visitor can check without leaving the page.

**Bolder version: publish the page's own review history.** Every section would link to the run that wrote it (teammate, version, cost, prompt). The page would also carry the verdict its own teammates gave the previous draft. All eight decks independently found the staged page's invented "Verdict: GO" terminal and called it a ship-blocker, so the headline would be something like "Our teammates blocked the last version of this page. Here's the NO-GO, and what we changed." It would end with one command that runs the same three teammates on the visitor's own landing page. The homepage then becomes a benchmark anyone can rerun, not just a claim.

{"ranks": {"deck-727": 1, "deck-723": 2, "deck-370": 3, "deck-953": 4, "deck-356": 5, "deck-655": 6, "deck-736": 7, "deck-400": 8}, "scores": {"deck-727": {"ORIGINAL": 9, "FRONTIER": 8, "HOLDS": 7, "MOVES": 9}, "deck-723": {"ORIGINAL": 7, "FRONTIER": 8, "HOLDS": 9, "MOVES": 8}, "deck-370": {"ORIGINAL": 8, "FRONTIER": 7, "HOLDS": 8, "MOVES": 7}, "deck-953": {"ORIGINAL": 6, "FRONTIER": 6, "HOLDS": 9, "MOVES": 7}, "deck-356": {"ORIGINAL": 6, "FRONTIER": 6, "HOLDS": 6, "MOVES": 7}, "deck-655": {"ORIGINAL": 6, "FRONTIER": 6, "HOLDS": 8, "MOVES": 6}, "deck-736": {"ORIGINAL": 6, "FRONTIER": 5, "HOLDS": 7, "MOVES": 6}, "deck-400": {"ORIGINAL": 3, "FRONTIER": 5, "HOLDS": 9, "MOVES": 5}}, "best_idea_deck": "deck-727"}
