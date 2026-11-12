# Evolve the brand accent from flat cyan to a cyan-to-indigo gradient

The UI/design refresh (wayfinder map "Improve website UI and design") needed a color/token direction. The site's brand accent (`#00c8ff` electric cyan on near-black) was flagged as feeling dated, and the effort's brief was to evolve — not replace — that identity. Three concrete directions were mocked up and compared live (dark/light toggle each): "Current+" (flat cyan, no change beyond token cleanup), "Deepwater" (cyan deepening into indigo via a gradient, cool-tinted neutrals throughout), and "Aurora" (cyan warming into mint).

**Decision:** Deepwater. The accent becomes a `linear-gradient(120deg, #00c8ff, #5b4fff)` (dark mode) / `linear-gradient(120deg, #0088c9, #4a3fe0)` (light mode, contrast-adjusted), applied via a unified CSS custom-property token layer (replacing today's scattered hardcoded arbitrary Tailwind values like `text-[#00c8ff]`). Neutrals shift from true achromatic gray to a cool blue-gray tint that echoes the new accent family. Light mode is a straight structural inversion of dark, not a separately designed mode.

**Why:** a single flat accent color was identified as part of what reads as "dated" in the first place; a gradient in the same hue family adds depth while staying recognizably the same brand, satisfying the "evolve, don't replace" constraint better than introducing an unrelated second color would. Deepwater was picked over the more conservative Current+ option after visual comparison — the bolder direction was preferred once seen concretely rather than described abstractly.

## Considered Options

- **Current+** — flat cyan retained, only the token architecture unified. Rejected after visual comparison: read as too close to the status quo for an effort explicitly meant to feel "more exciting."
- **Aurora** — cyan warming into mint/teal, green-cool neutrals. Rejected: preferred Deepwater's cooler, deeper mood over Aurora's warmer energy once both were seen side by side.
