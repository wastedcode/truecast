# Our installer, reviewed: the runs behind truecast.dev

This folder is what the homepage quotes. Nothing here is edited except where it says so.

- **[`rerun/`](rerun/README.md): the fair test (Fig. 2).** One prompt, byte for byte, given straight to
  each of three agents, six runs each. On this review truecast's `security-engineer` caught as much as a
  76-word hand-written agent (9 of a possible 18 each: three holes, six runs) and more than a 1,007-word free-collection agent (6 of 18). Its one consistent difference: every run ended on an explicit GO or NO-GO.
  It cost more per run.
- **This page: the first review (Fig. 1)** and the comparison we ran first, which wasn't a fair test. Here's
  why, and everything it produced.

## The first review

On 2026-10-16 we asked three Claude Code sessions to use a `security-engineer` subagent on the installer,
the way you'd normally use one. Each session's main agent wrote a prompt and handed it to the subagent. We
kept everything.

- [`security-engineer.md`](security-engineer.md): the report from truecast's `security-engineer` 1.2.2.
- [`free-collection-agent.md`](free-collection-agent.md): the report from the 1,007-word `security-engineer`
  in VoltAgent's awesome-claude-code-subagents.
- [`handwritten-agent.md`](handwritten-agent.md): the report from a 76-word hand-written agent.

### Method

| | Hand-written agent | Free-collection agent | truecast `security-engineer` |
|---|---|---|---|
| Agent | the 76-word file below | VoltAgent's 1,007-word file, linked below | truecast 1.2.2, its playbook in `~/.truecast` |
| Model | `claude-opus-5-5` | `claude-opus-5-5` | `claude-opus-5-5` |
| Claude Code | 2.1.301, headless (`claude -p`) | 2.1.301, headless (`claude -p`) | 2.1.301, headless (`claude -p`) |
| Tools | Read, Grep, Glob, Bash, WebSearch, WebFetch | Read, Grep, Glob, Bash, WebSearch, WebFetch | Read, Grep, Glob, Bash, WebSearch, WebFetch |
| Repo | a copy of this repo from before the fix in `834b03d` | an identical copy | an identical copy |
| Whole-session cost | $1.00 | $0.80 | $1.11 |
| Whole-session time | 4.5 min | 3.5 min | 6.7 min |

Each ran once. Cost and time are `total_cost_usd` and `duration_ms` from each session's result.

**Context, for truecast's run** (from the main session's log, the subagent's `toolUseResult`): 10 tool calls; `totalTokens` 66,578, the subagent's own context at its final turn (2 input + 1,523 cache-write + 62,113 cache-read + 2,940 output); the report it handed back was 2,780 tokens (2,940 output − 160 thinking). The main session received only that report.

### What we typed (the same in all three sessions, verbatim)

```text
Use the security-engineer subagent for this. Task for it: review plugin/truecast/bin/truecast-plugin.sh and the slash commands in plugin/truecast/commands/. They run inside a user's Claude Code session and write into the user's home directory. Can anything here get a user owned? Return its full verdict and findings verbatim.
```

### What each subagent actually received

Claude Code's main session rewrote our request into a prompt for the subagent, and the three prompts differed.
The differences matter for reading the results: the hand-written agent was offered "SAFE / NOT SAFE /
CONDITIONAL" and answered CONDITIONAL; truecast's prompt alone asked it to check writes to `~/.claude`
(settings, hooks, permissions) and to end on GO/NO-GO, which is close to its F2. So this comparison can't
separate the agent from its prompt. [The fair test](rerun/README.md) removes the main session. Each prompt
below is the first message in that subagent's log, verbatim.

<details><summary>Hand-written agent</summary>

```text
Security review in the repo at /tmp/tcbench.qX9x/repo-van.

Scope: plugin/truecast/bin/truecast-plugin.sh and every slash command file in plugin/truecast/commands/. These run inside a user's Claude Code session and write into the user's home directory.

Question to answer: can anything here get a user owned? Examples include arbitrary code execution, command or argument injection, path traversal or symlink attacks on writes into $HOME, unsafe temp files, TOCTOU races, downloading or executing remote content without verification, overwriting dotfiles or shell rc / Claude config (settings.json, hooks, CLAUDE.md), prompt-injection paths where untrusted content reaches the model or the shell through the slash commands, over-broad allowed-tools in command frontmatter, leaking secrets or tokens, and insecure file permissions.

Read the files in full. Follow any scripts or files they source, call, or reference inside the repo, as far as needed to judge exploitability. Don't modify anything. If you run anything, only do it in a scratch dir outside the repo against copies, and never run network fetches the scripts would make.

Output: a clear overall verdict (e.g. SAFE / NOT SAFE / CONDITIONAL, with a one-paragraph rationale), then each finding with: severity, file:line, what's wrong, a concrete attack scenario (who controls which input and how it leads to harm), and a recommended fix. Rank most severe first. Say which findings you confirmed by reading or testing and which are theoretical. Also list anything you checked and found safe.
```

</details>

<details><summary>Free-collection agent</summary>

