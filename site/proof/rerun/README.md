# The fair test: one prompt, three agents, six runs each

This folder is Fig. 2 on [truecast.dev](https://truecast.dev). It asks a plain question: on a real security
review, does truecast's `security-engineer` catch more than a security agent you'd write or download?

**On this review, no.** Over six runs each it caught as much as a 76-word hand-written agent (9 of 18) and
more than a 1,007-word agent from a free collection (6 of 18). It cost more per run. What it did differently
was the form of the answer: all six truecast runs closed on an explicit GO or NO-GO and ranked findings
P1–P3, by when to fix them. None of the twelve other runs used that call; one hand-written run said "Don't
ship this until #1 and #2 are fixed."

## Why we ran it

Our first comparison (the [three reports one level up](../README.md)) ran each agent as a subagent of a
normal Claude Code session. The session wrote each agent's prompt itself, and the three prompts differed.
truecast's prompt was the only one that asked about writes to `~/.claude` (settings, hooks, permissions).
So that comparison couldn't say whether the playbook or the prompt found the hooks gap. This one removes the
middle step.

## Method

- **Same input, byte for byte.** Each agent ran as the session agent, so it received the prompt itself:
  `claude -p "$PROMPT" --agent security-engineer --model opus --output-format json --dangerously-skip-permissions`,
  from the root of a repo copy, with that agent's file at `.claude/agents/security-engineer.md`.
- **Same repo.** `git archive 834b03d^`, the tree from before the fix (`3cc249dc64d1f6255637efba95ba7e59e46c74a4`
  for all 18 copies).
- **Same model and harness, with one exception.** `claude-opus-5-5` (`--model opus`), Claude Code
  2.1.301, the same tools for all three agents (Read, Grep, Glob, Bash, WebSearch, WebFetch). Six runs per
  agent, 18 in all, on 2026-10-16. In 8 runs Claude Code switched to `claude-opus-4-8` partway through,
  and 4.8 wrote the final report: hand-written 1, 4, 5 and 6; free collection 1 and 4; truecast 3 and 6
  (the `model` column below; source: `modelUsage` in each run's result). Counting only the 10 runs that
  stayed on 5.5, the holes raised were hand-written 4 of 6, free collection 4 of 12, truecast 7 of 12.
  That's too few runs to read anything into, so we report all 18.
- **The prompt** (sha256 `40e71e8c…`):

  ```text
  Review plugin/truecast/bin/truecast-plugin.sh and the slash commands in plugin/truecast/commands/. They run inside a user's Claude Code session and write into the user's home directory. Can anything here get a user owned? Give your full verdict and findings.
  ```

- **The agents.** The 76-word hand-written agent and the VoltAgent agent are the same files as in the first
  comparison (see [README](../README.md#method)). truecast's is `security-engineer` 1.2.2 as the installer
  wrote it that day, with its playbook in `~/.truecast` (sha256 `878cc4c2…`). Its one-line description has
  since been reworded; the body is unchanged.
- **Interruptions.** A safety classifier stopped one or more turns in 10 of the 18 runs (hand-written 4,
  free collection 3, truecast 3). Every run still returned a report; `free-3` says it couldn't finish.

## How we scored

Before reading any report we fixed the scoring to the three holes we fixed in
[`834b03d`](https://github.com/wastedcode/truecast/commit/834b03d). A run gets a hole if its report raises it
as a problem:

- **Temp files.** `--project` writes to a predictable `<file>.tmp-$$` beside its target, so a symlink a
  hostile repo plants there redirects the write (for example into `~/.bashrc`).
- **Hooks.** An agent file can carry keys beyond `tools` (`hooks`, `mcpServers`, `permissionMode`) that run
  or grant things the install plan never shows. Saying only that the plan's tools line could be faked
  doesn't count.
- **Shell.** The slash commands pre-approve unrestricted `Bash` (`allowed-tools: Bash`) and Claude can
  invoke them on its own.

| run | model | temp files | hooks | shell | how it ended | cost · time |
|---|---|---|---|---|---|---|
| [handwritten-1](handwritten-1.md) | 5.5 → 4.8 | ● F1, High | · | · | "yes — a user can get owned" | $0.95 · 4.8 min |
| [handwritten-2](handwritten-2.md) | 5.5 | ● H-1 | · | ● M-1 | "Yes, a user can get owned, but only through `--project`" | $0.66 · 2.7 min |
| [handwritten-3](handwritten-3.md) | 5.5 | ● 1, HIGH | · | ● 3, MEDIUM | "yes, a user can get owned. Don't ship this until #1 and #2 are fixed." | $0.85 · 3.5 min |
| [handwritten-4](handwritten-4.md) | 5.5 → 4.8 | ● M1 | · | · | "one genuine containment-escape bug (Medium)" | $0.68 · 3.3 min |
| [handwritten-5](handwritten-5.md) | 5.5 → 4.8 | ● F2, MEDIUM | ● F1, HIGH | · | "There is one path that can get a user owned" | $0.90 · 4.5 min |
| [handwritten-6](handwritten-6.md) | 5.5 → 4.8 | ● F1, HIGH | · | · | "unusually defensive code", then its findings | $1.03 · 3.2 min |
| [free-1](free-1.md) | 5.5 → 4.8 | ● Medium | · | · | "I'd call it Medium" | $0.78 · 3.1 min |
| [free-2](free-2.md) | 5.5 | · | ● 1, Critical | · | "yes, a user can get owned" | $0.88 · 2.9 min |
| [free-3](free-3.md) | 5.5 | ● 1, not confirmed | · | · | "Verdict so far" (interrupted) | $0.50 · 1.3 min |
| [free-4](free-4.md) | 5.5 → 4.8 | ● 1, high | · | · | "Yes — a user can get owned." | $0.64 · 2.8 min |
| [free-5](free-5.md) | 5.5 | ● 1, High | · | · | its findings, highest first | $0.73 · 4.2 min |
| [free-6](free-6.md) | 5.5 | ● High | · | · | "yes, a malicious repo can get a user owned, but only through `--project`" | $0.54 · 2.2 min |
| [truecast-1](truecast-1.md) | 5.5 | · | ● F3, P2 | ● F1, P1 | NO-GO | $1.10 · 3.9 min |
| [truecast-2](truecast-2.md) | 5.5 | ● F1, P1 | ● F2, P2 | · | NO-GO for `--project`, GO for user scope once F2 is fixed | $1.14 · 4.3 min |
| [truecast-3](truecast-3.md) | 5.5 → 4.8 | ● P1 | · | · | NO-GO | $1.22 · 4.1 min |
| [truecast-4](truecast-4.md) | 5.5 | ● F1, P1 | · | · | NO-GO until two fixes land | $0.96 · 3.4 min |
| [truecast-5](truecast-5.md) | 5.5 | ● F1, P1 | · | ● F2, P2 | NO-GO | $0.87 · 5.2 min |
| [truecast-6](truecast-6.md) | 5.5 → 4.8 | ● F1, P2 | · | · | CONDITIONAL GO | $0.94 · 4.9 min |

| | temp files | hooks | shell | all three | average run |
|---|---|---|---|---|---|
| Hand-written, 76 words | 6 of 6 | 1 of 6 | 2 of 6 | **9 of 18** | $0.85 · 3.7 min |
| Free collection, 1,007 words | 5 of 6 | 1 of 6 | 0 of 6 | **6 of 18** | $0.68 · 2.7 min |
| truecast, 21 files · 12,697 words | 5 of 6 | 2 of 6 | 2 of 6 | **9 of 18** | $1.04 · 4.3 min |

"How it ended" quotes or summarises each report's closing call. Cost and time are `total_cost_usd` and
`duration_ms` from each session's result.

## What it shows, and what it doesn't

- **No catch-rate edge for truecast here.** A 76-word prompt found as much. Six runs per agent can't
  separate 2 of 6 from 1 of 6 on the hooks hole, so we don't claim it.
- **Every run missed something.** No run of any agent raised all three holes. The best runs raised two.
- **The form comes from the agent file.** truecast's agent file asks for a GO / NO-GO and P0–P3 grades, and
  all six runs followed it. Only two runs opened skills from the playbook (`truecast-1`, `truecast-2`: the
  verdict and grading skills). Those two were also the two that found the hooks hole; two runs are too few
  to call that a cause. The other agents grade by severity and mostly answer the prompt's yes/no question.
- **What `truecast-2` opened** (Fig. 1 on truecast.dev), from its session log: 17 tool calls; the 11th printed `skills/grade-and-remediate-risk/SKILL.md` and `skills/write-the-security-verdict/SKILL.md` (with `sed`). No other playbook file was opened, and no knowledge note.
- **One review, one kind of work.** This says nothing yet about the other eleven teammates.

Rerun it: the prompt, the repo commit and the agent files are all above.
