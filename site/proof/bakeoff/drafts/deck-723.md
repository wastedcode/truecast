# truecast.dev — homepage copy deck

Owner: product-marketer · 2026-10-17 · for brand-designer (identity) → ui-ux-designer (the page)
Status: final copy (after one independent fact-check pass, 24 findings fixed: §13). Every number on the page traces to a line in §9 (claim ledger). Founder away: reversible
calls are taken and logged in §11 with the alternative.

**Read this first: what deploys.** The staged `site/index.html` in this working tree is **not** the page now on
truecast.dev. It's an older draft that would *replace* the live page (HEAD = main = live). It says "eleven"
teammates, dresses a real but unfinished session in an invented terminal UI with an invented GO verdict,
calls seven write-capable teammates "read-only by default", and fails
`scripts/brand/page.py --check`, which `pnpm test` runs. The working tree also deletes `site/404.html` (unstaged, but the
release commits the whole tree). §10 lists 20 false or unbacked claims in it, plus two regressions.
Don't ship any of its copy. This deck starts from the live page, which went through four review passes, and
replaces or fixes it line by line. Most of its section headlines stay, because I tried to beat each of them and couldn't (§3).

---

## 1. Who it's for, and the 5-second belief

**The reader.** A developer who already uses Claude Code most days. Solo, or on a small team with nobody whose
job is security, QA, architecture or product. They know subagents exist. Many have written an agent file, or
copied one from a free collection, and haven't touched it since. They arrive from the GitHub README, a link in
a thread, or a search for "Claude Code subagents". They're **solution-aware** (Schwartz): they know the
category, so the page's job is "why this one, why now", not "what's a subagent".

**What they do today (the real alternatives, strongest first):**
1. Ask the main session: "review this for security". Free, instant. The digging fills their own context
   and the answer ends however Claude feels like ending it.
2. Write their own agent file (`/agents`, or a Markdown file in `~/.claude/agents/`). Short, theirs. Nobody
   improves it but them.
