---
name: make-the-economic-case
description: Use when a design choice has to be justified to a founder/non-technical stakeholder, when proposing to spend (or take on) time/money/debt, or when "why does this matter to the business?" — ride the elevator: translate the technical decision into cost, value, and risk in the language of the business.
---
# Make the economic case — ride the architect elevator

A technical decision the business doesn't understand is a decision the business can't fund, defend, or
trust. Gregor Hohpe's **architect elevator**: the architect rides between the *engine room* (the code and
the trade-offs) and the *penthouse* (strategy, money, risk) — and the defining skill is **translating the
technical call into the business argument**, up and down. A design you can't justify in cost, value, and
risk to the founder is not yet finished, no matter how sound the -ilities.

This is the half of the architect's job that lives outside the diagram. The trade-off analysis
(`weigh-the-tradeoffs`) produces the *technical* cost; this skill prices it for the person who pays.

## The method
1. **Translate the driver into a business consequence.** Don't say "this improves p99 latency"; say "this
   keeps checkout from timing out at the traffic we expect next quarter, which is where we lose paying
   carts." Every ranked -ility maps to money, time-to-market, or risk — make the mapping explicit.
2. **Price the option, not just the build.** Architecture is options (Hohpe: *sell options*). State the
   cost of *buying* the option (the work now) AND the value of *holding* it (what staying flexible is
   worth) AND the **cost of delay** if you wait. "Adding this seam costs ~2 days now and saves a
   multi-week migration if we switch providers — which our roadmap says is likely."
3. **Name the cost of being wrong, both ways.** Over-building has a cost (time-to-market, carrying
   complexity); under-building has a cost (the irreversible call made wrong, the rewrite). Put both on the
   table so the founder owns a *real* choice, not a one-sided pitch.
4. **Make debt a deliberate, dated decision — not an accident.** When you recommend taking on technical
   debt to hit a date, say so out loud: what shortcut, what it buys (ship X weeks sooner), what it'll cost
   to repay, and the trigger to repay it. Deliberate debt with a payoff plan is a sound business move;
   silent debt is the expensive kind. Record it (`record-the-decision`).
5. **Tie quality to speed (the design-stamina argument).** Internal quality is usually invisible to the
   business, so it gets cut first. The case for it is economic: good-enough design *pays back in delivery
   speed* within weeks, not years — that's why simplicity and evolvability are an investment, not a tax.
6. **Recommend in their language, decide in yours.** Give the founder the decision they actually own (the
   business trade), framed in cost/value/risk — then carry the technical execution yourself.

## The discipline
- This is not finance theater — rough, honest numbers beat false precision. "Roughly days vs weeks,"
  "small vs large blast radius" is enough to make the trade real.
- Stay in lane: you make the case for the **how** (the design's cost/value/risk). The **what** and
  whether the *feature* is worth building is the product manager's call — frame the technical economics,
  don't redefine the product bet (consult `product-manager`).
- A founder who can repeat *why* the design costs what it costs is your best fitness function against the
  decision being undone later under deadline pressure.
