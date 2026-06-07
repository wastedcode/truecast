---
name: design-the-ai-interaction
description: Use when designing any interface where AI acts, generates, or decides on the user's behalf (agents, generative UI, AI suggestions, automation). Design for trust and control — show status, make actions reversible, set expectations, and let users see and override the why.
---
# Design the AI interaction — for trust and control

The new usability frontier (and the new failure mode): interfaces where an AI generates, decides, or acts
for the user. The old heuristics still hold — but **user control and freedom** (heuristic #3) and
**visibility of system status** (heuristic #1) become make-or-break, because the system is now doing
things the user didn't directly trigger. Users in 2026 demand to know *why* an AI did something and to be
able to stop or undo it. An opaque, irreversible AI action is the design failure of the era.

## The principles
1. **Make it visible when the AI is working.** Show it's running and ideally *what* it's doing —
   never a silent, mysterious wait. (Visibility of system status.)
2. **Always offer an exit and an undo.** Every AI action must be cancelable mid-flight and reversible
   after. No irreversible action the user didn't explicitly confirm. (User control and freedom.)
3. **Let users test without consequences.** A preview / dry-run / "suggest, don't apply" mode so users can
   evaluate an AI proposal before it's real. Default to *suggest*, let the user *commit*.
4. **Set expectations.** Say what the AI can and can't do, roughly how long it takes, and that it can be
   wrong. Calibrate trust honestly — over-promising is a trust debt that comes due on the first bad output.
5. **Show the why (explainability).** Surface the basis for an AI decision/suggestion in plain terms and
   let the user inspect, edit, or override it. The user stays in control; the AI assists.
6. **Design the failure + low-confidence path.** AI is probabilistic — design the "I'm not sure," the
   wrong-answer recovery, and the graceful degradation, not just the demo-perfect output (`design-the-states`).

## The quality-gate role (critical, 2025–26)
AI-*generated* UI reliably **misses edge-case states, accessibility, and responsive breakpoints** —
"without a senior designer as a quality gate, AI-accelerated workflows become AI-accelerated technical
debt." When AI produces a design or front-end, **you are that gate**: run `heuristic-evaluation`,
`refuse-ai-slop`, `design-for-accessibility`, and `design-the-states` over its output before it ships.
Also: real personalization restructures the user's path — it's not swapping a greeting or a banner
(surface tweaks are decoration, not personalization).

## The discipline
- **WHAT the AI feature should do and its quality bar** is the product-manager's call (acceptance for an
  AI feature is an eval, not "it runs") — you own *how the user experiences and controls it.* Consult them
  on scope.
- Don't add AI for the trend — 54% of stakeholders want AI with no clear use case; the interaction must
  serve a real user job or it's slop with a model attached.
