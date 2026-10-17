I checked every number and command against the repo at `90b49d8`, `site/proof/` and the live channels, and found 9 issues: 0 blockers, 2 material and 7 tweaks. Everything else checks out:
- **Playbook data:** skill, file and word counts and versions for all 12 roles match.
- **Fair-test numbers:** every Fig. 2 cell, cost, model note and interruption count matches.
- **Fig. 1:** the verdict and the three finding headings match `truecast-2.md` word for word.
- **Installer outputs:** the plan, ready line, refusal and `--force` behaviour match a run of the script in a throwaway `HOME`.
- **Commands walked:** I ran `claude plugin install truecast --marketplace wastedcode/truecast` on Claude Code 2.1.302; it cloned `90b49d8` and installed 0.1.2. The two update commands and the step 4 curl, including its "exists; left as is" branch, also ran as written.
- **Live channels:** npm serves 0.2.0, the repo has 8 stars and an MIT licence, the `834b03d` commit URL returns 200, and the three Hacker News quotes exist.

| # | class | severity | where in the deck | what's wrong, with the evidence |
|---|---|---|---|---|
| 1 | RECEIPT | material | §5.1 CTA caption "Claude Code 2.1.295+", §5.5 step 1 "2.1.295 or later" | Nothing in the repo or the proof backs 2.1.295. README.md:43 and docs/install.md:7 both say 2.1.292. The deck's only support is help output from 2.1.289 and 2.1.295 that isn't captured anywhere. The page would ship a version floor that contradicts the README and docs visitors read next, and §6 itself leaves the fix as an open "Engineer item". |
| 2 | MISS | material | §5.5 "Already in a Claude Code session?" and §5.8 "Can my whole team get it?" | Both are on the page as working paths, but §6 marks both "Not verified" and leaves them as QA items. The deck calls itself "final copy for the build", yet the team snippet (which it calls "the only distribution loop truecast has") and the "Install for you (user scope)" panel step were never walked. The Fig. 1 caption also still carries a conditional rewrite instruction, so the copy isn't final. |
| 3 | WIDER | tweak | §5.5 "The installer doesn't run on native Windows." | README.md:77–78 only says "native Windows isn't tested yet". The page states as fact something that has never been tested. |
| 4 | WIDER | tweak | §5.1 proof line under the CTA | This summary gives the tie and the GO/NO-GO advantage but leaves out the one place it lost: $1.04 a run against $0.85 (`site/proof/rerun/README.md` summary table). The cost only appears further down, in §5.2. |
| 5 | WIDER | tweak | §1 five-second belief "Two commands", §5.1 sub "…then you type @ and pick it in any project" | On a machine without `~/.claude/agents/`, the installer's own plan says "you will need to restart Claude Code once" (captured from a fresh `HOME`). An open session also needs `/reload-plugins`. The hero copy promises two commands and leaves out the restart. |
| 6 | NAMES | tweak | §5.5 step 2 plan artifact versus §4 mention-form rule and §5.5 step 3 | The verbatim plan prints `tools granted to @security-engineer:` (`truecast-plugin.sh:748`), the bare form the deck says never to show. The same page then teaches `@agent-security-engineer`, so two mention forms appear side by side. The deck flags this as an engineer item but ships the artifact anyway. |
| 7 | NAMES | tweak | §5.5 plan artifact "craft …/core/" versus §5.3 "The playbook", Fig. 4 | The same folder is called "craft" in the plan output and "playbook" everywhere in the page copy, with no line connecting the two. |
| 8 | NAMES | tweak | §5.1 H1 "expert teammates" / sub "Twelve specialists" / §5.9 "Put a specialist…" / nav "Teammates" | The product unit is called "teammate" and "specialist" interchangeably, against the deck's own voice spec ("Use 'teammate' on the page"). |
| 9 | FACT | tweak | §7b row L5 "two of the six were split, one conditional" | This contradicts §3 ("three of the six split the call by lane"). The repo agrees with §3: truecast-2:7, truecast-5:7 and truecast-6:57–58 each split GO and NO-GO by lane. |
| 10 | RECEIPT | tweak | §0 "`internal/deck-check.py` … recomputes every playbook number … and fails on a mismatch", and §7b L5 "`deck-check.py`" | No such file exists in the tree (`internal/` holds only PLAN.md, benchmarks, discovery, eng and personas). The deck's stated method for checking itself can't be reproduced. The numbers do check out by hand. |

The table has 10 rows. Row 1 counts once as RECEIPT, so the totals below come to 10, not 9.

{"total": 10, "blocker": 0, "material": 2, "tweak": 8, "RECEIPT": 2, "WIDER": 3, "FACT": 1, "NAMES": 3, "MISS": 1}
