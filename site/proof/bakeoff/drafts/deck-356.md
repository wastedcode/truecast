# truecast.dev: homepage copy deck

Owner: product-marketer · 2026-10-17 · for brand-designer (identity) → ui-ux-designer (the page).
Everything here is the words, the order and the real artifact behind each claim. Layout and look belong to the next two
hand-offs. **Copy marked `verbatim` must ship exactly as written. The rest may change in line length but not in claim.**

---

## 0. What a visitor actually gets (checked 2026-10-17)

| Channel | Serves | How checked |
|---|---|---|
| truecast.dev (live) | the HEAD page ("Twelve specialists…", Fig. 1–5) | `curl https://truecast.dev` |
| GitHub default branch | `main` = `90b49d8` = this branch's HEAD | `git ls-remote --symref origin HEAD` |
| Installer plugin (`truecast@truecast`) | **0.1.2** | `plugin/truecast/.claude-plugin/plugin.json`; fresh install in a throwaway HOME cached `0.1.2` |
| Personas in the marketplace | 12; security-engineer **1.2.2** (all 12 versions in §7) | `persona.toml` + `/truecast:list` output in the throwaway HOME |
| npm `@wastedcode/truecast` | **0.2.0** (repo says 0.3.0, unreleased) · 18 downloads in the last month | `npm view`; npm downloads API |
| git tags | v0.1.0, v0.1.1, v0.2.0 | `git tag` |
| GitHub | 8 stars, 1 fork, 3 open issues | `gh repo view` |
| Claude Code `claude plugin install --marketplace` | present in 2.1.302; added in 2.1.292 | `claude plugin install --help`; 2.1.292 release notes |

**The working tree is not the live page.** `site/index.html`, `app.js` and `styles.css` are staged with an *older* page
("Eleven teammates", a made-up terminal, the Anthropic 90.2% stat) and `site/404.html` is deleted. If this branch merged
as it stands, it would replace the reviewed live page with that one. The ui-ux-designer's build replaces all three files, and
`404.html` has to be restored or rebuilt. §8 lists every false claim on both versions.

**I walked the install path for real** in a throwaway HOME (`<a throwaway HOME>`), on Claude Code 2.1.302:
step 1 succeeded, the installer printed the plan and wrote nothing, `--yes` installed, `/truecast:list` listed all twelve, it
refused to overwrite a hand-written `~/.claude/agents/qa.md`, and the step-4 brief one-liner fetched the template and then
left it alone on a second run. The outputs quoted below come from those runs.

---

## 1. Who it's for, and what they must believe in five seconds

**The reader.** A developer who already works in Claude Code every day, mostly alone or on a small team. They hit
decisions outside their expertise all the time: is this safe to ship, is this worth building, will this page land, would
anyone pay. Nobody is there to ask. They know what a subagent is. Many have pasted in a downloaded agent or written a
short one.

**Awareness and sophistication.** They know solutions exist (Schwartz: solution-aware), and they've seen a lot of them. GitHub
collections advertise 100+ agents (VoltAgent) and ~190 (wshobson/agents), so "expert agents" is a claim they have
learned to discount. Words like *expert*, *powerful* or *best* do nothing here. Only a mechanism they can check and
proof they can open will register.

**The 5-second belief (what the hero must leave behind):**
> "It's a set of specialist subagents for Claude Code: security, product, design, sales and more. Each one hands back
> what that specialist would, like a GO or NO-GO. Setup is two commands. And they published the test where theirs only tied a short prompt."

**Painkiller or vitamin, said out loud.** For most Claude Code users this is a **vitamin**. Claude Code already
ships `/code-review` and `/security-review` for the diff, plus Explore, Plan and general-purpose agents. It gets acute
at one moment: a solo builder about to make a call they aren't qualified for (ship the auth change, build the feature,
publish the page, pitch the investor). The page is written for that moment. Adoption today is 8 stars and 18 npm downloads a
month, so there is no social proof to show, and the page doesn't fake any.

**The loop / the one channel.** (1) *Repo ride-along:* one committed `.claude/settings.json` offers a teammate to
everyone who opens the repo. That's the only built-in spread, and the FAQ carries it. (2) *The honest test as the launch
story:* "We tested our agent against a 76-word prompt. It tied, and we published all 18 runs" is the shareable, citable
hook for Show HN and r/ClaudeAI. A page that hid the tie would have nothing anyone would forward. The page links every run
so the story survives a skeptic who opens the receipts.

---

## 2. Positioning (Dunford 5+1)

This is a hypothesis: no user interviews exist, and the customer verbatims below come from the platform's own vocabulary and
the reader's questions, not from transcripts. Label it that way until the first ten installs are interviewed.