3. Copy one from a free collection (VoltAgent's awesome-claude-code-subagents, wshobson/agents and others).
   Hundreds of roles, one file each. Their project notes go into that same file, so taking a newer version
   means redoing them. (Research notes, §12.)

**The 5-second belief** (what a cold reader must be able to say after the first screen):
> "It's a set of specialist subagents for Claude Code: security, QA, architecture and so on. Two commands to
> install. They tested theirs against a 76-word prompt and say straight out it found the same number of
> holes. What theirs did differently was end every review on GO or NO-GO."

**The one sentence the strongest skeptic will say after reading every receipt:**
> "On the one thing they measured, it tied a 76-word prompt, and it cost 19 cents more a run."

The page must still stand with that sentence printed next to it. So the page does **not** sell "it catches
more", or "it's deeper so it's better". It sells what survives that sentence: the twelve roles are already
written, each one is written to end on a decision, your project brief survives every update, and the
installer shows you every file before it writes. And the page prints that sentence itself, first.

## 2. Positioning (the source every line below derives from)

| Dunford component | truecast | Proof (shipped, checkable) |
|---|---|---|
| **Competitive alternative** | Asking the main session; your own agent file; a file from a free collection | §1 |
| **Unique attributes** | (a) Twelve role playbooks, already written: 11–24 Markdown files each that the teammate can open mid-task. (b) Each agent file asks for a specific closing deliverable: GO/NO-GO, ship/don't-ship, invest/pass. (c) A per-repo brief, `instance/mandate.md`, that no update writes. (d) Versioned updates you take with a plan. (e) An installer that prints the plan (version, tools, every path) and won't overwrite an agent file it didn't write, even with `--force`. (f) A native subagent: the digging happens in its own context. (g) MIT, no server. | (a) `personas/*/core`, counts in §9. (b) each `core/agent.md`. (c)(d)(e) captured output, §7. (f) Claude Code subagent docs + the Fig. 1 log. (g) LICENSE, `plugin/truecast/bin/truecast-plugin.sh` |
| **Value (what that gets them)** | A specialist's decision before you merge, ship or commit to something, without writing or maintaining the prompt, without filling your own thread, and without redoing your project notes when the role improves | Fig. 1 review; fair test |
| **Who cares most** | Claude Code developers shipping without a specialist on staff: solo founders, indie devs, small teams | the reader, §1 |
| **Market category** | Subagents for Claude Code (the platform's own word), sold as "expert teammates" | marketplace.json, README |
| **Relevant trend (why now)** | Claude Code ships subagents and plugin marketplaces, and free agent collections now run to hundreds of files. Writing roles is solved. Keeping them current without losing your project notes isn't. | §12 |

**Category language.** The tagline says *teammates*. The body says *subagent* wherever the reader needs the
mechanism, because that's the word Claude Code and its users use. One term per concept, page-wide:
- **teammate** = the thing you install and call (never "persona" on the page; "persona" is the code and authoring word)
- **playbook** = its author's `core/` files (never "craft", "skills dump" or "prompt")
- **brief** = your `instance/mandate.md` (never "mandate" in body copy; the path shows the filename)
- **installer** = the `truecast` plugin (never "the plugin" alone, which would collide with persona-as-plugin)
- Claude Code's **Skills** are a different thing. Say once that the playbook files "aren't Claude Code Skills".

**Discriminating proof, ranked** (what a rival couldn't truthfully copy):
1. **Fair test, n=6 per agent, byte-identical prompt:** catch rate tied (9 of 18 vs 9 of 18). It's the only agent
   of three to end every run on an explicit GO or NO-GO (6 of 6 vs 0 of 12). The candour is the proof: no
   rival homepage prints its own tie. `site/proof/rerun/README.md`
2. **A real review that found a real P0 in our own installer**, fixed in installer 0.1.1, with the report published
   unedited. This is the payoff artifact: the product doing the job. `site/proof/security-engineer.md`
3. **The install plan and the refusal, verbatim** (captured 2026-10-17, §7): the trust mechanism, shown rather
   than claimed.
4. **Context kept off your thread:** 66,578 tokens of context in the subagent, your session gets back the
   report of about 1,150 words. Receipt: `site/proof/fig1-usage.json` (§9, L3).
5. **Playbook size drawn to scale** against the 76- and 1,007-word agents. Supporting only, always labelled
   "size shows what's inside; it isn't a score".

**Cut as proof** (true or not, it doesn't move belief, or it fails the good-look check): GitHub stars (8),
Anthropic's 90.2% multi-agent research figure (a different system, and the same article reports ~15× the token cost),
"hundreds, shallow" about other collections, anything about the eleven untested teammates' results.

**Painkiller and loop: said out loud.**
- *Acuity.* For most readers this is a strong vitamin with one painful moment: "I'm about to merge / ship /
  decide, and nobody here does security (or QA, or product)." That moment is acute and frequent, and the
  workaround (ask the main session) is free. So the page has to win on the *call* and the *upkeep*, never on
  "smarter". Every section is aimed at that moment: "Pick the call you'd rather not make alone."
- *Loop.* The only built-in loop is `.claude/settings.json` in a repo: commit it and Claude Code offers the
  teammate to every collaborator. The channel is GitHub plus the Claude Code plugin marketplace. 8 stars, no
  public adoption: that's a **growth problem, not a copy problem**. The page can't fix it. (Founder/PM item
  in §11: run the fair test on a second teammate, qa or software-architect. "We tested one of twelve" caps
  belief in the other eleven more than any sentence can.)

## 3. How the headlines were picked

I wrote 34 hero headlines and 6 full narrative arcs, and read each one cold as the reader in §1, scored on five
criteria: says what it is in 5 s · names or implies the alternative · true for every visitor · survives the
skeptic sentence · sounds like the founder (plain, specific, no adjectives doing work). The top of the table:

| # | Headline | 5 s | Alt | True | Survives | Voice | Note |
|---|---|---|---|---|---|---|---|
| 1 | **The expert teammates Claude Code doesn't ship with.** | ● | ● | ● | ● | ● | Names the platform and the gap. Already the README, plugin listing and OG line, so keeping it costs nothing and keeps every surface on one story. "Expert" is the only soft word, and the subhead backs it with twelve named roles. **Winner.** |
| 2 | Claude Code, plus a security engineer, QA, an architect and nine more. | ● | ◐ | ● | ● | ● | The most concrete. Loses on rhythm and doesn't name the gap. **Used as the subhead's opening move.** |
| 3 | A second opinion before you merge, ship or raise. | ◐ | ● | ● | ● | ● | Names the moment. Doesn't say Claude Code or subagent, so it fails 5 s cold. **Used as the closing CTA's idea.** |
| 4 | Twelve specialists for Claude Code. Each one ends on a call. | ● | ◐ | ◐ | ● | ● | "Ends on a call" is tested for one of twelve. True as "written to end on", which is too long for a hero. |
| 5 | Stop rewriting agent files. Install the team. | ◐ | ● | ◐ | ◐ | ◐ | Imperative cliché, and presumes the reader rewrites (many never wrote one). |
| 6 | Specialist subagents, kept current, your notes left alone. | ● | ◐ | ● | ● | ◐ | True and complete, but a feature list and flat. |
| 7 | It tied a 76-word prompt. Here's why you'd still want it. | ◐ | ● | ● | ● | ◐ | Brave and shareable, but it opens on the tie before the reader knows what "it" is. **The idea moved to the proof section's headline.** |
| 8 | The reviewer that says GO or NO-GO. | ◐ | ◐ | ◐ | ● | ● | Only fits security-engineer. Undersells the other eleven. |
| 9 | Your Claude Code team, already hired. | ◐ | ✕ | ◐ | ◐ | ✕ | "Hired" over-promises. Cute. |
| 10 | Twelve playbooks you'd never write yourself. | ◐ | ● | ◐ | ✕ | ◐ | Dies to the skeptic sentence: you could write the 76 words that tied it. |

The other 24 (e.g. "Expert subagents for Claude Code", "Call a specialist by name", "Put a specialist on
every PR", "The missing roles on your team") lost on 5 s or on voice, or were a weaker version of one above.

**Section headlines kept from the live page.** I tried 4–8 alternatives each. These held: "It found a real hole in
our installer. So did a 76-word agent." · "A teammate is a playbook, your brief, and its own context window."
· "Two commands to set up. Then call it by name." · "Twelve teammates. Pick the call you'd rather not make
alone." · "You approve every file the installer writes." · "Put a specialist on the call you're about to make."
Kept means each beat every alternative I wrote. Being the incumbent wasn't the reason.

**What changes from the live page, and why:**
1. **Hero cut by about half.** The live hero runs four sentences plus a caveat paragraph under Fig. 1. The caveat
   (the session wrote the prompt; F2 can't be credited) is honest but belongs where Fig. 1 is discussed, not
   on the first screen.
2. **New block: "What you'd do instead".** A four-column comparison right after the proof. The live page answers
   "why not my own file / a free collection" only in the FAQ, below the fold, after the roster. Pierri's first
   rule: the alternative goes near the top.
3. **Every number re-sourced.** Five things on the live page are wrong or have no source (§10, L1–L4, L7–L9).
4. **Version floors kept and now sourced.** Claude Code's docs give 2.1.292 (shell) and 2.1.275 (in session). The page adds
   what to do if you're older.
5. **No `name@version` strings in visible copy.** Cloudflare rewrites them to "[email protected]" (live today).

---

## 4. The page, section by section

Notation: **H** headline · **B** body · **CTA** · **Artifact** = the real thing that carries the section, with
its source. Copy inside quotes is final. Punctuation is intentional: no em dashes in body copy (voice spec §8).
Commands are shown exactly as typed, one per copy button.

### 0. Head / meta / share card

- `<title>`: "truecast: expert teammates for Claude Code" (live, unchanged)
- meta description: "Twelve open-source specialist subagents for Claude Code: security, QA, architecture, product, design, sales. Each works from a playbook and reads a brief you keep in your repo; updates never change it. Every run of our fair test is published."
- og:title: "The expert teammates Claude Code doesn't ship with."
- og:description: "Twelve specialist subagents for Claude Code. We tested ours against a 76-word agent and published all 18 runs: it found as many holes, and only ours ended every run on GO or NO-GO."
- og:image: `/brand/og.png`. Brand-designer: check the card says nothing the copy above doesn't.
- Nav: "Proof" · "Install" · "Teammates" · "GitHub ↗"

### 1. Hero

**Purpose.** In 5 seconds: what it is (specialist subagents for Claude Code), the contrast with what they'd do
instead (the honest test result), and the first command. Above the fold on a 1280×800 laptop and on a
390-wide phone: H, subhead, proof line, the command. Fig. 1 can start below the fold on mobile.

- **Eyebrow:** "Open source · MIT · for Claude Code"
- **H1:** "The expert teammates Claude Code doesn't ship with."
- **Subhead:** "Twelve specialist subagents, already written: a security engineer, QA, an architect, a product manager and eight more. Type @ and pick one. Each works from a versioned playbook of Markdown files, and reads notes on your project that you keep in your repo. Updates never change your notes."
  (Users say "subagent" and "specialist", about 280 and 6 times in the research sample, and "teammate" about twice. So the H1 keeps the ownable word and the subhead says it in theirs.)
- **Proof line (the first-screen contrast):** "We gave three security agents the same prompt, six runs each: a 76-word one you could write yourself, a free one, and ours. Ours found as many holes as the 76-word one, no more. Only ours ended every run on a ship-or-don't call, GO or NO-GO, with each finding graded." Link: "All 18 runs →" (#proof)
- **CTA (primary):** command block + Copy button:
  `claude plugin install truecast --marketplace wastedcode/truecast`
  Caption under it: "Run it once, in your terminal. Then in Claude Code: `/truecast:install security-engineer`."
- **CTA (secondary, text link):** "Already in a session? →" (#in-session)
- **Small print beside the CTA:** "Free. Runs on your own Claude Code plan."

**Artifact: Fig. 1, a real review.** Not a mock-up. Render from `site/proof/security-engineer.md` and the session
log (§9, L3). Show:
- the label: "security-engineer 1.2.2 · claude-opus-5-5" (a space, not `@`: see L1)
- what was typed, verbatim and trimmed with an ellipsis: "› Use the security-engineer subagent for this. Task for it: review plugin/truecast/bin/truecast-plugin.sh … Can anything here get a user owned?"
  (Not an `@agent-` mention: that isn't how this run was started. `site/proof/README.md` has the exact text.)
- the ten tool calls as a quiet list (the live page's list is correct against the log: `totalToolUseCount: 10`)
- verbatim, from the report:
  - "Short answer: yes, someone can get owned."
  - "Verdict: NO-GO for `--project` until F1 is fixed. GO for the user-scope lane (install, update, list, remove without `--project`) once F2 and F3 are fixed, which are small changes." (Quote it whole. Cutting the GO half would misstate the verdict.)
  - "F1 — P0 for the `--project` lane. A malicious repo can write arbitrary content to any path the user can write. Confirmed."
- caption: "Fig. 1 · A real review of our own installer, 2026-10-16. Verdict and findings verbatim; paths trimmed. We fixed F1 in installer 0.1.1. Full report →"
  (link: `site/proof/security-engineer.md`)

Why this artifact: it shows the product producing the thing the reader hires it for, a decision with a
graded finding, on code they can read. A first screen that shows a teammate calling NO-GO on part of its own
maker's code earns trust a GO never could.

### 2. Proof: the fair test

**Purpose.** Let the skeptic check the hero's claim in one table, and say the loss first.

- **H2:** "It found a real hole in our installer. So did a 76-word agent."
- **B (lede):** "The review in Fig. 1 showed that a hostile repo could get its text written into your `~/.bashrc`. Then, on the code from before the fix, we gave one prompt, byte for byte, to three security agents: a 76-word one anyone could write, a 1,007-word one from VoltAgent's free collection (25,000+ GitHub stars as of October 2026), and ours. Six runs each."
- **Artifact: Fig. 2, the run grid.** Keep the live figure: 18 squares per hole, filled = raised. Rows and numbers
  exactly as `site/proof/rerun/README.md`:

  | | Hand-written · 1 file · 76 words | Free collection · 1 file · 1,007 words | truecast security-engineer · 21 files · 12,697 words |
  |---|---|---|---|
  | A hostile repo writes into your `~/.bashrc` (temp files) | 6 of 6 | 5 of 6 | 5 of 6 |
  | Agent files carry hooks the plan never showed | 1 of 6 | 1 of 6 | 2 of 6 |
  | Claude could run the commands unasked, with all of Bash allowed | 2 of 6 | 0 of 6 | 2 of 6 |
  | **All three holes** | **9 of 18** | **6 of 18** | **9 of 18** |
  | **Ended on an explicit GO or NO-GO** | 0 of 6 | 0 of 6 | **6 of 6** |
  | Average run | $0.85 · 3.7 min | $0.68 · 2.7 min | $1.04 · 4.3 min |

  Caption: "Fig. 2 · One prompt to all three, six runs each, 2026-10-16, on the code from before the fix. Scored on the three holes we fixed, decided before we read a report. One of our six ended CONDITIONAL GO."
- **B (the read):** "So at catching these, a short prompt held its own, at 85 cents a run against our $1.04. No run of any agent found all three. What only ours did was close every run on GO or NO-GO, with each finding graded by when to fix it. That comes from its agent file, and you could ask your own agent for the same. What 76 words don't give you is below."
- **Small print (one paragraph, collapsible on mobile):** "The free-collection agent is VoltAgent's `security-engineer.md`; we changed only its tools and model lines. Claude Code 2.1.301, claude-opus-5-5; in 8 runs Claude Code switched to claude-opus-4-8 partway, and a safety classifier interrupted 10. Details in the method. Fig. 1's prompt was written by the session, and only ours was asked about `~/.claude`, so its hooks finding can't be credited to the playbook. That's why we ran this test."
- **Links:** "All 18 reports and how we scored them →" (`site/proof/rerun/README.md`) · "Rerun it: the prompt, the repo commit and the agent files →" (`…#method`)
- **Fix note (disclosure safety, required):** "We fixed all three holes in installer 0.1.1. The test turned up a fourth: an update could write somewhere other than where its plan said. Two free-collection runs and one of ours raised it (free-3, free-6, truecast-4). Installer 0.1.2 or later fixes it. Already have truecast? `claude plugin list` shows your version; to update, see Later ↓"
  (Do **not** link `834b03d`: see L2.)

### 3. What you'd do instead (new)

**Purpose.** Put the reader's real alternatives next to truecast, honestly, before they scroll to the roster.
Each cell is checkable. No ticks or crosses (they read as a sales grid). Short words only.

- **H2:** "What you'd do instead."
- **Artifact: a four-column table** (on mobile it becomes four stacked cards, truecast last):

  | | Ask the main session | Your own agent file | A file from a free collection | A truecast teammate |
  |---|---|---|---|---|
  | Who writes it | Nobody: one line, every time | You | Its author | Its author, with numbered versions you choose to take |
  | Where the digging happens | In your session | Its own context | Its own context | Its own context |
  | How it ends | However Claude ends it | However you wrote it to | However its author wrote it to | On its role's call: GO or NO-GO, ship or don't, invest or pass (tested for security-engineer only) |
  | Your project notes | Your `CLAUDE.md`, or typed into the prompt | In the same file | Edit the file, and the next version replaces your edits or you stop taking new versions | In your own brief, which updates never change |
  | Installing it | Nothing to install | Nothing to install | Copy a file in, or install its plugin | Shows where it will write, then waits for your yes |
  | In our one test | Not tested | 9 of 18 holes (a 76-word file) | 6 of 18 holes (VoltAgent's) | 9 of 18 holes |

- **B (under the table):** "If your own file does the job, keep it. truecast won't install over it."
- **Constraint for the designer:** the "In our one test" row stays. Removing it would turn an honest table into a sales grid.
- Cell checks (§12): VoltAgent ships a copy script and category plugins. Its script overwrites with no existence
  check (`curl -sS "$url" -o "$dest_path"`, `cp … "$CLAUDE_AGENTS_DIR/$agent_file"`). aitmpl's CLI writes over
  `.claude/agents/` files unasked. Claude Code's docs say a plugin agent you want to change must be copied
  into `.claude/agents/`, and that copy no longer updates. None of the collections has a per-repo notes file
  separate from the agent. If that changes, change the cell.

### 4. What a teammate is

**Purpose.** Explain the three parts in one glance, each with a real artifact. This is the mechanism, and it
belongs after the reader cares.

- **H2:** "A teammate is a playbook, your brief, and its own context window."

**4a. The playbook.**
- **B:** "security-engineer's is 17 skills, 3 reference notes and its agent file: 21 files, 12,697 words of plain Markdown. It can open any of them mid-task; in Fig. 1 it opened two. They load only into that teammate. They aren't Claude Code Skills, and they don't crowd your session."
- **Artifact: Fig. 3,** the 21 files drawn as bands sized by word count (generated by `scripts/brand/build.py`, which
  `--check` keeps in sync). List-all toggle. Link: "Open the folder on GitHub ↗" → `…/tree/main/personas/security-engineer/core`

**4b. Your brief.**
- **B:** "The notes on your project from the top of the page are one file in your repo: `.truecast/agents/security-engineer/instance/mandate.md`. What the project is, what matters, where the bar is. A teammate installed with `/truecast:install` is told to read it first. No update changes it. No brief? It works from what you ask. Start one: step 4 ↓"
- **Artifact: Fig. 4,** where an update writes and where it stops: `~/.truecast/personas/security-engineer/` (the playbook, its author's, `1.1.0 → 1.2.2`) | a hard line labelled "updates stop here" | `your-repo/.truecast/agents/security-engineer/instance/mandate.md` (yours, "never changed by an update").

**4c. Its own context window.**
- **B:** "Each teammate runs as a native Claude Code subagent. In Fig. 1 it worked through 66,578 tokens of context in its own window, over 10 tool calls. Your session got back its report, about 1,150 words, and nothing else."
- **Artifact:** two bars to one scale: "its context · 66,578 tokens · 10 tool calls" vs "your session gets · the report, about 1,150 words". Caption: "From the session log of Fig. 1. Receipt →" → `site/proof/fig1-usage.json`
  - **Receipt:** `site/proof/fig1-usage.json` is now in the working tree (written from the session log by the marketer, 2026-10-17). If it's ever removed, cut the numbers. Without the receipt, cut the number and keep the sentence "The digging happens in its own context; your session gets back the report."
  - Units: don't put tokens on one bar and words on the other unless the axis says so. Preferred: draw the bars in tokens (66,578 vs the report's **output** 2,940 tokens, which includes 160 thinking tokens) and **print** the report as "about 1,150 words". The live page's "2,780 tokens" is output minus thinking, a derived number. Don't use it.

### 5. Install

**Purpose.** A command that works the first time, with what the user sees at each step, so nothing surprises them.
One command per copy button. Captured output is labelled "verbatim" only where it is.

- **H2:** "Two commands to set up. Then call it by name."

**Step 1 · In your terminal**
- Command: `claude plugin install truecast --marketplace wastedcode/truecast` [Copy]
- **B:** "That's the installer. Once per machine."
- **Check line:** "Needs Claude Code 2.1.292 or later (`claude --version`). Older? Run `claude update`, or use the two in-session commands under *Already in a session?*"
  (Floor sourced: Claude Code docs, discover-plugins: shell `--marketplace` "Requires Claude Code v2.1.292 or later". Verified working on 2.1.302.)
- **"You'll see, at the end"** (verbatim, captured 2026-10-17, Claude Code 2.1.302):
  ```
  ✔ Successfully added marketplace: truecast (declared in user settings)
  Installing plugin "truecast@truecast"...✔ Successfully installed plugin: truecast@truecast (scope: user)
  ```

**Step 2 · In Claude Code, in any project**
- Command: `/truecast:install security-engineer` [Copy]
- **B:** "Was Claude Code already open? Run `/reload-plugins` first. You'll see the plan before anything is written. Say yes, and it's ready."
- "Want a different one? Swap the name, or copy it from the twelve below ↓"
- **"The plan"** (verbatim, captured 2026-10-17, home shown as `~`, the machine-readable last line left off; scrolls sideways):
  ```
  plan: install security-engineer@1.2.2   (from your local marketplace copy)
    tools granted to @security-engineer: Read, Grep, Glob, Bash, WebSearch, WebFetch
    writes:
      craft    ~/.truecast/personas/security-engineer/1.2.2/core/
      record   ~/.truecast/personas/security-engineer/meta.json
      pointer  ~/.truecast/personas/security-engineer/current → 1.2.2
      agent    ~/.claude/agents/security-engineer.md
    nothing has been written yet.
    note: the agents directory does not exist yet — you will need to restart Claude Code once.
  ```
  **Engineering:** this block and the "Then" block below both contain `security-engineer@1.2.2`. Wrap **both** in `<!--email_off-->…<!--/email_off-->` (L1). They're verbatim output and can't be reworded. Then check the deployed HTML for "email-protection" and make sure it isn't there.
- **B (under the plan):** "Claude shows you this and asks before it writes. The last line appears only if you've never had a `~/.claude/agents/` folder. If you see it, restart Claude Code once before step 3."
- **"Then"** (verbatim):
  ```
  ✓ security-engineer@1.2.2 is ready — mention it as @agent-security-engineer, or type @ and pick it.
  ```

**Step 3 · Call it by name**
- Command (example): `@agent-security-engineer review the changes on this branch before I merge` [Copy]
- **B:** "Any teammate, any request. Type @ and pick it from the list, or type `@agent-` and its name. Either way that teammate takes the job."

**Step 4 · Give it your brief** (optional)
- Command (in your repo, macOS, Linux or WSL):
  ```
  f=.truecast/agents/security-engineer/instance/mandate.md
  [ -e "$f" ] && echo "$f exists; left as is" || curl -fsSL --create-dirs -o "$f" \
    https://raw.githubusercontent.com/wastedcode/truecast/main/personas/security-engineer/instance-template/mandate.md
  ```
  [Copy]
- **B:** "It saves the template (the project and its trust model, your job here, how you work) and leaves an existing brief alone. Fill it in. The teammate reads it first. For another teammate, swap `security-engineer` in both places."
  (Verified: the template URL returns 200 for all 12; §9.)

**<a id="in-session">Already in a Claude Code session?</a>** (collapsible)
- **B:** "On Claude Code 2.1.275 or later, this replaces step 1:"
  - `/plugin install truecast --marketplace wastedcode/truecast` [Copy]
  - "It shows where it's adding the marketplace from and asks first, then opens the plugin's details. Choose **Install for you**. Then `/reload-plugins`, then step 2."
- **Older Claude Code?** "Run these one at a time: `/plugin marketplace add wastedcode/truecast` [Copy], then `/plugin install truecast@truecast` [Copy]. The second opens the same panel."
  > Floors and the panel label are from Claude Code's docs (code.claude.com/docs/en/discover-plugins, 2026-10-17): in-session `--marketplace` "Requires Claude Code v2.1.275 or later"; the scope option reads "Install for you (user scope)".
- **Windows:** "Run Claude Code inside WSL and follow the same steps. Native Windows isn't tested yet."

### 6. Later: updates and removal

**Purpose.** The exit and the upkeep, before anyone has to ask.

- **H3:** "Take the improvements, or take it back out."
- **Take the improvements.** "Auto-update is off by default for third-party marketplaces, so updates come when you ask. In your terminal, then restart Claude Code:"
  - `claude plugin marketplace update truecast` [Copy]: "fetches new versions of every teammate"
  - `claude plugin update truecast@truecast` [Copy]: "updates the installer itself"
  - "Then, in Claude Code: `/truecast:update security-engineer` [Copy]. It shows the new version's plan first. Your brief is never changed."
- **Take it back out.** "In Claude Code: `/truecast:remove security-engineer` [Copy]. It lists what it will delete and waits for your yes. `/truecast:list` shows what you have."
  - "To remove the installer too: `claude plugin uninstall truecast@truecast` [Copy]. Remove your teammates first: uninstalling the installer leaves the files it put in `~/.claude/agents/`."
  - "To forget the catalog, which deletes Claude Code's copy of it: `claude plugin marketplace remove truecast` [Copy]"
  - "Your brief stays in your repo. None of these touch it."

### 7. The twelve

**Purpose.** Let the reader find the role for the call they're stuck on, and see what each one can touch.

- **H2:** "Twelve teammates. Pick by the question you need answered."
- **Sub:** "First time? Run step 1 above, once."
- **Artifact: Fig. 5, the roster.** Every playbook drawn to one scale, with the two Fig. 2 agents as reference
  bands (76 and 1,007 words). Caption: "Size shows what's inside. It isn't a score."
- **Per row:** name · `/truecast:install <name>` [Copy] · the call · "Its agent file asks for:" · "Can touch:" · "N skills · N files · N words" (generated by `page.py`; never hand-typed) · "See inside →" (`…/tree/main/personas/<name>/core`)
- Groups and rows (calls and "asks for" lines are from the live page, re-checked against each `core/agent.md`; "Can touch" is from `persona.toml` tools):

| Group | Teammate | The call | Its agent file asks for | Can touch |
|---|---|---|---|---|
| Build | software-architect | "How should this be built so it lasts?" | a design doc with a real diagram, and an ADR for each hard-to-change call | reads, writes files, web |
| Build | software-engineer | "Can I trust this code?" | code proven by trying to break it, shipped in small safe steps | reads, edits files, runs commands, web |
| Build | qa | "What breaks before a user finds it?" | a ship or don't-ship verdict, with the blocker list | reads, runs commands, web |
| Ship | security-engineer | "Can this get someone owned?" | findings at file:line, each graded, and a GO or NO-GO | reads, runs commands, web |
| Ship | infrastructure | "Will this hold up in production?" | commands that run first time, with how to undo them | reads, edits files, runs commands, web |
| Decide | product-manager | "Are we building the right thing?" | a validated spec, its success bar, and an acceptance verdict | reads, web |
| Decide | product-researcher | "What are users actually telling us?" | findings ranked by confidence, each with its receipts | reads, web |
| Design | ui-ux-designer | "Can people actually use this?" | user flows and a design it has rendered and checked at every size | reads, edits files, runs commands, web |
| Design | brand-designer | "Would anyone remember us?" | one brand idea, a mark tested at 16px, and the identity as tokens | reads, edits files, runs commands, web |
| Market | product-marketer | "Why would anyone care?" | the positioning, the copy, and a will-it-land verdict | reads, web |
| Market | sales | "Who would actually pay for this?" | a painkiller-or-vitamin verdict and a buyer profile, with the evidence | reads, web |
| Raise | vc-seed | "Would an investor write the check?" | an invest-or-pass call and the one risk it would underwrite | reads, web |

- **Footnote:** "'Can touch' sums up the tools each one declares; the install plan lists them exactly before you say yes. reads = Read, Grep (+ Glob) · writes files = Write · edits files = Edit + Write · runs commands = Bash, which can also change files · web = WebSearch + WebFetch. 'Its agent file asks for' is what its instructions tell it to hand back, not a result we've tested. Only security-engineer has a published test (Fig. 2)."

### 8. Trust

**Purpose.** Answer "why would I let some Markdown into my setup?" with mechanisms and captured output, not adjectives.

- **H2:** "Nothing is written until you say yes."
- **Card 1, "You see the plan."** "The version, the tools, and every place it will write. Then it waits. If it would replace a file it wrote before, it shows you the diff first." Artifact: the line "nothing has been written yet." · from the plan in step 2
- **Card 2, "Every tool is on the label."** "Five of the twelve can only read, search and fetch web pages. Seven can also run commands or write files. The 'Can touch' column and the install plan say which."
- **Card 3, "It won't overwrite an agent file you wrote."** "We put a hand-written `qa.md` in `~/.claude/agents/` and asked it to install qa. It refused:" Artifact (verbatim, captured 2026-10-17, paths trimmed to `…`, the machine-readable line left out):
  ```
  …/.claude/agents/qa.md exists and truecast did not write it.
  error: refusing to overwrite a file truecast did not generate: …/.claude/agents/qa.md
  ```
  "`--force` doesn't override that." (Verified: same refusal with `--yes --force`, exit 5.)
- **Card 4, "Nothing runs on our servers. We don't have any."** "The installer copies from the clone Claude Code already made from GitHub. truecast collects nothing. Teammates can search and fetch web pages, like any Claude Code agent with those tools."
  (All 12 declare WebSearch + WebFetch, so "Teammates", not "teammates with web tools".)
- **Maker line:** "Open source, MIT. Built by Inder Singh (wastedcode). Found a hole? SECURITY.md: we aim to acknowledge within 72 hours." → `…/blob/main/SECURITY.md`

### 9b. Questions

- **H2:** "Questions."
- **I already wrote an agent file. Why switch?** "truecast won't install over your file. What it adds: eleven more roles already written, a brief per repo that updates leave alone, versioned updates, and a plan before anything is written. To run ours next to yours, rename your file first."
  Then add: "Or install ours as its own plugin, `/plugin install security-engineer --marketplace wastedcode/truecast`, and call it `@agent-security-engineer:security-engineer`."
  (Form from the docs: "`@agent-` followed by the scoped name for plugin subagents, for example `@agent-my-plugin:code-reviewer`". The scoped name differs from your file's, so both can be installed side by side.)
- **What about the big free collections?** "We tested one: the 1,007-word security-engineer from VoltAgent's collection, same prompt, six runs. It raised 6 of a possible 18, against 9 for ours and 9 for the 76-word agent, and it was the cheapest at $0.68 a run. All 18 reports are unedited. It's one test, not a benchmark."
- **What does it cost?** "Nothing to install. Each teammate runs on Opus, on your own Claude Code usage (subscription or API key). At API prices, a review in our test averaged $1.04 for the whole session, against $0.85 for the 76-word agent."
- **Can it run on another model?** "Each one's agent file sets Opus. You can edit `~/.claude/agents/<name>.md`; the next `/truecast:update` shows you the diff and asks before replacing your change."
- **Won't subagents burn through my usage?** "A teammate runs only when you call it, or when Claude picks it for a job that matches its description. Its playbook loads into its own context, not yours. Each installed teammate does add its description (31 to 144 words) to the list Claude Code keeps so it knows when to delegate."
  > The research sample's top complaint is subagent token cost ("Sub agents burn a lot more tokens"). The live page never answers it. Word counts: `description:` in each `personas/*/subagent.md`.
- **Does it learn my project?** "Not on its own. A teammate installed with `/truecast:install` is told to read your brief first, every run, so what it knows about your project is what you've written there. Edit the brief and the next run picks it up."
- **Can my whole team get it?** "Yes. Merge these two keys into the repo's `.claude/settings.json`, and Claude Code offers the teammate to anyone who trusts the folder:" (JSON exactly as README) "Installed this way it's namespaced by its plugin, so you call it `@agent-product-manager:product-manager`, and updates come with the marketplace, without the plan step. Only commit this for a marketplace you control."
  (Docs-confirmed form. README's `product-manager:product-manager` is the scoped name the typeahead shows, also correct.)
- **Can I write my own?** "Yes. A teammate is a folder of Markdown and one `persona.toml`. Authoring guide → Open a PR to add it to the catalog."
- **Is there a CLI?** "Yes: `npm install -g @wastedcode/truecast` adds installs from any git URL, plus `doctor` and `prompt`. npm serves 0.2.0, which can't yet update or remove a teammate the installer put in. Docs →"
  > Required: CHANGELOG has 0.3.0 "unreleased" and npm `latest` = 0.2.0 (checked 2026-10-17). Without this answer a reader takes the README's 0.3.0 features for what `npm install` gives them.
- **Small print:** "The installer and the file formats are pre-1.0 and may change between minor versions."

### 10. Close

- **H2:** "Try one on the change you're about to merge."
- **CTA:** the step 1 command block again with its Copy button, then "Then `/truecast:install security-engineer`" · secondary "Read the source on GitHub →"
- **Feedback line:** "Used one? Tell us what it caught, or missed →" (`…/issues/new/choose`, which resolves: `.github/ISSUE_TEMPLATE/` exists)

### 11. Footer

"truecast · MIT · © 2026 Inder Singh" · GitHub · Docs (`…/blob/main/docs/README.md`) · Changelog · Security · Issues

---

## 5. Microcopy

- Copy button: "Copy" → "Copied" (2 s) → "Copy". On failure: "Press ⌘C" / "Press Ctrl+C". No exclamation marks.
- Command blocks: no `$` before slash commands. `$` only before shell commands, and outside the copied text.
- 404 (restore `site/404.html` from HEAD, which the staged tree deletes): "Not here." / "That page doesn't exist. The homepage is →"

## 6. Voice spec (for this page; hold every line to it)

- **Register:** a maker telling a peer what happened. Short declaratives. Numbers with their units. Admits the
  loss before the win.
- **We say:** found, raised, caught, tied, held its own, the call, plan, brief, playbook, teammate, receipts,
  "we fixed it", "you could ask your own agent for the same".
- **We never say:** seamless, powerful, supercharge, unlock, elevate, world-class, "not a costume", "not just X, it's Y",
  "deep" as a boast, "scoreboard", "shallow" (about others), "phones home", "read-only by default", "AI-powered".
- **No:** em dashes in body copy, triads as reflex, rhetorical questions in headlines (FAQ excepted),
  exclamation marks, emoji.
- **Reference sample** (live page, kept): "So at catching these, a short prompt held its own." That's the voice.

## 7. Captured outputs used on the page (how they were produced)

All captured 2026-10-17 on Claude Code 2.1.302, in a throwaway `HOME`, from GitHub main (`90b49d8`, installer
`0.1.2`, security-engineer `1.2.2`):
1. `claude plugin install truecast --marketplace wastedcode/truecast` → the two ✔ lines in step 1.
2. `bash ~/.claude/plugins/marketplaces/truecast/plugin/truecast/bin/truecast-plugin.sh install security-engineer` (what `/truecast:install` runs in its Step 1) → the plan in step 2, exit 0.
3. the same with `--yes` (its Step 3) → the "✓ … is ready" line.
4. a hand-written `~/.claude/agents/qa.md`, then `install qa` and `install qa --yes --force` → the refusal, exit 5 both times.
5. `claude plugin marketplace update truecast` → "✔ Successfully updated marketplace: truecast"; `claude plugin update truecast@truecast` → "✔ truecast is already at the latest version (0.1.2)."; `claude plugin list` → `truecast@truecast · Version: 0.1.2`.
6. `remove security-engineer` (plan only) → lists both DELETE paths and "nothing has been written yet."
7. `npx @wastedcode/truecast@0.2.0 prompt security-engineer` and `list` against the installer's install → both work (prompt prints the body; list shows it).

Not captured here: a live `@agent-security-engineer` turn inside an interactive session (the published Fig. 1
and 18 runs are the outcome proof), and the in-session `/plugin` panel.

---

## 9. Claim ledger (every number and absolute on the page → source)

| # | Claim | Source | Status |
|---|---|---|---|
| N1 | Twelve teammates | `.claude-plugin/marketplace.json` (12 persona plugins + installer) | ✓ |
| N2 | security-engineer 1.2.2 · 17 skills · 3 notes · 21 files · 12,697 words | `persona.toml`; `find core -name '*.md' \| wc` = 21 / 12,697 | ✓ |
| N3 | Per-teammate skills/files/words | `page.py` generates; recount 2026-10-17 matches the live page for all 12 | ✓ |
| N4 | 76 words · 1,007 words | `site/proof/handwritten-agent.md`, VoltAgent file; `build.py --check` passes | ✓ |
| N5 | Fig. 2 grid, totals, averages | `site/proof/rerun/README.md` tables | ✓ |
| N6 | "only one to end every run on GO or NO-GO" (6/6 vs 0/12) | rerun table "how it ended" (truecast-6 = "CONDITIONAL GO", which counts as an explicit GO) | ✓ |
| N7 | 8 of 18 switched to opus-4-8 (4/2/2) | rerun README, Method | ✓ |
| N8 | Classifier interrupted 10 runs (4/3/3) | rerun README, Method | ✓ |
| N9 | Fourth hole raised by free-3, free-6, truecast-4 | grep of the three reports (§10, L4) | ✓ (live page wrong) |
| N10 | Fig. 1 verdict/finding lines | `site/proof/security-engineer.md`, verbatim | ✓ |
| N11 | 10 tool calls · 66,578 tokens · 2,940 output tokens (160 thinking) · report 1,159 words in the log, about 1,150 in the published copy (frame lines removed) | session log `16320711-…jsonl` (`totalToolUseCount`, `totalTokens`, `usage`); report = 1,159 words, matching the published file | ✓ locally; **publish the receipt** (L3) |
| N12 | Five read-only, seven can run commands or write | 12 `persona.toml` tool lists | ✓ |
| N13 | All 12 declare WebSearch + WebFetch | 12 `persona.toml` | ✓ |
| N14 | `1.1.0 → 1.2.2` in Fig. 4 | git history of `personas/security-engineer/core/persona.toml`: 1.1.0 at `c503506` (2026-06-07), 1.2.2 at `d70aa8d` (2026-10-16), nothing between | ✓ |
| N15 | Installer 0.1.1 fixed the three holes; 0.1.2 the fourth | CHANGELOG "Installer plugin 0.1.1 / 0.1.2"; `plugin.json` = 0.1.2 on main | ✓ |
| N16 | $1.04 / $0.85 / $0.68 · 4.3 / 3.7 / 2.7 min | rerun README | ✓ |
| N17 | SECURITY.md, 72 hours | `SECURITY.md:24` | ✓ |
| N18 | Template URLs for step 4 | `curl` → 200 for all 12 | ✓ |
| N19 | npm serves 0.2.0 | `npm view @wastedcode/truecast dist-tags` → latest 0.2.0 | ✓ |
| N20 | "Free" / MIT | LICENSE; no paid tier exists | ✓ |

**L3 receipt:** saved as `site/proof/fig1-usage.json` (prompt and report are already public; no secrets). (`totalTokens` = 2 + 1,523 + 62,113 + 2,940: the subagent's context at its last turn.)

## 10. Current-site claims that are false or unbacked

### A. The staged `site/index.html` (what would deploy from this tree)

| # | Claim on the page | Verdict | Evidence |
|---|---|---|---|
| S1 | "Eleven teammates", "Eleven deep teammates", meta "Eleven open-source expert teammates" | **False** | 12 in marketplace.json. brand-designer is missing from the roster. |
| S2 | "Copy the install (all 3 lines)… Pastes straight into Claude Code. No terminal, no npm." | **False** | One slash command per submit. `/plugin install truecast@truecast` opens a panel ("Install for you"). `/truecast:install` needs `/reload-plugins` in the same session. The recommended path is the terminal command. |
| S3 | "Read-only by default" (hero; "Least privilege" card) | **False** | 7 of 12 declare Bash, Write or Edit. |
| S4 | "nothing phones home" / "No server. Local files plus your own Claude session." | **Understates network use** | Setup clones from GitHub. All 12 teammates declare WebSearch + WebFetch. True form: "no truecast server; collects nothing". |
| S5 | "you read the exact prompt before you run it" / "`truecast prompt <name>` prints the exact prompt" | **Unbacked on the advertised path** | Needs the npm CLI, which the hero says you don't need. The install plan doesn't show the prompt (captured). |
| S6 | Hero terminal: "Claude Code v2.1.177 · Opus 4.8 (1M context) · Claude Max", "@security-engineer find me glaring gaps in this repo", "+5 tool uses", "Verdict: GO. Core trust surface is sound; both known escapes verified closed." | **Invented around a real prompt** | The prompt was real: a 2026-10-15 session (log `f40b124f…`, Claude Code 2.1.301, opus-5-5) that reviewed `src/` and **never finished**. There is no verdict to quote. The UI, version, model, tool count and the GO are made up, and the bare `@name` isn't Claude Code's mention form. The only published review of this code ended NO-GO with a P0. |
| S7 | "We point… it traces the trust boundary, verifies the containment holds… Same persona you'd install." | **False** | The real review found the containment broken (F1, P0). |
| S8 | Anthropic "90.2%" and "condensed, distilled summary" quotes | **Real quotes, misused** | About Anthropic's research system (Opus 4 lead + Sonnet 4 subagents). The same article reports ~15× chat token use, which the page leaves out. Not evidence about truecast. |
| S9 | "A 'senior architect' prompt takes four minutes." | **Unbacked** | No source. |
| S10 | "it gets better without costing you anything" | **False** | Runs cost money ($1.04 average, Fig. 2), and updates are commands you run. |
| S11 | "Your instance/ — the job you set, the notes it kept" + diagram "instance/notes" | **False** | Nothing writes notes. README: `work.md` "planned: nothing writes them yet". |
| S12 | Diagram "core/skills/ core/knowledge/ persona.md" | **False** | No `persona.md`. It's `agent.md` + `persona.toml`. |
| S13 | "you call it by its bare name: @security-engineer" (body, install block, first-run note) | **Wrong form** | Installer 0.1.2 prints "mention it as @agent-security-engineer, or type @ and pick it" (captured). A bare @name can resolve as a file (CHANGELOG 0.1.2). |
| S14 | "Updates come through the marketplace: /plugin marketplace update truecast, then /truecast:update" | **Incomplete, and it matters** | Leaves out `claude plugin update truecast@truecast` + restart. Installer 0.1.0/0.1.1 users stay on the `--project` bugs. |
| S15 | "Other marketplaces compete on the scoreboard — hundreds of plugins, thousands of skills… eleven built deep enough to trust" / "others: hundreds, shallow" | **Unbacked; punches down** | Our own test: depth didn't raise the catch rate (9/18 tie). Fails the good-look check. |
| S16 | Card lines stating outcomes: "Kills the feature that won't move the metric", "Proves reliability", "A hard line against slop", "writes words that land", "Verdict, not a pat on the head", "Assumes the worst and goes looking. Honest ship / don't-ship call.", "grades only reachable harm" | **Unbacked outcomes** | Only security-engineer has a published test. Use "Its agent file asks for…". |
| S17 | "Real skills it reads on the job" / "pulls real skills… on demand" | **Overstated** | Only 2 of 6 fair-test runs opened a skill. True as "it can open". |
| S18 | "Each is a real subagent… not a costume" | Tone, not truth | "not a costume" is the "not X but Y" tell; cut. |
| S19 | "$" prompt before slash commands in the install block | **Wrong** | Slash commands aren't shell. |
| S20 | Teammate count in roster groups (no brand-designer, no "Design" group) | **False** | See S1. |
| S21 | No favicon, fonts, og:image; `site/404.html` deleted | **Regression** | HEAD has all of them. |
| S22 | Page breaks the gate | **Release blocker** | `scripts/brand/page.py --check` → "index.html has no block for: close-cores, fig1-core, … roster, tree"; `pnpm test` runs it. |
| S24 | "It never touches a file it didn't write." | **False for `--project`** | That lane appends to the repo's `.gitignore` and creates the brief (both shown in its plan). True form: "It never overwrites a file it didn't write." |
| S23 | "Native. Anthropic's own mechanism, with only the tools the role declares." | ✓ true | Agent file `tools:` line (captured). Keep the idea. |

### B. The live page (HEAD = main = truecast.dev): what needs fixing

| # | Claim | Verdict | Evidence / fix |
|---|---|---|---|
| L1 | Fig. 1 label "security-engineer@1.2.2" | **Broken for no-JS readers** | Live HTML serves "[email protected]" (Cloudflare Email Obfuscation). Write "security-engineer 1.2.2"; wrap verbatim plan blocks in `<!--email_off-->`, or turn the setting off. |
| L2 | "We fixed all three holes… in 834b03d" (link `commit/834b03d`) | **Points outside main's history** | `git merge-base --is-ancestor 834b03d HEAD` fails. The fix reached main squashed into `d70aa8d` (#50). The URL resolves only through the PR ref. Cite "installer 0.1.1". The same link is in README.md and `site/proof/rerun/README.md` ("Same repo… `git archive 834b03d^`"); there it's a method fact and can stay, but the README's "we fixed it in 834b03d" should say installer 0.1.1. |
| L3 | "66,578 tokens… the 2,780-token report"; "All 10 tool calls" | **No published source** | Verified against the local session log (N11). "2,780" is output minus thinking, a derived number. Publish `site/proof/fig1-usage.json` (done) and use "about 1,150 words". |
| L4 | "One free-collection run and one of ours raised it [the fourth hole]" | **False** | free-3, free-6 and truecast-4: two free-collection runs, one of ours. CHANGELOG 0.1.2 has the same undercount. |
| L5 | "Claude Code 2.1.292 or later"; "On 2.1.275 or later" | ✓ **true** (no fix) | Claude Code docs, discover-plugins: shell "Requires Claude Code v2.1.292 or later", in-session "v2.1.275 or later". Works on 2.1.302 (captured). An earlier internal note called these unverified; the docs settle it. Only add the "older?" path. |
| L6 | "Installer 0.1.2 fixes all four" | Fine today, brittle | "0.1.2 or later". |
| L7 | Fig. 1 call line and Fig. 2 column header "@security-engineer" | **Wrong mention form** | Same as S13. Use "security-engineer" as a label and `@agent-security-engineer` only where the reader types it. Fig. 1 also wasn't started with an @-mention (see §4, hero artifact). |
| L8 | Trust card 3: "We pointed it at a repo that already had a hand-written security-engineer.md" | **Wrong location** | The refused file sits in `~/.claude/agents/`, in your home folder, not in a repo. Recaptured with `qa.md` (§7). |
| L9 | Meta description: "every test we ran is published" | **False** | Earlier tests, a ui-ux-designer run on Trivy and a first security-engineer comparison, aren't published. Say "every run of our fair test is published". |

**Linked surfaces that must move in the same change** (the README is committed with the page): README
"handed the session back a 2,780-token report" → "a report of about 1,150 words"; README's `834b03d` sentence → installer 0.1.1;
CHANGELOG 0.1.2's fourth-hole credit → add free-3. docs/install.md's floors are right; leave them.

## 11. Calls I made (founder away), each with the alternative

1. **Started from the live page, not the staged draft.** Alternative: polish the staged draft. Rejected: it's
   built on a fabricated transcript and four false safety claims.
2. **Kept the hero headline.** Alternative: "Claude Code, plus a security engineer, QA, an architect and nine
   more." Kept because #1 already runs on README, plugin listing and OG, and nothing beat it on all five scores.
3. **The tie stays on the first screen.** Alternative: move the test below the fold and lead with the roster.
   Rejected: the tie is the one fact a rival can't copy, and a dev audience trusts it over any adjective.
4. **In-session setup leads with the one-line `/plugin install truecast --marketplace …` (2.1.275+, from the docs)
   and keeps the two-step form for older versions.** Alternative: two-step only, which is simpler but one more command for most readers.
5. **Token bars ship only with the receipt.** Alternative: cut the context-window numbers entirely. A receipt
   costs one JSON file. The number is the most concrete answer to "why a subagent?".
6. **New "What you'd do instead" table.** Alternative: keep the comparison in the FAQ only. Moved up because
   the alternative belongs near the top; the FAQ keeps the long answers.

**For the founder / PM (not reversible by me):**
- **Test a second teammate** (qa or software-architect) the same way: n ≥ 6, byte-identical prompt, scored
  before reading. This is the biggest lever on belief. "Tested 1 of 12" caps the other eleven.
- **Ship CLI 0.3.0 to npm** or keep saying "npm serves 0.2.0" everywhere. The README now describes a CLI that
  `npm install` doesn't give you.
- **Answer four buyer questions the page can't yet:** how a teammate compares with Claude Code's built-in `/security-review`; whether it reads `CLAUDE.md`; how to stop Claude from delegating to it automatically; who maintains it if you can't. Each is worth a FAQ line once it's known.
- **Get listed in Anthropic's official marketplace.** It's the discovery channel (`/plugin` → Discover), and it's where Claude Code shows a context-cost estimate. Third-party marketplaces get neither.
- **Growth:** no loop beyond `.claude/settings.json`. Decide whether a "commit this to your repo" snippet
  earns a place in the hero for teams (my recommendation: no, it stays in the FAQ until there's a team user).

## 12. Research notes (frontier, alternatives, customer words)

Live research 2026-10-17. Full report: the research agent's output (sources linked inline there). What changed the copy:

**Frontier, the moves taken:**
- **Bun / uv / Warp:** the install command *is* the hero CTA, with the conditions in small print. → Hero CTA is the command, not "Get started" or a GitHub link.
- **Biome:** "97% compatibility with Prettier (see known limitations)". The limit sits next to the claim. → The tie sits in the hero proof line.
- **Warp:** cost printed next to quality ("95% correctness and $6.13 average cost"). → Fig. 2 prints $/run on the same grid.
- **Linear / Claude Code:** the hero shows the product doing one real job. → Fig. 1 is a real review, not a mock-up.
- **Raycast's extension grid:** cards with a name and a one-line job. → The roster leads with "the call it helps with".
- **uv:** "A single tool to replace pip, pip-tools, pipx…" names exactly what you stop using. → "What you'd do instead" table.
- **Evil Martians (100 dev-tool pages):** "No salesy BS"; "technical audiences need specificity and the lowest possible level of abstraction"; don't send the main CTA "right back to GitHub"; "You probably only need an FAQ". → GitHub is the secondary CTA only; the FAQ carries the objections.
- **Harry Dry:** "Can you visualize it? Can you falsify it? Can nobody else say this?" Every hero line passes all three: the grid, the numbers, the tie.
- **Pierri / Fletch:** hero = what it is + who for + a product picture + a trust element; the alternative belongs near the top.

**Flaws named in the exemplars, and avoided here:** an H1 that is only a product name (Claude Code), circular subheads (Vercel), unfalsifiable "best… for the AI era" (Tailscale), three CTAs (Cursor), hero art that teaches nothing (Stripe), a benchmark wall (Bun).

**Alternatives (live counts):** VoltAgent awesome-claude-code-subagents, 25,779★, "161+" agents (its own counts disagree: 100+/158/161+). wshobson/agents, 40,934★, 202 agents in 94 plugins, native plugin semver. davila7/claude-code-templates (aitmpl), 32,700★, 424 agent files, unversioned. Its CLI writes from unpinned `main` with no existence check. anthropics/claude-plugins-official, 315 entries, auto-update on by default. Built-ins: Explore, Plan, general-purpose. They beat truecast on breadth, stars and official-marketplace discovery. truecast wins on the separate brief, the plan-before-write and refuse-to-overwrite installer, and the published tie. The page doesn't name wshobson or aitmpl, because it hasn't tested them and naming them untested fails the good-look check.

**Customer words (30 verbatims; the ones that shaped copy):**
- "they did just as well as the main agent while being way more verbose" (HN). The objection the proof section answers head-on.
- "just adding 'act as a Senior Python engineer…'… to be nearly as good" (HN). Our own test agrees, and the page says so.
- "Sub agents burn a lot more tokens… I have yet to see real benefits" (r/ClaudeAI). → New FAQ on usage.
- "The thing a subagent actually buys you is a clean main context" (r/ClaudeAI). → §4c, with the receipt.
- "an agent that didnt write the code reviews it way more honestly than one grading its own homework" (r/ClaudeAI). The review moment the roster sells.
- "Starting subagents cold is a recipe [for] failure" (r/ClaudeAI). → The brief.
- "Looks good in theory but any evals?" (r/ClaudeCode, on a persona plugin). → Fig. 2 above the fold.
- "This is a system prompt, not an agent… Fabricated metrics" (a GitHub issue against VoltAgent, which its maintainer called "largely fair"). → Every number on the page has a receipt.
- "a compromised plugin runs immediately under the user's full shell privileges" (GitHub); "no re-consent or diff" on updates. → Trust cards and the update plan.
- **Vocabulary:** subagent (~280), skill (~64), specialist (~6), teammate (~2). → The subhead says "specialist subagents".

## 13. Outside judges: what they returned, what changed

**Round 1: an adversarial QA agent** (fresh context; given only this deck and the repo; told to prove it wrong,
re-derive every number, re-run the install in its own sandbox HOME). I picked it because it can disagree with
me on facts and has the tools to check them. It returned **24 findings**. Every count, version, grid cell and
captured output held. All 24 are fixed:
- Wording that widened a claim: og "same holes" → "as many holes"; "every test we ran is published" → "every run of our fair test" (an unpublished Trivy test exists); "only security-engineer has been tested" → "has a published test"; "every file" → "every path"; "no update ever writes to it" → "no update changes it" (`update --project` creates a missing brief); "20 cents" → "19 cents"; the truecast "How it ends" cell now says what its agent file *asks for*.
- Verbatim honesty: Fig. 1 now shows what was actually typed (no `@agent-` mention happened) and quotes the verdict whole, GO half included. Both `name@version` blocks get `email_off`.
- Audit accuracy: S6 reframed (real prompt from an unfinished session; UI and GO invented); S16 widened; S24 added ("never touches a file it didn't write" is false for `--project`); L7–L9 added; counts in the header and §3 corrected; the 404 deletion described correctly.
- Self-contradictions: the CLI answer (0.2.0 *can* list and run an installer install); "it opens what the job needs" → "it can open any of them"; the brief "asks what the project needs" → "works from what you ask".
- Research-dependent placeholders filled (§12); "most-starred" dropped (wshobson has more stars than VoltAgent).

**Round 2: a fresh general-purpose agent** doing two things: a cold read of §4 *as the buyer* (a skeptical
daily Claude Code user who worries about token cost and third-party plugins), plus a re-verification of 15+
claims against the repo. I picked it because round 1 checked facts, not whether the page lands. It returned
**28 findings**. 23 are fixed:
- Hero: the proof line now names all three agents (it had named two and linked "18 runs") and says what GO/NO-GO gets you ("a ship-or-don't call… each finding graded"); the subhead says "notes on your project" so "brief" isn't undefined on the first screen.
- Repetition cut: "updates never change your brief" now appears in the subhead, 4b and the update step only; the §2 triad is gone; the "76-word agent caught as much" echo is cut from the roster caption; the duplicate "$1.04" is cut from one FAQ; "keep it" is said once (§3).
- Truth: the §2 lede no longer implies the test ran on fixed code; Fig. 2's caption names the one CONDITIONAL GO; "Its author, once" → "Its author"; "keeps current" → "versioned"; auto-update wording matches docs ("off by default"); "a marketplace you control" matches the README; "every file" → "every place it will write" (the plan lists `core/`, not its 21 files); the trust H2 is now "Nothing is written until you say yes"; brief-reading is scoped to `/truecast:install` teammates (the persona-as-plugin lane only reads it "if they've given you one"); the report is "about 1,150 words" (what a visitor counts in the published copy).
- New answers: "Can it run on another model?" (verified: editing the agent file triggers a diff and confirmation on the next update, `drift=true`); remove teammates before uninstalling the installer (its files stay in `~/.claude/agents/`).
- Receipt: `site/proof/fig1-usage.json` written from the session log, so 4c's numbers are checkable.
- Close: "Try one on the change you're about to merge", with the command, instead of a generic line.

**Not taken, with the reason:**
- *"A teammate is a playbook, your brief, and its own context window" is a template triad.* Kept. It's the page's definition of its three nouns, and each one gets its own figure. Cutting it would bring back the "undefined term" finding.
- *"installer" means the script in §2 and the plugin in step 1.* Kept. The script is the installer's engine, so to the reader they're the same thing.
- *Collapse the in-session/older-version block into a docs link.* Kept, collapsed by default. A reader who's already in a session is the most common state, and sending them off the page costs the install.
- *Open questions I can't answer from the repo or docs, so no copy:* how it compares with Claude Code's built-in `/security-review` (untested); whether subagents read `CLAUDE.md`; how to stop Claude delegating automatically; the bus factor of a single maintainer. All four go to the founder (§11).

**Round 3:** none run. Both rounds' fact checks agree with the ledger on every number. The round-2 fixes are wording and scope changes, each checked against its source line above.

## Frontier check

- **Benchmark:** Bun, uv and Warp (install command as the CTA, cost next to quality); Biome (the limit sits beside the claim); Linear and the Claude Code page (the product doing one real job above the fold); Raycast (a catalog of one-line jobs); Evil Martians' 100-page study; Pierri and Fletch's hero formula; Harry Dry's three tests (§12).
- **Where it beats them:** none of them prints its own tie on the first screen with all 18 receipts. The proof here has Biome's candour and Warp's cost-beside-quality, run on Linear's real-job hero. Every command was run and its output captured (§7), which no exemplar shows.
- **Searched:** 34 hero headlines and 6 arcs scored on 5 criteria (§3), plus 4–8 alternatives per section headline. 30 customer verbatims and the vocabulary count shaped the subhead and the new FAQs.
- **Covered:** the founder's constraints (real artifacts only, claims checked against public channels: npm 0.2.0, installer 0.1.2 on main, docs floors, live links) plus the pre-empted asks: the alternative named, the skeptic sentence, one term per concept, the exit path, true cost, disclosure of the fix, the derived copies (meta, OG, README, CHANGELOG).
- **Critique caught:** 52 findings over two independent judges, 47 fixed and 5 declined with reasons (§13). Before that, my own audit found 20 false claims in the staged page and 9 on the live page (§10).
- **Verified:** install, plan, refusal, update, drift diff and remove all run in a sandbox HOME against GitHub main. Numbers recounted from the repo, proof files and session log. Docs quotes fetched live 2026-10-17.
