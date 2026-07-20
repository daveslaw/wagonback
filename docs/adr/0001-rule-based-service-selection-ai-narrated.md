# Rule-based Recommended Service selection, AI-narrated only

The proposal PDF's recommendation engine is being redesigned to recommend real Services (replacing the old fictional tier system) and to be marketed as "AI-driven." This raised the question of whether the AI itself should choose which Services to recommend.

**Decision:** Candidate Service selection and ROI Range computation stay fully rule-based and deterministic (pain points/tools/budget/team size → Services, same pattern as the pre-existing `integrationOpportunities.ts`). Claude is only used to write the narrative/copy around a pre-determined list of Recommended Services — it never chooses or reorders which Services appear. The "AI-driven" framing shown to the prospect describes the analysis in marketing language; the underlying selection logic is not what's AI-driven.

**Why:** a Recommended Service is effectively a claim about what WagonBack will sell this lead — auditability and consistency matter more here than the adaptability a free-form AI selection would add, and reusing the existing hybrid pattern avoids running two different decision-making systems (one deterministic, one not) side by side.

## Considered Options

- **Full AI-driven selection** — hand Claude the assessment + Service list and let it choose. Rejected: non-deterministic, harder to guarantee/audit what's being proposed to a paying customer.
- **Single best-fit Service only** (no primary/secondary) — Rejected: throws away real signal when a lead's pain points span multiple Services.
