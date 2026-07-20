import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AssessmentFormData } from '@/types/assessment'

// Mock external dependencies before importing the module under test
vi.mock('@anthropic-ai/sdk')
vi.mock('@sentry/nextjs', () => ({ captureException: vi.fn() }))

import { generateProposalCopy } from '@/lib/generateProposalCopy'
import Anthropic from '@anthropic-ai/sdk'

const base: AssessmentFormData = {
  business_name: 'Test Corp',
  contact_name: 'Jane Doe',
  email: 'jane@test.com',
  phone: '',
  industry: 'Technology',
  team_size: '6–20',
  pain_points: ['Manual data entry across multiple systems'],
  current_tools: ['HubSpot', 'Xero'],
  time_drains: 'Too many manual reports',
  desired_outcomes: 'Automate everything',
  revenue_range: 'R1M – R5M/year',
  budget_range: 'R3,000 – R8,000/month',
  timeline: 'Within 1–3 months',
  additional_notes: '',
}

// ── generateProposalCopy ──────────────────────────────────────────────────────

describe('generateProposalCopy', () => {
  let mockCreate: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockCreate = vi.fn()
    vi.mocked(Anthropic).mockImplementation(
      () =>
        ({
          messages: { create: mockCreate },
        }) as unknown as Anthropic
    )
  })

  it('returns valid fallback copy when the API throws', async () => {
    mockCreate.mockRejectedValue(new Error('API unavailable'))
    const result = await generateProposalCopy(base)
    const keys = ['cover_subtitle', 'exec_intro', 'services_intro', 'next_steps_intro'] as const
    for (const key of keys) {
      expect(result[key], `key "${key}" should be non-empty`).toBeTruthy()
    }
    expect(Object.keys(result.service_narratives).length).toBeGreaterThan(0)
  })

  it('returns fallback copy when the API returns malformed JSON', async () => {
    mockCreate.mockResolvedValue({ content: [{ type: 'text', text: 'not-valid-json{{{' }] })
    const result = await generateProposalCopy(base)
    expect(result.cover_subtitle).toBeTruthy()
    expect(result.exec_intro).toBeTruthy()
  })

  it('strips markdown code fences before parsing', async () => {
    const payload = {
      cover_subtitle: 'A subtitle',
      exec_intro: 'An intro',
      services_intro: 'Services intro',
      service_narratives: { '"Quick-Win" Automations': 'Quick win narrative' },
      next_steps_intro: 'Next steps',
    }
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: '```json\n' + JSON.stringify(payload) + '\n```' }],
    })
    const result = await generateProposalCopy(base)
    expect(result.cover_subtitle).toBe('A subtitle')
    expect(result.next_steps_intro).toBe('Next steps')
  })

  it('fills missing top-level keys from fallback copy', async () => {
    const partial = { cover_subtitle: 'Custom subtitle', exec_intro: 'Custom intro' }
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: JSON.stringify(partial) }],
    })
    const result = await generateProposalCopy(base)
    // Provided keys kept
    expect(result.cover_subtitle).toBe('Custom subtitle')
    expect(result.exec_intro).toBe('Custom intro')
    // Missing keys filled from fallback (non-empty)
    expect(result.services_intro).toBeTruthy()
    expect(result.next_steps_intro).toBeTruthy()
  })

  it('fills missing per-service narratives from fallback while keeping provided ones', async () => {
    const partial = {
      cover_subtitle: 'c',
      exec_intro: 'e',
      services_intro: 's',
      service_narratives: { '"Quick-Win" Automations': 'Custom narrative' },
      next_steps_intro: 'n',
    }
    mockCreate.mockResolvedValue({ content: [{ type: 'text', text: JSON.stringify(partial) }] })
    const result = await generateProposalCopy({
      ...base,
      pain_points: [],
      current_tools: [], // triggers the Process Redesign & Optimisation fallback candidate too
    })
    // A lead with these tools/pain points recommends Process Redesign & Optimisation (no AI-provided narrative)
    expect(result.service_narratives['Process Redesign & Optimisation']).toBeTruthy()
  })

  it('returns a successful parse when API responds with valid JSON', async () => {
    const full = {
      cover_subtitle: 'c',
      exec_intro: 'e',
      services_intro: 's',
      service_narratives: { '"Quick-Win" Automations': 'n1' },
      next_steps_intro: 'n',
    }
    mockCreate.mockResolvedValue({ content: [{ type: 'text', text: JSON.stringify(full) }] })
    const result = await generateProposalCopy(base)
    expect(result.cover_subtitle).toBe('c')
    expect(result.service_narratives['"Quick-Win" Automations']).toBe('n1')
  })
})