| | |
|---|---|
| **Competitive alternatives** (what they do today) | 1. Ask the main Claude ad hoc ("review this for security"). 2. The built-ins: `/security-review` and `/code-review` on the diff. 3. Write a short agent file, or have Claude write one. 4. Download one from a free collection (VoltAgent, wshobson). 5. Make the call alone. |
| **Unique attributes** (shipped, checkable) | **A.** Each agent file sets what that specialist hands back: GO / NO-GO with graded findings (security), ship / don't-ship with a blocker list (qa), an ADR (architect), invest / pass (vc-seed), painkiller-or-vitamin (sales), an acceptance verdict (PM). **B.** Twelve roles in one catalog, most of them outside the code (product, research, design, brand, marketing, sales, investor), each a playbook of 11–24 Markdown files it opens mid-task. **C.** A brief you keep in your repo that updates never write. **D.** Installed by bare name in every project (`@agent-security-engineer`), with a plan shown before any file is written, and it never overwrites a file it didn't write. **E.** Every test published, including the one it tied. |
| **Value** | You get a specialist's call on a decision you'd otherwise make alone, from a role someone has already written. You skip writing and maintaining twelve agent files, and your project context survives every update. |
| **Proof that discriminates** | Same prompt, six runs each: **explicit GO or NO-GO in 6 of 6** truecast runs vs **0 of 6** for the 76-word agent and **0 of 6** for the 1,007-word free-collection agent (`site/proof/rerun/README.md`). True, and a competitor's page couldn't copy it. **Not** a discriminator: holes caught (9 / 6 / 9 of 18, a tie with the 76-word agent), so the page never sells catch rate. |
| **Who cares most** | Solo builders and small teams shipping with Claude Code, at the moment of a call outside their expertise. |
| **Category** | **Specialist subagents for Claude Code.** That is the platform's own noun, so readers already know where it plugs in. "Personas" is internal vocabulary: it stays in the authoring docs and off the homepage. "Teammates" stays as the friendly noun in body copy. |
| **Trend (+1)** | Subagents are Claude Code's own mechanism for keeping deep work out of the main thread. The page rides it as a fact, with no "AI-powered" language. |

**The skeptic's sentence, and why the lead survives it.** After reading every receipt, the strongest skeptic says:
*"It found exactly as much as a 76-word prompt, and cost $1.04 a run instead of $0.85."* The hero doesn't promise more
findings. It promises a specialist that's already written, for twelve kinds of call, ending on a verdict. The tie leaves
all of that standing, and the verdict is the one difference the test measured. **No copy may imply truecast finds more.**

**The real alternative the proof hasn't tested:** Claude Code's built-in `/security-review`. A savvy reader will think of it
first. The page answers it in the FAQ without any claim, and §9 asks for that test before the launch push.

---

## 3. Messaging house

**Core message:** *Put a specialist on the call you're about to make. Twelve of them, already written, for Claude Code.*

| Pillar | Claim | Proof on the page |
|---|---|---|
| 1. It makes the call | Each one hands back what that specialist owes you, like a GO or NO-GO | Fig. 1 verdict, verbatim; Fig. 2: 6 of 6 vs 0 of 12 |
| 2. Already written, twelve roles | Security to sales, each a playbook it opens on the job | Roster with real file / word counts and "See inside" links to `personas/<name>/core` |
| 3. Your brief stays yours | One file in your repo; updates never touch it | Fig. 4 + the mandate template; `/truecast:update` plan |
| 4. You approve every write | Plan first, tools on the label, never overwrites your file, no servers | Verbatim plan; verbatim refusal |
| Honesty, under every pillar | Every test published, the tie included | `site/proof/rerun/` (18 unedited reports) |

**One term per concept** (page, README, docs):
- **teammate** = an installed specialist (body copy). **specialist** = the role (headlines). **persona** = authoring docs only.
- **playbook** = `core/`. **brief** = `instance/mandate.md`. Never "notes", "memory" or "learns": nothing writes `work.md` yet.
- **installer** = the `truecast` plugin. Don't call it "the CLI" (that's the npm package, which lags at 0.2.0 and stays off the homepage except in the footer docs link).
- Mention form: **`@agent-security-engineer`**, or type `@` and pick it. Never a bare `@security-engineer` (Claude Code can resolve it as a file; CHANGELOG, installer 0.1.2).
- Claude Code's own "Skills" are a different thing. The page says *playbook*, and where it must name the files, "skills in its playbook" plus the line that they aren't Claude Code Skills.

