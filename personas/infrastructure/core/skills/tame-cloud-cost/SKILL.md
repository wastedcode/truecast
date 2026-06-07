---
name: tame-cloud-cost
description: Use when cloud spend is rising, unexplained, or unattributed, or before provisioning expensive resources — treat cost as an engineering metric: make it visible, attribute it, find waste, and right-size before the bill is the incident.
---
# Tame cloud cost — spend is an engineering metric, not finance's surprise

Cloud cost is an SLI of engineering discipline. Left unowned, it's discovered as a bill spike — and roughly
**$44B/yr of cloud spend is waste** industry-wide (FinOps Foundation, 2025). The FinOps stance: cost is a
shared, continuous engineering responsibility, not a quarterly finance cleanup — engineers who provision
resources own the cost of those resources.

## The method (FinOps: inform → optimize → operate)
1. **Make it visible (inform).** You can't manage what you can't see. Tag/label every resource by team /
   service / environment so spend is **attributable** — "the bill went up $4k" is useless; "service X's egress
   tripled" is actionable. Set budgets and anomaly alerts so a runaway cost pages *before* month-end.
2. **Find the waste (optimize).** The usual suspects, in ROI order:
   - **Idle/zombie resources** — un-attached disks, idle dev environments, over-provisioned clusters, forgotten
     load balancers. Pure waste; delete them.
   - **Right-sizing** — instances/pods provisioned for peak-that-never-comes; match to actual utilization (USE
     metrics). The most common single win.
   - **Commitment discounts** — reserved instances / savings plans / committed use for the steady-state
     baseline; on-demand only for the spiky top.
   - **Autoscaling + scale-to-zero** — scale with demand instead of paying for peak 24/7; turn off non-prod
     overnight.
   - **Data egress & storage tiers** — egress and cross-AZ traffic are silent budget-eaters; cold data belongs
     in cold storage.
3. **Make it a habit (operate).** Cost review as part of normal engineering, not a fire drill. A new expensive
   resource gets a cost estimate at the IaC plan stage, the way a new dependency gets a security look.

## The discipline
- **Don't optimize cost into an outage.** Right-sizing that removes the headroom you need for a traffic spike,
  or a spot-instance bet on a stateful workload, trades a bill for an incident. Cost optimization respects the
  SLO — reliability and cost are co-constraints, not "cheapest wins."
- Attribute before you optimize: chasing the wrong line item wastes the effort. The biggest, most-attributable
  line is where the leverage is.
- This is *your* lane operationally; the *business* tradeoff (is this product worth the infra spend?) is the
  founder's / product's call — surface the number, let them decide.
