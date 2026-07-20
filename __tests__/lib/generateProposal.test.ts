import { describe, it, expect } from 'vitest'
import { renderToBuffer } from '@react-pdf/renderer'
import { generateProposalDocument } from '@/lib/generateProposal'
import { getRecommendedServices } from '@/lib/recommendedServices'
import type { AssessmentFormData } from '@/types/assessment'
import type { ProposalCopy } from '@/lib/generateProposalCopy'

describe('smoke: PDF actually renders', () => {
  it('renders for a lead with multiple recommended services (primary + secondary)', async () => {
    const data: AssessmentFormData = {
      business_name: 'Acme Logistics',
      contact_name: 'Jane Doe',
      email: 'jane@acme.co.za',
      phone: '0821234567',
      industry: 'Logistics / Supply Chain',
      team_size: '51–100',
      pain_points: [
        'Manual data entry across multiple systems',
        'Slow invoice or quote processing',
        'Inconsistent lead follow-up',
        'Repeatedly answering the same customer or staff questions',
      ],
      current_tools: ['Shopify', 'Xero', 'HubSpot', 'Slack'],
      time_drains: 'Reconciling orders manually every week',
      desired_outcomes: 'Faster order processing and fewer errors',
      revenue_range: 'R5M – R20M/year',
      budget_range: 'Over R20,000/month',
      timeline: 'ASAP – we have an urgent problem',
      additional_notes: '',
    }

    const recommended = getRecommendedServices(data)
    expect(recommended.length).toBeGreaterThan(1) // exercises both primary + secondary card paths

    const service_narratives: ProposalCopy['service_narratives'] = {}
    for (const s of recommended) {
      service_narratives[s.name] =
        `Smoke-test narrative for ${s.name}, tailored to Acme Logistics, mentioning fewer errors and faster turnaround.`
    }

    const copy: ProposalCopy = {
      cover_subtitle:
        'Our AI-driven analysis identified clear automation opportunities for Acme Logistics.',
      exec_intro:
        'Acme Logistics operates in a fast-moving industry.\n\nAutomation can change how the team spends its time.',
      services_intro:
        'Our AI analyzed your assessment responses to identify which services fit best.',
      service_narratives,
      next_steps_intro: "Let's talk through this proposal together.",
    }

    const doc = generateProposalDocument(data, copy)
    const buffer = await renderToBuffer(doc)

    expect(buffer.length).toBeGreaterThan(1000)
    expect(buffer.subarray(0, 4).toString()).toBe('%PDF')
  })

  it('renders for a lead with only one recommended service (no secondary cards)', async () => {
    const data: AssessmentFormData = {
      business_name: 'Small Co',
      contact_name: 'Sam',
      email: 'sam@small.co.za',
      phone: '',
      industry: 'Technology',
      team_size: '1–5',
      pain_points: [],
      current_tools: [],
      time_drains: '',
      desired_outcomes: '',
      revenue_range: 'Under R1M/year',
      budget_range: 'Under R3,000/month',
      timeline: 'Just exploring options',
      additional_notes: '',
    }

    const recommended = getRecommendedServices(data)
    const service_narratives: ProposalCopy['service_narratives'] = {}
    for (const s of recommended) {
      service_narratives[s.name] = `Narrative for ${s.name}.`
    }

    const copy: ProposalCopy = {
      cover_subtitle: 'Subtitle',
      exec_intro: 'Intro',
      services_intro: 'Services intro',
      service_narratives,
      next_steps_intro: 'Next steps',
    }

    const doc = generateProposalDocument(data, copy)
    const buffer = await renderToBuffer(doc)

    expect(buffer.length).toBeGreaterThan(1000)
    expect(buffer.subarray(0, 4).toString()).toBe('%PDF')
  })
})
