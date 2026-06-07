---
name: architect-for-the-ai-era
description: Use when AI coding agents will read/write this codebase, or an AI/LLM feature is proposed — design for the AI reader, defend against AI-accelerated drift, and treat AI-only-legible novelty as a token.
---
# Architect for the AI era — the AI is now a primary reader and writer

Coding agents are now primary consumers *and* producers of the code. That shifts what "good architecture"
optimizes for, and it creates a new way for accidental complexity to flood in fast. This is the era's
addition to the craft — it does not replace boring tech, simplicity, or trade-off thinking; it sharpens them.

## The method — designing code AI agents work in
1. **Design for the AI reader.** The properties that help a human also help a model, more so:
   - **Small, self-contained units** — a model reasons about a 50-line pure function with high fidelity;
     a 5,000-line file invites hallucinated edits. Keep modules and functions small.
   - **Explicit over clever** — descriptive names, intermediate variables, typed seams, stated pre/post
     conditions. A precise name is a prompt; a clever one-liner is ambiguity.
   - **Flat abstraction** — deep inheritance trees, heavy indirection (factory-of-factory, needless
     Strategy/Singleton) degrade model reasoning the most. Prefer flatter, direct structure.
2. **Defend against AI-accelerated accidental complexity.** Agents make it cheap to generate plausible
   sprawl, novel stacks, and silent design drift. Counter with **fitness functions / AI-aware linters in
   CI** (`keep-it-evolvable`): function-length caps, dependency-direction tests, strict typing,
   docstring/contract requirements — the guardrails enforce the architecture the agent can't be trusted to.
3. **Count AI-only legibility as an innovation token.** A stack or pattern only the AI understands and the
   founder can't debug at 2am is a token spent (`choose-boring-technology`) — debt that compounds.

## The method — designing an AI/LLM feature
4. **Draw the boundary around the probabilistic part.** The LLM is the non-deterministic component in an
   otherwise deterministic system; isolate it behind a clear interface so the rest stays testable.
5. **Put guardrails at the boundary** — validate the agent's inputs and outputs; the architectural tension
   is deterministic policy vs probabilistic execution, and the policy lives in the surrounding system.
6. **Make acceptance an eval seam, not "it runs."** An AI feature's correctness is a measurable eval over
   cases — design the seam where that eval plugs in. (If the *what* of the feature is in question, that's
   the product manager's call — consult them.)

## The discipline
- The model is a fast junior that writes confidently-wrong code; the architecture's guardrails are what
  keep its output honest at scale.
- Don't over-rotate: this is the simplicity/evolvability craft applied to a new reader, not a license for
  AI-driven novelty everywhere.
