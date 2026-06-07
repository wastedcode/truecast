---
name: design-the-cli-surface
description: Use when designing the ergonomics of a terminal / CLI / builder tool — command and flag design, sensible defaults, inferring arguments instead of demanding flags, box/project-level config, and help/output legibility. The surface is the command line, not a GUI; the same usability discipline applies.
---
# Design the CLI surface — the terminal is a UI too

A CLI is an interface with a user, and every usability principle still applies — it just renders as
commands, flags, defaults, output, and config instead of buttons and screens. The lane isn't "GUI only."
Builder tools live in the terminal, and the most common ergonomic failure is **making the user type what
the tool could have known**: a required `--cwd` for the directory you're already in, a flag for the only
sensible value, a path that could have been inferred. Good CLI design is the same job as good GUI design —
remove friction, prevent error, match the user's mental model — applied to the prompt.

## The method
1. **Default to the obvious; infer before you require.** Every flag the user must type for the common case
   is friction you designed in. If the tool can derive it — current directory, the single matching target,
   the last-used value, the project's config — *derive it*. A required flag is justified only when there's
   no safe inference and getting it wrong is costly. ("Why does `resume` need `--cwd`? I'm already in the
   directory." — the answer should be: it doesn't.)
2. **Design the command + flag grammar to match the user's model.** Verbs are actions the user thinks in
   (`install`, `run`, `resume`), nouns are the things they act on; consistent flag names across subcommands
   (don't make `--path` here and `--dir` there); short flags for the frequent ones, long for the rare.
   Recognition over recall — a user should *guess* the command correctly.
3. **Layer configuration: defaults → box/global → project → flags.** The user sets a default once at the
   **box level** (their machine/global config) and never types it again; a **project-level** config
   (committed in the repo) overrides for that project; an explicit **flag** overrides for one invocation.
   Precedence is predictable and documented. ("Let the user set the default at the box level" — so the
   common path needs no flags at all.)
4. **Make output a legible surface.** This is where CLI design meets `surface-the-signal`: status that's
   scannable at a glance, progress for long work, errors that name the cause *and the way out* (heuristic
   #9: not "exit 1" but "no project found here — run `init`, or pass `--path`"), quiet success, and
   `--json`/`--quiet` for when the consumer is a script not a human. Respect `NO_COLOR` and non-TTY pipes.
5. **Help and discoverability are the empty/onboarding state.** `--help` and a bare invocation are the
   first run — they should show the common commands and a real example, not a wall of every flag.
   Dangerous/destructive actions confirm or require an explicit flag (error prevention, heuristic #5).

## The discipline
- **The best flag is the one the user never has to type.** Infer, default, remember — then let an explicit
  flag override. Count the keystrokes the common path requires and drive them toward zero.
- **Don't make me think at the prompt either.** A CLI that demands ceremony for the everyday case fails the
  same usability bar as a GUI that buries the primary action.
- **One config story, layered, not scattered.** Box-level + project-level + flags with clear precedence —
  not env vars in one place, a dotfile in another, and required flags filling the gap.
- **Output is a designed state set** — success/empty/error/long-running each deserve design, same as any
  surface (`design-the-states`, `surface-the-signal`).
- Which *commands* should exist and what they do is a product/architecture question — **consult the
  product-manager / software-architect**; you own the *ergonomics* of the surface they expose.
