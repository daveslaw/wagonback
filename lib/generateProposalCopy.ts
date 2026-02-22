import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'
import { AssessmentFormData } from '@/types/assessment'

export interface ProposalCopy {
  cover_subtitle: string
  exec_intro: string
  integration_intro: string
  solution_intro: string
  solution_tier_description: string
  roi_body: string
  next_steps_intro: string
}

const FALLBACK_COPY: ProposalCopy = {
  cover_subtitle:
    'An automation and integration plan prepared specifically for your business and the challenges you described.',
  exec_intro:
    'Your business is at a point where the manual work holding you back is no longer a small inconvenience — it is a constraint on growth. The good news is that the tools and workflows you already have in place are exactly the right foundation to build on.\n\nWagon Back Solutions has reviewed your assessment and identified clear, high-value opportunities to connect your systems, eliminate repetitive tasks, and give your team time back for work that actually moves the business forward.',
  integration_intro:
    'The platforms your business uses today create natural integration points. Rather than replacing what works, we build the connections between them — so data flows automatically, without anyone in the middle copying, pasting, or chasing updates.',
  solution_intro:
    'After reviewing your team size, workflow complexity, and budget range, we have identified the right automation tier for where your business is today and where it is heading.',
  solution_tier_description:
    'Designed for businesses that need reliable, scalable automation without the overhead of managing it themselves. Handles multi-step workflows, real-time data sync, and grows with your business.',
  roi_body:
    'Conservative estimates point to meaningful time savings from the first week of deployment. For a team of your size, that typically translates to hours reclaimed per person, per week — time that was previously lost to manual data entry, chasing updates, or fixing errors that crept in between systems.\n\nBeyond raw hours, the compounding benefits tend to be equally valuable: fewer mistakes at month-end, faster response times to new leads, and the confidence that comes from knowing your systems are in sync without anyone having to check.',
  next_steps_intro:
    "We'd love to walk you through this proposal and refine the scope together. The next step is a short discovery call — no obligation, just a conversation.",
}

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
}

export function getRecommendedTier(data: AssessmentFormData): string {
  const budget = data.budget_range
  if (budget?.includes('R20,000') || budget?.includes('Over')) return 'Enterprise Integration Layer'
  if (budget?.includes('R8,000') || budget?.includes('R3,000')) return 'Visual Workflow Engine'
  return 'AI-Native Automation'
}

export function getROIEstimate(data: AssessmentFormData): string {
  const size = data.team_size
  if (size === '100+' || size === '51–100') return '20–40 hours/week across your team'
  if (size === '21–50') return '10–20 hours/week across your team'
  if (size === '6–20') return '5–15 hours/week across your team'
  return '3–10 hours/week'
}

export async function generateProposalCopy(data: AssessmentFormData): Promise<ProposalCopy> {
  try {
    const systemPrompt = fs.readFileSync(
      path.join(process.cwd(), 'content', 'proposal-prompt.md'),
      'utf-8'
    )

    const tier = getRecommendedTier(data)
    const roi = getROIEstimate(data)

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
- Recommended automation tier: ${tier}
- Estimated weekly time savings: ${roi}`

    const anthropic = getAnthropic()
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1800,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''

    // Strip markdown code fences if Claude adds them despite instructions
    const cleaned = text
      .replace(/^```(?:json)?\s*/m, '')
      .replace(/\s*```$/m, '')
      .trim()

    const parsed = JSON.parse(cleaned) as ProposalCopy

    // Fill in any missing keys with fallback
    const keys: (keyof ProposalCopy)[] = [
      'cover_subtitle',
      'exec_intro',
      'integration_intro',
      'solution_intro',
      'solution_tier_description',
      'roi_body',
      'next_steps_intro',
    ]
    for (const key of keys) {
      if (!parsed[key]) parsed[key] = FALLBACK_COPY[key]
    }

    return parsed
  } catch (err) {
    console.error('generateProposalCopy failed, using fallback copy:', err)
    return FALLBACK_COPY
  }
}
