import Anthropic from '@anthropic-ai/sdk'
import * as Sentry from '@sentry/nextjs'
import { AssessmentFormData } from '@/types/assessment'
import { PROPOSAL_SYSTEM_PROMPT } from '@/content/proposal-prompt'
import { getRecommendedServices, getHeadlineTotal, ServiceName } from '@/lib/recommendedServices'

export interface ProposalCopy {
  cover_subtitle: string
  exec_intro: string
  services_intro: string
  service_narratives: Partial<Record<ServiceName, string>>
  next_steps_intro: string
}

const FALLBACK_SERVICE_NARRATIVES: Record<ServiceName, string> = {
  'Process Redesign & Optimisation':
    'Before any automation goes in, we map your workflows end to end and strip out the steps that only exist because no one has redesigned them. The result is a foundation that holds up as you grow, and fewer inconsistencies for your team to work around day to day.',
  '"Quick-Win" Automations':
    'We connect the tools you already use so information moves between them on its own — no more re-typing the same data into two systems. Most clients feel the difference within the first week: fewer errors, less admin, faster turnaround on the tasks that used to eat up a day.',
  'AI Knowledge Systems':
    'We train a custom AI on your internal documentation, SOPs, or catalogues so your team — and your customers — get accurate answers instantly, without waiting on whoever happens to know the answer. It also means service quality stops depending on who is available that day.',
  'Custom Workflows & AI Skills':
    'For the judgment-heavy work that is too nuanced for a simple template but too repetitive to keep doing by hand, we build intelligent pipelines that handle the routine parts and flag the parts that genuinely need a human. That means faster response times and fewer things falling through the cracks.',
  'Full Ecosystem Sync':
    'As you scale, keeping every system in sync manually stops being realistic. We build enterprise-grade integration across your core platforms so your operations can grow without your admin overhead growing alongside them — with real-time visibility instead of end-of-month reconciliation surprises.',
}

const FALLBACK_COPY: ProposalCopy = {
  cover_subtitle:
    'Our AI-driven analysis of your assessment identified clear, high-value automation opportunities specific to your business.',
  exec_intro:
    'Your business is at a point where the manual work holding you back is no longer a small inconvenience — it is a constraint on growth. The good news is that the tools and workflows you already have in place are exactly the right foundation to build on.\n\nWagon Back Solutions has reviewed your assessment and identified clear, high-value opportunities to connect your systems, eliminate repetitive tasks, and give your team time back for work that actually moves the business forward.',
  services_intro:
    'Our AI analyzed your assessment responses — your pain points, your current tools, and how your business is structured — to identify which of our services would create the most value for you. Here is what we recommend, and what it should mean for your week.',
  service_narratives: FALLBACK_SERVICE_NARRATIVES,
  next_steps_intro:
    "We'd love to walk you through this proposal and refine the scope together. The next step is a short discovery call — no obligation, just a conversation.",
}

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
}

export async function generateProposalCopy(data: AssessmentFormData): Promise<ProposalCopy> {
  const recommended = getRecommendedServices(data)
  const headlineTotal = getHeadlineTotal(recommended)

  try {
    const serviceNames = recommended.map((s) => s.name)

    const userMessage = `Client Assessment:

Business Name: ${data.business_name}
Contact: ${data.contact_name}
Industry: ${data.industry}
Team Size: ${data.team_size}
Revenue Range: ${data.revenue_range || 'Not provided'}
Budget Range: ${data.budget_range}
Timeline: ${data.timeline}

Pain Points:
${(data.pain_points ?? []).map((p) => `- ${p}`).join('\n')}

Current Tools in Use:
${(data.current_tools ?? []).map((t) => `- ${t}`).join('\n')}

Time Drains (client's own words):
"${data.time_drains}"

Desired Outcomes (client's own words):
"${data.desired_outcomes}"

Additional Notes: ${data.additional_notes || 'None'}

---
Computed values for your reference (do not repeat these verbatim — weave them in naturally):
- Recommended services for this client, in priority order: ${serviceNames.join(', ') || 'None'}
- Estimated combined time savings: ${headlineTotal.low}–${headlineTotal.high} hours/week
- Per-service detail:
${recommended
  .map(
    (s) =>
      `  - ${s.name} (${s.isPrimary ? 'primary recommendation' : 'also worth considering'}): ${s.roiRange.low}–${s.roiRange.high} hrs/week. Matched pain points: ${s.matchedPainPoints.join('; ') || 'none — matched on business profile instead'}`
  )
  .join('\n')}

The "service_narratives" object in your response must have exactly one key per recommended service, using these exact names: ${serviceNames.map((n) => `"${n}"`).join(', ')}`

    const anthropic = getAnthropic()
    const message = await anthropic.messages.create(
      {
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1800,
        system: PROPOSAL_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      },
      { timeout: 25000 }
    )

    const text = message.content[0].type === 'text' ? message.content[0].text : ''

    // Strip markdown code fences if Claude adds them despite instructions
    const cleaned = text
      .replace(/^```(?:json)?\s*/m, '')
      .replace(/\s*```$/m, '')
      .trim()

    const parsed = JSON.parse(cleaned) as ProposalCopy

    // Fill in any missing top-level keys with fallback
    const keys: (keyof Omit<ProposalCopy, 'service_narratives'>)[] = [
      'cover_subtitle',
      'exec_intro',
      'services_intro',
      'next_steps_intro',
    ]
    for (const key of keys) {
      if (!parsed[key]) parsed[key] = FALLBACK_COPY[key]
    }

    // Fill in missing per-service narratives with fallback, one service at a time
    parsed.service_narratives = parsed.service_narratives ?? {}
    for (const name of serviceNames) {
      if (!parsed.service_narratives[name]) {
        parsed.service_narratives[name] = FALLBACK_SERVICE_NARRATIVES[name]
      }
    }

    return parsed
  } catch (err) {
    // Report to Sentry — this is a silent failure (fallback copy used) so it won't surface otherwise
    Sentry.captureException(err, { tags: { context: 'generateProposalCopy' } })
    console.error('generateProposalCopy failed, using fallback copy:', err)
    return FALLBACK_COPY
  }
}
