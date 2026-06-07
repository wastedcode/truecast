# Security Policy

## Supported versions

truecast is pre-1.0. Security fixes land on the latest published minor; please upgrade to the most recent
release before reporting.

| Version | Supported |
|---------|-----------|
| latest `0.x` | ✅ |
| older `0.x`  | ❌ (upgrade first) |

## Reporting a vulnerability

**Do not open a public GitHub issue for a security vulnerability.**

Report privately via one of:

- **GitHub Security Advisories** — [open a private report](https://github.com/wastedcode/truecast/security/advisories/new)
  (preferred — keeps disclosure and fix coordinated in one place).
- **Email** — inder@wastedcode.com.

Please include: affected version, a description of the issue, reproduction steps or a proof-of-concept,
and the impact you foresee. We aim to acknowledge within **72 hours** and to agree a disclosure timeline
with you before any public write-up.

## Threat model — what truecast does and does not touch

- **A persona is third-party content you choose to install.** Installing a persona materializes a Claude
  Code subagent whose system prompt comes from that persona's `core/`. Running it executes those
  instructions inside *your* authenticated Claude Code session. **Treat an untrusted persona like
  untrusted code** — read what you install, prefer pinned versions (`@<tag>`) from sources you trust.
- **truecast owns no credentials.** It materializes a subagent for your already-authenticated Claude
  Code; it has no API keys and never reads or writes your auth.
- **Fetching is sandboxed.** Git clones run with a hardened environment (no user hooks, no editor/askpass,
  an explicit protocol allow-list); persona-supplied paths (`#subpath`, skill/knowledge refs) are forced
  through `src/safety/` — contained to the persona root, rejecting `..`, absolute paths, and symlink
  escapes. The `core/` materialized into your project is a **symlink** to the read-only global cache.
- **Every altering operation confirms** before it writes, with an explicit `--yes` to skip — install,
  update, remove, and `doctor --fix` all route through one consent gate.
- **Updates can't silently clobber your edits.** A per-persona ownership ledger tracks what truecast wrote
  (by hash); a hand-edited managed file is detected as drift and requires `--force`.

### Out of scope

- The behavior, output, or safety of the underlying `claude` CLI and the agent it runs — report those to
  Anthropic.
- What a persona's instructions cause your agent to do once you have chosen to install and run it — you
  own which personas (and which versions/sources) you trust.
- Anything an orchestrator (e.g. Posse, claudemux) does on top of the truecast API.

Thanks for helping keep truecast and its users safe.