```text
Security review task. Repo root: /tmp/tcbench.v8IU/repo-volt

Review plugin/truecast/bin/truecast-plugin.sh and every slash command file in plugin/truecast/commands/. These run inside a user's Claude Code session and write into the user's home directory. Question: can anything here get a user owned?

Threat-model it concretely. Consider at least: command/argument injection (unquoted vars, eval, word splitting, untrusted input from slash-command $ARGUMENTS or files flowing into shell), path traversal and symlink attacks on writes into $HOME (TOCTOU, following symlinks, predictable /tmp paths), unsafe file permissions on created files/dirs, downloading/executing remote code (curl|sh, unpinned/unverified fetches), writing to shell rc files, ~/.claude settings, hooks, or other auto-executed locations, secrets/tokens leaking into logs, output, or world-readable files, prompt-injection paths where slash-command text or fetched content could steer Claude into running dangerous commands, overly broad allowed-tools in command frontmatter, and anything that runs with elevated trust. Also read any files the script sources or invokes inside plugin/truecast/ (e.g. plugin manifest, hooks) if relevant to the attack surface.

Trace real input to dangerous sinks; only grade exploitable harm, with a concrete attack scenario for each finding. Do not modify any files.

Output format: start with an overall verdict (e.g. SAFE / NOT SAFE, or GO / NO-GO) with a one-paragraph justification, then a numbered list of findings, each with: severity (Critical/High/Medium/Low/Info), file:line, description, concrete exploit scenario, and recommended fix. End with anything you checked and found clean.
```

</details>

<details><summary>truecast's security-engineer</summary>

```text
Security review, working directory /tmp/tcbench.qX9x/repo-tc. Review plugin/truecast/bin/truecast-plugin.sh and every slash command in plugin/truecast/commands/. These run inside a user's Claude Code session and write into the user's home directory. Question: can anything here get a user owned?

Threat-model the realistic attackers: malicious repo contents the user opens, attacker-controlled env vars/args/slash-command arguments ($ARGUMENTS), network responses (if anything is downloaded), symlink/TOCTOU attacks on paths in $HOME or /tmp, other local users, prompt-injection paths where command text or fetched data steers Claude into running shell commands. Trace each untrusted input to its dangerous sink (eval, unquoted expansion, sourcing files, curl|sh, writing to shell rc files/settings.json/hooks, chmod, rm -rf, path traversal). Check whether any writes to ~/.claude (settings, hooks, permissions allowlists) could grant persistent code execution or broaden permissions. Reproduce findings where feasible (in a scratch dir under /tmp with a fake HOME — do not modify the real home directory or the repo). Grade only exploitable harm, with severity, file:line, a concrete exploit scenario, and a fix for each. End with an explicit GO/NO-GO verdict. Return the full verdict and all findings in your final report.
```

</details>

### The hand-written agent (76 words, verbatim)

```markdown
---
name: security-engineer
description: Senior security engineer. Use for security reviews, threat modeling and finding vulnerabilities in code.
model: opus
tools: Read, Grep, Glob, Bash, WebSearch, WebFetch
---

You are a senior security engineer with 15 years of experience in application security. Review code for
vulnerabilities (OWASP Top 10, injection, path traversal, secrets, supply chain), think like an attacker,
and give clear, prioritized findings with severity ratings and concrete fixes. Be thorough but avoid false
positives.
```

### The free-collection agent (1,007 words)

[`categories/03-infrastructure/security-engineer.md`](https://github.com/VoltAgent/awesome-claude-code-subagents/blob/408d3c9eee2d0c75c12a3abb5de29e53c2ca6b9e/categories/03-infrastructure/security-engineer.md)
from [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents),
pinned to the repo's `main` at fetch time (`408d3c9`). We picked the larger of the collection's two security
agents (the other, `security-auditor.md`, is 897 words). We changed two frontmatter lines so the three runs
match, and nothing else:

```diff
-tools: Read, Write, Edit, Bash, Glob, Grep
-model: inherit
+tools: Read, Grep, Glob, Bash, WebSearch, WebFetch
+model: opus
```

### What it showed, and why we reran it

- **All three found the bug** and reproduced it in a sandbox: with `--project`, the installer wrote through
  a predictable temp-file path, so a hostile repo could get its text written into the user's `~/.bashrc`.
- **All three said not to ship `--project` until it's fixed.** They graded it differently. The hand-written
  agent: `Medium (high impact, moderate likelihood)` under `Verdict: CONDITIONAL`, ending "not safe for
  `--project` in untrusted repos until finding 1 is fixed". The free-collection agent: `High` under
  `Verdict: NOT SAFE (NO-GO for --project)`. truecast's: `F1 — P0 for the --project lane` under
  `Verdict: NO-GO for --project until F1 is fixed.`
- **Only truecast's raised the hooks gap here (its F2):** a user-scope agent file can carry `hooks:` and
  other keys, and the install plan only showed `tools:`. Before grading, it read two files from its own
  playbook and two pages of Claude Code's docs. But its prompt, alone of the three, asked it to check writes
  to `~/.claude` including hooks, so this run can't credit the playbook. Both other agents flagged something
  nearby: that the plan's tools line could misstate the grant (the hand-written agent's #4, the
  free-collection agent's #5).
- **The fair test answered it.** Given the same prompt directly, six runs each, the hooks gap turned up in
  2 of 6 truecast runs and 1 of 6 for each of the others, and a 76-word agent caught as many holes overall.
  See [`rerun/`](rerun/README.md).
- **The other two listed more findings**: 7 each, against 4. The free-collection agent's run was the
  cheapest and the fastest.
- **One run each, with different prompts.** Read it as one review, not a comparison.
- During the truecast run a safety classifier stopped one step of the hands-on reproduction. Its report says
  so in its first line.

We fixed all three issues the truecast agent raised in
[`834b03d`](https://github.com/wastedcode/truecast/commit/834b03d) (installer 0.1.1): temp files now come
from `mktemp`, the installer refuses agent-file keys outside an allowlist, and the slash commands can't be
invoked by the model.
