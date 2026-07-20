# WagonBack Proposal Analysis

Domain language for how the assessment→proposal pipeline recommends automation work to a lead.

## Language

**Service**:
One of the five fixed offerings WagonBack sells (Process Redesign & Optimisation, "Quick-Win" Automations, AI Knowledge Systems, Custom Workflows & AI Skills, Full Ecosystem Sync), as listed on the marketing Services section — reused as the vocabulary for proposal recommendations.
_Avoid_: Tier, Automation Tier, Package

**Recommended Service**:
A Service selected as a candidate for a specific lead by deterministic rules applied to their assessment answers (pain points, tools, budget, team size). A lead can have multiple Recommended Services.
_Avoid_: Tier, Recommended Tier

**Primary Service**:
The Recommended Service with the highest computed ROI Range for a given lead; shown emphasized (larger card, full narrative, tool-pair detail) in the proposal.
_Avoid_: Main tier, Top pick

**Secondary Service**:
A Recommended Service other than the Primary Service; shown compact and de-emphasized (icon, one-line narrative, ROI range only) in the proposal.
_Avoid_: Also consider (use only as the on-page label, not as the domain term)

**Matched Pain Point**:
A pain point reported by the lead that also appears in a given Service's trigger list — used to scale that Service's ROI Range.

**ROI Range**:
The estimated hours/week saved for a lead by a given Recommended Service, interpolated between that Service's base low/high range according to how many of its Matched Pain Points were reported. Services triggered by non-pain-point signals (budget, team size, tool count) are shown at their range midpoint.
_Avoid_: ROI Estimate (the old single-bucket, team-size-only figure this replaces)

**Headline Total**:
The sum of all Recommended Services' ROI Ranges for a lead, shown as one prominent stat above the per-service breakdown.
