# Fold Integration Opportunities into the Recommended Services page

The proposal PDF previously had two separate pages covering related ground: "Integration Opportunities" (5 hardcoded tool-pair rules, e.g. "Shopify → Accounting Auto-Sync") and "Recommended Solution" (single tier + team-size ROI). Redesigning around real Services required deciding whether the tool-pair page should stay standalone.

**Decision:** Both are replaced by one "Recommended Services" page. Matched tool-pair rules are folded in as supporting sub-bullets under their corresponding Service's card (e.g. tool-pair rules that used to justify a generic "integration" pitch now sit under "Quick-Win Automations" or "Full Ecosystem Sync"). The PDF drops from 5 pages to 4. ROI stays denominated in hours/week only — no Rand-denominated savings figure was added, since the assessment doesn't collect a labor-cost input and deriving one from `revenue_range` was considered and dropped as out of scope for this pass.

**Why:** the Service model already covers what the tool-pair rules were pointing at (they're concrete instances of a Service, not a separate axis of analysis) — keeping them as separate pages would repeat the same signal twice and cost the reader an extra page for no new information.