**Voice spec.** It sounds like the founder: a working engineer, plain and specific, slightly dry. It says what happened and what didn't. Numbers
carry their subject. No hype adjectives, no "honestly", no "just", no exclamation marks, no "it's not X, it's Y", no stacked triads. Em
dashes stay rare. Sentences vary in length. Questions are in the reader's own words ("Is it safe to merge?").

---

## 4. Headline search (how the winner was picked)

I wrote 34 hero headlines across five angles: category, job/moment, discriminator, alternative, and literal command. I read
each cold as the reader and scored it on: says what it is · says why it's different · premise true for the reader · survives
the skeptic's sentence · in the reader's words · under 10 words. The finalists:

| # | Headline | Verdict |
|---|---|---|
| 1 | The expert teammates Claude Code doesn't ship with. *(current, tuned)* | Premise true (Claude Code ships reviewers, not a PM or designer), but there's no job and no outcome, and "expert" invites the catch-rate comparison it tied. Keep it as the README tagline and meta title. |
| 2 | **Put a specialist on the call you're about to make.** | **Winner.** The reader's moment in their own words. "The call" carries the measured discriminator (a verdict). It covers all twelve roles without overclaiming, and the tie leaves it standing. Already the live page's closing line, where it read strongest. |
| 3 | Ask a specialist before you ship. | Close second, but "ship" doesn't fit PM or vc-seed, and it reads like a review tool, a lane `/code-review` already owns. |
| 4 | Before you merge, ask @agent-security-engineer. | Concrete and shows the syntax, but it pigeonholes the product as security and invites "I have `/security-review`". |
| 5 | Twelve specialists for Claude Code, already written. | Clear, but vs. 130-agent collections the number is a weakness. Its idea moves into the sub-line. |
| 6 | Specialists for Claude Code that end on a decision. | Overclaims: brand, ux, engineer, infra and researcher hand back work, not a verdict. |

Also cut: "The team you don't have" (cute, vague), "Stop writing agent files" (attacks a choice the test showed works),
"A second opinion from a specialist" (Claude already gives opinions), plus 26 more weaker variants of these.

---

## 5. The page, section by section

Order is an argument: **hook → proof → range → how one works → install → trust → objections → CTA.** Each section makes
one point once. Target: about 45% fewer words than the live page. The live page ships three install blocks; this deck
ships one install section and one hero command.

### 5.0 Head and meta

