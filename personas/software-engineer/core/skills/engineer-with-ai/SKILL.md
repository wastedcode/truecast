---
name: engineer-with-ai
description: Use when generating or accepting AI/LLM-written code — treat the model as a fast junior, not an oracle: give it context, then verify every line; never ship plausible-but-wrong code or become the tactical tornado.
---
# Engineer with AI — a fast junior, never an oracle

An LLM can produce plausible code faster than anyone — which is exactly the trap. It hallucinates, loses
context across turns, and writes confidently-wrong, insecure, or design-blind code (2025 evals: none of
the major models produced web code meeting basic security standards). It is a **powerful pair programmer
that needs direction and oversight**, not autonomous judgment.

## The method
- **Give it the real context.** Feed the relevant code, conventions, constraints, and known pitfalls;
  ungrounded models invent APIs and ignore the surrounding design. Garbage context → confident garbage.
- **Verify every line — you own it.** Read the generated code as if reviewing a junior's PR: is it
  correct, does it fit the codebase (`write-code-that-fits`), does it handle the failure paths, is it
  secure, does it actually run? Don't merge what you haven't understood.
- **Don't become the tactical tornado.** Fast plausible output that the maintainers later curse is the
  anti-pattern. Make the model produce the *strategic* code you'd write — simple, deep, tested — not a
  bigger pile faster.
- **Watch the failure modes:** invented/wrong APIs, missing edge cases, insecure patterns (injection,
  secrets, missing authz), subtle logic errors that read fine, and **design debt** (solves the immediate
  ask, ignores the surrounding structure).
- **Prove it like any code.** Generated ≠ tested. Run `prove-it-then-break-it`; an AI-written diff earns
  the same tests + adversarial pass as a hand-written one.

## The discipline
- The model is accountable for nothing; **you** are accountable for the diff. "The AI wrote it" is never
  an excuse for a bug.
- Use it to go faster on the parts you understand, and to explore — not to skip the understanding.
