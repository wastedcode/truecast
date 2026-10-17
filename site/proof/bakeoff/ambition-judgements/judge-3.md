## 1. Riskiest and safest

**Riskiest: deck-727.** Two choices could backfire. Its hero card has two tabs, and one of them is a product-manager run on truecast's own roadmap ("Don't build `--pin` next"). That run was made for this deck, happened once, and its published receipt shows 18 npm downloads a month. It also has a section headed "This page was written, branded and built by three of them." That claim invites every visitor to judge the agents by the page they're reading.

**The strongest case for it:** every other deck admits the same weakness: one teammate out of twelve has been tested, and the page "says nothing about the other eleven." Seven of them stop there. deck-727 is the only one that answers it with something the visitor can check without trusting a benchmark: the page itself. Product-marketer, brand-designer and ui-ux-designer each did their part, and each hand-off would be published under `site/proof/homepage/`. No developer-tool homepage can say this.

- **It can't turn into a lie.** It ships only if three things are true at merge: the page came from this pipeline, the hand-offs are published, and every later human edit is listed. If any one fails, the section is cut.
- **The PM tab holds up.** I read the receipt. It gives the method, $0.64, 14 tool calls and a fact-check, and the report is verbatim, including the parts that don't flatter us.
- **The rest is the most rigorous in the set.** The security tab moved off the first review, because the main session wrote that prompt and asked for GO/NO-GO itself. It now uses fair-test run truecast-2 and labels it "one of our better ones." The 66,578-token figure, unsourced on the live page, now has its derivation published (`evidence/deck-727/site/proof/README.md`). gstack and `/security-review` are answered in their own words.

**Safest: deck-655.** **The strongest case against it:** it's a fact-check written up as a copy deck. It keeps the H1, the structure, the figures and nearly every headline. It cuts the one vivid number (the context-window bars) rather than publishing its source, and it adds no new evidence. Its boldest moves are a phrase ("The difference is the call, not the catch") and moving the team snippet out of the FAQ. The published tie it calls "the strongest trust asset" is already on the live page, so it brings no new argument. It would win a contest for fewest defects; this rubric is the other contest. Its own simulated cold reads also missed its own target on "an honest reason" (7/10 against a goal of 9).

## 2. Scores

| deck | its boldest idea (one line) | ORIGINAL | FRONTIER | HOLDS | MOVES | rank |
|---|---|---|---|---|---|---|
| deck-727 | "This page was written, branded and built by three of them": the homepage is the proof for the untested roles; plus a two-role hero (security NO-GO, PM "don't build --pin") | 9 | 8 | 7 | 8 | 1 |
| deck-723 | A "What you'd do instead" table near the top (main session / your file / a collection / truecast), with an "In our one test" row the designer may not remove; the skeptic's sentence written down first; a token receipt published (`fig1-usage.json`) | 6 | 7 | 9 | 7 | 2 |
| deck-370 | A measured context-cost table for every teammate (~60–250 tokens always on, ~3–6k when it takes a job), from Claude Code's own `claude plugin details`. It answers the top subagent complaint, token burn, with numbers anyone can reproduce | 7 | 6 | 8 | 7 | 3 |
| deck-953 | "Ask about the call you're about to make. Get the call back.": a second role's real verdict (PM: build the gate, with a kill rule), with its overreach marked | 6 | 6 | 8 | 6 | 4 |
| deck-736 | Headlines in the skeptic's own words: "Isn't it just a prompt? At catching holes, a short one tied it." / "You could write all twelve. You'd also have to keep them current." Also discloses that a cloned repo's brief is instructions you should read | 5 | 6 | 8 | 6 | 5 |
| deck-356 | Replaces the tuned H1 with "Put a specialist on the call you're about to make." Puts the tie and the 6/6 GO/NO-GO row side by side in a hero strip, and moves the step-3 example off `/security-review`'s turf | 6 | 6 | 6 | 6 | 6 |
| deck-400 | "You could write this agent yourself. Here's what you'd still be missing.", with "The playbook is ours. The brief is yours." | 5 | 5 | 6 | 5 | 7 |
| deck-655 | "The difference is the call, not the catch," and the repo-sharing loop gets its own section | 3 | 5 | 9 | 5 | 8 |

**Why some scores are lower:**
- **deck-356:** its claim ledger says `834b03d` is in main's history. It isn't; I checked, and `git merge-base --is-ancestor` fails. Its hero card also shows an `@agent-` header and a prompt that wasn't typed that way.
- **deck-400:** it links `834b03d`. Its meta description says "Every test we ran is published," which is false: the Trivy test was never published. It says "same holes found" when it was the same count, not the same holes. Its caption uses a `name@version` string, which Cloudflare's email obfuscation rewrites on the live site.
- **deck-370:** I confirmed `claude plugin details` exists and reports projected token cost, so its main idea holds.

## 3. The best idea, and a bolder version

**Best idea: deck-727's "this page was made by three of them."** It's the only idea that turns the visitor's current experience into the demo. It also covers eleven untested roles honestly, without claiming a benchmark.

**A bolder version: put the page in a fair test, and let visitors run it themselves.**
- **Ship the losing page too.** Publish the page plain Claude Code produced from the same brief next to the one the teammates made, with a toggle in the header: "Swap to the page vanilla Claude wrote." Below the toggle, publish the blind judges' scores, both drafts' defect lists and every human edit, with the same rule as the fair test: losses printed. This is the format truecast already uses for the 76-word tie, applied to the claim visitors are judging in real time. Right now no homepage can show this.
- **Make the test re-runnable.** Package it as an eval suite for the `claude plugin eval` command that's already in Claude Code (I found it in `claude plugin --help`). The page's last call to action becomes "Rerun this comparison on your machine," not "trust us."

{"ranks": {"deck-727": 1, "deck-723": 2, "deck-370": 3, "deck-953": 4, "deck-736": 5, "deck-356": 6, "deck-400": 7, "deck-655": 8}, "scores": {"deck-727": {"ORIGINAL": 9, "FRONTIER": 8, "HOLDS": 7, "MOVES": 8}, "deck-723": {"ORIGINAL": 6, "FRONTIER": 7, "HOLDS": 9, "MOVES": 7}, "deck-370": {"ORIGINAL": 7, "FRONTIER": 6, "HOLDS": 8, "MOVES": 7}, "deck-953": {"ORIGINAL": 6, "FRONTIER": 6, "HOLDS": 8, "MOVES": 6}, "deck-736": {"ORIGINAL": 5, "FRONTIER": 6, "HOLDS": 8, "MOVES": 6}, "deck-356": {"ORIGINAL": 6, "FRONTIER": 6, "HOLDS": 6, "MOVES": 6}, "deck-400": {"ORIGINAL": 5, "FRONTIER": 5, "HOLDS": 6, "MOVES": 5}, "deck-655": {"ORIGINAL": 3, "FRONTIER": 5, "HOLDS": 9, "MOVES": 5}}, "best_idea_deck": "deck-727"}