- `<title>`: **truecast: specialist subagents for Claude Code**
- meta description / og:description (verbatim): **Twelve specialist subagents for Claude Code, already written. Each hands back what that specialist would, like a GO or NO-GO. Two commands to set up.** (149 characters, so search results won't cut it off. The published tests are on the page itself.)
- og:title: **Put a specialist on the call you're about to make.**
- Nav: `truecast` (home) · **Teammates** · **Proof** · **Install** · **GitHub ↗**

### 5.1 Hero

*Purpose:* the 5-second belief, the discriminating contrast, and the first command, all without scrolling.

- **Eyebrow:** Specialist subagents for Claude Code · open source
- **H1:** **Put a specialist on the call you're about to make.**
- **Sub (verbatim):** Safe to merge? Worth building? truecast gives Claude Code twelve specialists, already written: security, QA, architecture, product, design, marketing, sales and more. Install one, call it by name, and it hands back what that specialist would: a GO or NO-GO, a blocker list, an ADR, an invest-or-pass.
- **Primary CTA:** the step-1 command with a Copy button:
  `claude plugin install truecast --marketplace wastedcode/truecast`
  Micro-line under it (verbatim): **In your terminal, once per machine (Claude Code 2.1.292 or later). Then in Claude Code: `/truecast:install security-engineer`.**
- **Secondary link:** **Install from inside a session →** (anchors to 5.5 "Already in Claude Code?")
- **Trust line:** **Free and open source, MIT. Nothing runs on our servers.**
- **The artifact (right column / below on mobile):** the real verdict card from Fig. 1.
  Header: `@agent-security-engineer` · `security-engineer 1.2.2` · `claude-opus-5-5`
  Prompt line: `› review plugin/truecast/bin/truecast-plugin.sh … Can anything here get a user owned?`
  Body (verbatim from `site/proof/security-engineer.md` line 13 and F1's heading):
  **Verdict: NO-GO for `--project` until F1 is fixed.**
  **F1 — P0 for the `--project` lane. A malicious repo can write arbitrary content to any path the user can write. Confirmed.**
  Caption: **A real review of our own installer, 2026-10-16. We fixed it in `834b03d`.** → link to the report.
- **The contrast strip (directly under the card, first screen on desktop):**
  **Same prompt, six runs each** | 76-word agent | Free collection | truecast
  Ended on GO or NO-GO | 0 of 6 | 0 of 6 | **6 of 6**
  Holes found (of 18) | 9 | 6 | 9
  Link: **All 18 runs →** (#proof)

  *Why both rows:* the reader needs to see the difference and that we didn't hide the tie. Showing one row without the other
  would quote only the half that flatters us.

### 5.2 Proof: "We tested it against an agent you could write in a minute."

*Purpose:* earn trust with the fair test, show the tie, name the one consistent difference. This is the shareable story.

- **H2:** **We tested it against an agent you could write in a minute.**
- **Body (verbatim):**
  Our security-engineer found a real hole in our installer: a hostile repo could get its text written into your `~/.bashrc`. We fixed it, then gave the same prompt, byte for byte, to three agents, six runs each: a 76-word one, a 1,007-word one from VoltAgent's free collection, and ours.

  The 76-word agent found as many holes as ours: 9 of a possible 18. No run of any agent found all three. Ours cost more, $1.04 a run against $0.85.

  What only ours did was end every run on an explicit GO or NO-GO, with findings graded by when to fix them. That comes from its agent file, which is the point: someone already decided what a security engineer owes you, and wrote it down. You could add that to your own agent. truecast is that work done for twelve roles.
- **Artifact:** Fig. 2 (existing squares chart, one square per run) with the averages row. Caption (verbatim): **One prompt to all three, 6 runs each, 2026-10-16. Filled = its report raised that hole. Scored on the three holes fixed in `834b03d`, decided before reading any report.**
- **Method line (small, verbatim):** Claude Code 2.1.301, `claude -p --agent`, `claude-opus-5-5`. In 8 of 18 runs Claude Code switched to `claude-opus-4-8` partway (4 hand-written, 2 free collection, 2 ours). A safety classifier interrupted 10 runs. Every run still returned a report; one free-collection report says it couldn't finish.
- **Links:** **All 18 reports, unedited, and how we scored them →** `site/proof/rerun/README.md` · **The first review and its prompt →** `site/proof/README.md`
- **Scope line (verbatim):** One review, one kind of work. It says nothing yet about the other eleven.
- **Disclosure box (verbatim):** **Already installed truecast?** The installer fix is in 0.1.2 or later. In your terminal: `claude plugin marketplace update truecast`, then `claude plugin update truecast@truecast`, and restart Claude Code. `claude plugin list` shows your version.

### 5.3 The twelve: "Pick the call you'd rather not make alone."

*Purpose:* range. Most roles sit outside anything Claude Code ships. Each row lets the reader self-select and gives them a command to copy.

- **H2:** **Twelve specialists. Pick the call you'd rather not make alone.**
- **Lede (verbatim):** Claude Code already reviews your diff. These cover the rest of the job.
- **Rows** (role · the question in the reader's words · what its agent file asks it to hand back · can touch · counts · copy `/truecast:install <name>` · "See inside →" `github.com/wastedcode/truecast/tree/main/personas/<name>/core`). Group labels: Build · Ship · Decide · Design · Market · Raise. Counts are generated by `scripts/brand/page.py` and must pass `--check`; don't hand-type them.

| Group | Role | The question | Its agent file asks for | Can touch |
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

- **Footnote (verbatim):** "Its agent file asks for" is what each one is told to hand back, not a result we've tested. Only security-engineer has been tested (above). "Can touch" sums up the tools it declares; the install plan lists them exactly before you say yes.
- **Fig. 5** (all playbooks drawn to one scale, with the 76- and 1,007-word agents beside them). Caption (verbatim): **Size shows what's inside. It isn't a score: in the test, the 76-word agent caught as much.**

### 5.4 What one is: "A playbook, your brief, and its own context."

*Purpose:* the mechanism, in three short parts, for the reader who asks "what is this, actually?". It comes after the proof, so it explains
rather than sells.

- **H2:** **What you install: a playbook, your brief, and its own context.**
- **The playbook.** (verbatim) Its agent file plus the skills and reference notes it can open mid-task: for security-engineer, 21 Markdown files and 12,697 words. In the review above it opened two of them. They load only into that teammate. They aren't Claude Code Skills and don't crowd your session. → **Open the folder on GitHub ↗** · Fig. 3 (file list, generated)
- **Your brief.** (verbatim) One file in your repo, `.truecast/agents/security-engineer/instance/mandate.md`: what the project is, what matters, where the bar is. It reads it first. Updates never touch it. No brief? It works from what you ask. → **Start one: step 4 ↓** · Fig. 4 (where an update writes, and where it stops)
- **Its own context.** (verbatim) Each teammate is a native Claude Code subagent. It does its digging in its own context and hands your session the report. In the review above, about 66,000 tokens of work came back as a report of about 2,800. (**Condition:** ship this sentence only once the source line is published; see §8, L4. Otherwise cut the numbers and keep the first two sentences.)

### 5.5 Install: "Two commands to set up. Then call it by name."

*Purpose:* the CTA, working exactly as written, one command per copy, in order, with what the reader will see at each step.

- **H2:** **Two commands to set up. Then call it by name.**
- **Step 1 · In your terminal** — `claude plugin install truecast --marketplace wastedcode/truecast` [Copy]
  (verbatim) Needs Claude Code 2.1.292 or later; check with `claude --version`. This adds the installer. You run it once per machine.
  *What you'll see at the end (verbatim, captured 2026-10-17):*
  ```
  ✔ Successfully added marketplace: truecast (declared in user settings)
  Installing plugin "truecast@truecast"...✔ Successfully installed plugin: truecast@truecast (scope: user)
  ```
- **Step 2 · In Claude Code, in any project** — `/truecast:install security-engineer` [Copy]
  (verbatim) Was Claude Code already open? Run `/reload-plugins` first. It shows you a plan and writes nothing until you say yes.
  *The plan (verbatim from the installer, home shown as `~`, its machine-readable last line left off; version is today's):*
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
  (verbatim) The last line appears only if you've never had a `~/.claude/agents/` folder. If it does, restart Claude Code once before step 3. Want another specialist? Swap the name, or copy it from **the twelve ↑**.
- **Step 3 · Call it by name** — `@agent-security-engineer is the new upload endpoint safe to ship?` [Copy]
  (verbatim) An example prompt. Typed by hand, a teammate is `@agent-` plus its name. Or type `@` and pick it from the list.
  *(Changed from the live page's "review the changes on this branch before I merge": that is exactly what the built-in `/security-review` does, so the example should show a scope the built-in doesn't cover.)*
- **Step 4 · Give it your brief (optional)** — the live page's one-liner, unchanged (verified: creates the template, then leaves an existing brief alone):
  ```
  f=.truecast/agents/security-engineer/instance/mandate.md
  [ -e "$f" ] && echo "$f exists; left as is" || curl -fsSL --create-dirs -o "$f" \
    https://raw.githubusercontent.com/wastedcode/truecast/main/personas/security-engineer/instance-template/mandate.md
  ```
  (verbatim) In your repo, in a terminal (macOS, Linux or WSL). Fill it in; the teammate reads it first. Another teammate? Swap the name in both places.
- **Already in Claude Code?** (verbatim; thresholds from `docs/install.md`) On 2.1.275 or later, this replaces step 1: `/plugin install truecast --marketplace wastedcode/truecast`. It asks before adding the marketplace, then opens the plugin's details: choose **Install for you**, then run step 2. On an older version, run `/plugin marketplace add wastedcode/truecast`, then `/plugin install truecast@truecast`, one at a time.
- **On Windows?** (verbatim) Run Claude Code inside WSL. Native Windows isn't tested yet.
- **Later** (collapsed by default)
  - **Take the improvements:** `claude plugin marketplace update truecast` · `claude plugin update truecast@truecast` (terminal; restart Claude Code), then `/truecast:update security-engineer`. (verbatim) It shows the new version's plan first. Your brief is never touched.
  - **Take it back out:** `/truecast:remove security-engineer` (lists what it will delete, waits for yes) · `claude plugin uninstall truecast@truecast` · `claude plugin marketplace remove truecast`. `/truecast:list` shows what you have.

### 5.6 Trust: "You approve every file it writes."

*Purpose:* answer "am I letting a stranger's Markdown into my machine?" with captured output, not adjectives.

- **H2:** **You approve every file it writes.**
- **You see the plan.** (verbatim) The version, the tools, every path it will write. Then it waits. If it would replace a file it wrote before, it shows you the diff.
- **Every tool is on the label.** (verbatim) Five of the twelve can only read, search and fetch web pages. Seven can also run commands or write files. The table above and the install plan say which.
- **It won't overwrite your agent file.** (verbatim) We put a hand-written `qa.md` in `~/.claude/agents/` and asked it to install qa. It refused:
  ```
  ~/.claude/agents/qa.md exists and truecast did not write it.
  error: refusing to overwrite a file truecast did not generate: ~/.claude/agents/qa.md
  ```
  (verbatim) `--force` doesn't override that. *(Captured 2026-10-17. The live page shows the same refusal for security-engineer; either is real.)*
- **Nothing runs on our servers. We don't have any.** (verbatim) The installer copies from the clone Claude Code already made from GitHub. truecast collects nothing. Teammates with web tools can fetch pages, like any Claude Code agent with those tools.
- **Who's behind it.** (verbatim) Open source, MIT. Built by Inder Singh ([wastedcode](https://github.com/wastedcode)). Found a hole? [SECURITY.md](…/SECURITY.md): we aim to acknowledge within 72 hours.

### 5.7 Questions

*Purpose:* the objections a savvy reader brings, answered with what the product does today.

- **Claude Code already has `/security-review`. Why this?** (verbatim) Use it: it checks your branch's diff, and it's free and built in. We haven't tested truecast against it, so we make no claim either way. A teammate reviews whatever scope you give it (a script, a design, a plan), reads your brief, and ends on GO or NO-GO. Most of the twelve do jobs no built-in command covers.
  *(New. The live page doesn't answer the strongest free alternative.)*
- **I already wrote an agent file. Why switch?** (verbatim) If it does the job, keep it: in our test a 76-word agent caught as much as ours. truecast won't install over it. What it adds is the rest: twelve roles already written, a brief for each in your repo, updates that never touch that brief, and a plan before anything is written. To run ours beside yours, rename yours first.
- **What about the big free collections?** (verbatim) We tested one: VoltAgent's 1,007-word security-engineer, same prompt, six runs. It raised 6 of 18 against 9 for ours and 9 for the 76-word agent, and was the cheapest at $0.68 a run. It's one test, not a benchmark. All 18 reports are published.
- **What does it cost?** (verbatim) Nothing to install. Each teammate asks for Opus and runs on your own Claude Code plan or API key. In the test, a truecast review averaged $1.04 at API prices, against $0.85 for the 76-word agent.
- **Does it learn my project?** (verbatim) Not on its own. It reads your brief every time, so it knows what you've written there. Edit the brief and the next run picks it up.
- **Can my whole team get it?** (verbatim) Yes. Merge these keys into the repo's `.claude/settings.json` and Claude Code offers the teammate to anyone who trusts the folder: [the live page's JSON, unchanged]. Installed this way you call it `@agent-product-manager:product-manager`, and updates come with the marketplace, without the plan step. Commit it only for a marketplace you trust.
- **Can I write my own?** (verbatim) Yes. A teammate is a folder of Markdown and one `persona.toml`. [Authoring guide →] Open a PR to add it to the catalog.
- Footer note (verbatim): The installer and the file formats are pre-1.0; they may change between minor versions.

### 5.8 Final CTA

- **H2:** **Safe to merge? Worth building? Ask before you decide.**
- Buttons: **Go to step 1** (#install) · **Read the source on GitHub →**
- Line (verbatim): Used one? [Tell us what it caught, or missed →] (`/issues/new/choose`)
- Footer: truecast · MIT · © 2026 Inder Singh · GitHub · Docs · Changelog · Security · Issues

---

## 6. Copy rules for the build (so nothing drifts)

1. Every count (skills, files, words) comes from `scripts/brand/page.py` and passes `--check`. Version numbers in captured output are labelled with their capture date.
2. Never write: "expert" as a claim, "learns", "memory", "self-improving", "better than", "finds more", "read-only by default", "the exact prompt", "Eleven", a bare `@name`, or any Claude Code version/model string that isn't from a log.
3. Every external link goes to `main` or to a commit in this branch's history; every `site/proof/…` link resolves in this tree.
4. Derived copies change together: meta, og, README hero line, `site/brand` social cards (if the H1 is baked into `og.png` or `readme-header-*.png`, brand-designer regenerates them).

---

## 7. Claim ledger (every number and absolute on the page → its source)

| Claim | Source | Status |
|---|---|---|
| Twelve specialists | `personas/` (12 dirs), marketplace.json, `/truecast:list` output | ✔ |
| Versions: brand 0.1.6 · infra 1.2.2 · PM 2.4.2 · PMM 1.5.6 · researcher 0.2.2 · qa 1.3.2 · sales 2.2.2 · security 1.2.2 · architect 1.4.2 · engineer 1.4.2 · ux 1.3.6 · vc 0.2.2 | `persona.toml` each; list output | ✔ (only security's appears on the page) |
| security-engineer: 17 skills · 21 files · 12,697 words | `wc -w` on `personas/security-engineer/core/**/*.md` = 12,697 | ✔ (all twelve rows re-counted and match the live page) |
| 6 of 6 GO/NO-GO vs 0 of 6, 0 of 6 | `site/proof/rerun/README.md` table | ✔ |
| 9 / 6 / 9 of 18 holes | same | ✔ |
| $1.04 / $0.85 / $0.68 average | same | ✔ |
| "No run found all three" | same | ✔ |
| 8 of 18 switched to 4.8 (4/2/2) | same, Method | ✔ |
| 10 runs interrupted; free-3 couldn't finish | same | ✔ |
| Fig. 1 verdict + F1 heading, verbatim | `site/proof/security-engineer.md` lines 13, F1 | ✔ |
| Fixed in `834b03d` | commit in this branch's history | ✔ |
| Installer 0.1.2 has the fix | plugin.json 0.1.2; CHANGELOG 0.1.1 + 0.1.2 | ✔ ("or later") |
| Step 1 works; needs 2.1.292+ | ran it, 2.1.302; 2.1.292 release notes | ✔ |
| Step 1 output lines | captured 2026-10-17 | ✔ |
| Plan output | captured 2026-10-17 | ✔ |
| Refusal output | captured 2026-10-17 (qa) | ✔ |
| Step 4 one-liner | ran it twice; raw URL 200 | ✔ |
| In-session path, 2.1.275 threshold | `docs/install.md`, README | ◐ not re-verified here (no 2.1.275 binary); keep "or later" |
| `@agent-<name>`; plugin form `@agent-plugin:name` | code.claude.com/docs/en/subagents | ✔ |
| `/security-review` checks the branch diff | code.claude.com/docs/en/commands | ✔ |
| 5 read-only, 7 can run commands/write | `tools` in each `persona.toml` | ✔ |
| All twelve ask for Opus | `modelHint = "opus"` in all 12; agent file `model: opus` | ✔ |
| Reads its brief first | `personas/*/subagent.md` "Read it FIRST" | ✔ |
| No servers, collects nothing | installer copies from local clone (`truecast-plugin.sh`, docs/install.md) | ✔ |
| 72-hour acknowledgement | `SECURITY.md` line 24 | ✔ |
| "about 66,000 → about 2,800 tokens" | only in a private run log (QA verified: `toolUseResult.totalTokens` 66,578; 2,940 output − 160 thinking) | ✘ **not public**: publish or cut (L4) |
| VoltAgent "100+", wshobson "~190" | third-party listings; used in this deck only | — not on the page |

---

## 8. Every false or unbacked claim on the current surfaces

### A. The working-tree page (staged; deploys if not replaced)

| # | Claim | Why it's wrong | Fix |
|---|---|---|---|
| W1 | "Eleven teammates" / "Eleven deep teammates" / meta "Eleven open-source…" | Twelve ship; brand-designer is missing from the roster | Twelve, and all twelve listed |
| W2 | Terminal mock: "Claude Code v2.1.177 · Opus 4.8 (1M context) · Claude Max … Verdict: GO. Core trust surface is sound; both known escapes verified closed." | Invented UI and output. The real review of this repo said **NO-GO for `--project`** | Use the real Fig. 1 report |
| W3 | "Pastes straight into Claude Code. No terminal, no npm." + "Copy the install (all 3 lines)" | Claude Code runs one slash command per submit, so a 3-line paste doesn't run 3 commands | One command per copy, in order |
| W4 | `@security-engineer` (bare) throughout | Not the documented mention form; can resolve as a file (CHANGELOG 0.1.2) | `@agent-security-engineer`, or type `@` and pick |
| W5 | "Read-only by default" / "Least privilege … read-only by default" | 7 of 12 can run commands or write files | "Every tool is on the label", with 5/7 named |
| W6 | "you read the exact prompt before you run it" / "`truecast prompt <name>` prints the exact prompt" | Needs the npm CLI, which the page tells you not to install; the plan shows tools and paths, not the prompt | Cut; the plan and "See inside" links carry it |
| W7 | "the notes it kept" / `instance/notes` | Nothing writes `work.md` yet | Brief only |
| W8 | Diagram file `persona.md` | No such file; it's `agent.md` + `persona.toml` | Real paths |
| W9 | Anthropic "90.2%" multi-agent stat | Borrowed result from a different system (lead + subagents on a research eval); says nothing about truecast | Cut |
| W10 | "Other marketplaces … hundreds, shallow" / "built deep enough to trust" | Unbacked disparagement; our own test shows a 76-word agent tied ours | Cut |
| W11 | "it gets better without costing you anything" | Updates cost the plan + restart, and nothing measures "better" | Cut |
| W12 | Update path omits `claude plugin update truecast@truecast` | Users stay on a vulnerable installer (<0.1.2); auto-update is off for third-party marketplaces | Disclosure box (5.2) |
| W13 | `site/404.html` deleted | The deploy loses its 404 page | Restore or rebuild |

### B. The live page (HEAD = main)

| # | Claim | Problem | Fix |
|---|---|---|---|
| L1 | Hero leads with the test it tied ("It caught as many holes, no more…") before saying what you get | True, but the lead sells nothing. The reader learns the loss before the reason to care | Promise first; tie + verdict as the contrast strip |
| L2 | Step 3 example "review the changes on this branch before I merge" | That's exactly built-in `/security-review`; it invites "I already have this" | Scope the built-in doesn't cover |
| L3 | No answer to `/security-review` / `/code-review` | The strongest free alternative goes unaddressed | FAQ 5.7 |
| L4 | "66,578 tokens … 2,780-token report" (page + README) | Source is a private log; not in `site/proof/` | Add one line to `site/proof/README.md` (`toolUseResult.totalTokens` = 66,578; report ≈ 2,780 output tokens) or cut the numbers |
| L5 | "Installer 0.1.2 fixes all four" | True today; closed-ended | "0.1.2 or later" |
| L6 | Three install blocks (hero, steps, final) + Fig. 1/2 duplicated arguments | Same point made 3×; length | One install section |

### C. README / docs drift (same change, or flagged)

| # | Where | Problem |
|---|---|---|
| R1 | README "Status": "the self-improving loop is next" | Fine in README; must not appear on the homepage (not shipped) |
| R2 | README + docs mention CLI 0.3.0 behaviour | npm serves 0.2.0. README says so; the homepage doesn't mention the CLI |
| R3 | README "Why a teammate" leads with context-window tokens (L4) | Same unpublished source |
| R4 | GitHub repo description "The expert teammates Claude Code doesn't ship with" | Fine as a tagline; matches README. No change needed unless the founder wants the new H1 there too (§9.2) |

---

## 9. Decisions I took (reversible), with the alternative

1. **H1 = "Put a specialist on the call you're about to make."** *Alternative:* keep "The expert teammates Claude Code doesn't ship with." (it stays as the README tagline). *Why:* it names the reader's moment and carries the one measured difference; the tuned line has no job in it and invites the catch-rate comparison.
2. **Category "specialist subagents for Claude Code"; "teammate" in body; "persona" off the page.** *Alternative:* "expert teammates" everywhere. *Why:* "subagent" is the platform's word and readers already know it.
3. **The tie stays in the hero contrast strip.** *Alternative:* push it to the proof section. *Why:* the 6-of-6 row alone would be a half-quote, and the published tie is the thing people will share.
4. **No star count, no download count, no testimonials.** *Alternative:* show the GitHub badge. *Why:* 8 stars works against us. The maker's name, MIT, SECURITY.md and the published runs are the trust signals we actually have.
5. **The npm CLI is off the homepage** (footer docs link only). *Why:* npm serves 0.2.0, which doesn't share state with the installer.

**Before the launch push (not blocking this page):**
- Run the same fair test against **`/security-review`** (the alternative a savvy reader actually uses) and against one **non-code** teammate (product-manager vs a 76-word PM agent). Today the page's only proof is in the one lane Claude Code already covers.
- Interview the first ten installs (what call they used it for) to turn §2 from a hypothesis into the reader's own words.

---

## Frontier check

- **Benchmark:** Dunford (alternatives → attributes → category), Fletch PMM (product-led homepage: what it is, for whom, value, then the product itself), Raskin (name the shift), Wiebe/Harry Dry (reader's words, concrete numbers), and the developer-tool homepages that put the real product right under the hero: uv (benchmark chart under the hero), Bun (benchmark first, sections as working demos), plus the live truecast page after its 73-finding panel.
- **Where this goes past them:** the hero carries a contrast that includes our own loss (no benchmark page does that). Every number traces to a published receipt. The install path was run for real today, with output captured. And it answers the platform's own built-in alternative, which the live page missed.
- **Searched:** 34 headlines across 5 angles, 6 finalists scored; 3 section orders; 2 hero-artifact options (verdict card vs roster), with the card chosen for proof and the roster put at #2 for range.
- **Pre-empted:** the stake before the mechanism; the skeptic's sentence; one command per copy; hour-1 truth (reload/restart); exit and cost; one term per concept; derived copies; disclosure for existing users; "or later" version wording.
- **Critique caught:** `/security-review` duplicates the live step-3 example and the beachhead; a 66k-token figure with no public source; the "ends on a decision" overclaim for 5 roles (narrowed to the roles that do); and the working tree, which would ship an older page with an invented terminal.
- **Verified:** install, plan, apply, list, refusal and brief one-liner run in a throwaway HOME on Claude Code 2.1.302; counts re-measured; live, npm, tags and GitHub checked 2026-10-17; AI-tell scrub and a cold read of every verbatim line.
