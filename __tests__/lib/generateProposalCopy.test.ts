import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AssessmentFormData } from '@/types/assessment'

// Mock external dependencies before importing the module under test
vi.mock('@anthropic-ai/sdk')
vi.mock('@sentry/nextjs', () => ({ captureException: vi.fn() }))

import { getRecommendedTier, getROIEstimate, generateProposalCopy } from '@/lib/generateProposalCopy'
import Anthropic from '@anthropic-ai/sdk'

const base: AssessmentFormData = {
  business_name: 'Test Corp',
  contact_name: 'Jane Doe',
  email: 'jane@test.com',
  phone: '',
  industry: 'Technology',
  team_size: '6–20',
  pain_points: ['Manual data entry across multiple systems'],
  current_tools: ['HubSpot'],
  time_drains: 'Too many manual reports',
  desired_outcomes: 'Automate everything',
  revenue_range: 'R1M – R5M/year',
  budget_range: 'R3,000 – R8,000/month',
  timeline: 'Within 1–3 months',
  additional_notes: '',
}

// ── getRecommendedTier ────────────────────────────────────────────────────────

describe('getRecommendedTier', () => {
  it('returns Enterprise Integration Layer for Over R20,000/month', () => {
    expect(getRecommendedTier({ ...base, budget_range: 'Over R20,000/month' }))
      .toBe('Enterprise Integration Layer')
  })

  it('returns Visual Workflow Engine for R8,000 – R20,000/month', () => {
    expect(getRecommendedTier({ ...base, budget_range: 'R8,000 – R20,000/month' }))
      .toBe('Visual Workflow Engine')
  })

  it('returns Visual Workflow Engine for R3,000 – R8,000/month', () => {
    expect(getRecommendedTier({ ...base, budget_range: 'R3,000 – R8,000/month' }))
      .toBe('Visual Workflow Engine')
  })

  it('returns AI-Native Automation for lower budgets', () => {
    expect(getRecommendedTier({ ...base, budget_range: 'Under R3,000/month' }))
      .toBe('AI-Native Automation')
    expect(getRecommendedTier({ ...base, budget_range: 'Not sure yet' }))
      .toBe('AI-Native Automation')
  })
})

// ── getROIEstimate ────────────────────────────────────────────────────────────

describe('getROIEstimate', () => {
  it.each([
    ['100+',    '20–40 hours/week across your team'],
    ['51–100',  '20–40 hours/week across your team'],
    ['21–50',   '10–20 hours/week across your team'],
    ['6–20',    '5–15 hours/week across your team'],
    ['1–5',     '3–10 hours/week'],
  ])('team size %s → %s', (size, expected) => {
    expect(getROIEstimate({ ...base, team_size: size })).toBe(expected)
  })
})

// ── generateProposalCopy ──────────────────────────────────────────────────────

describe('generateProposalCopy', () => {
  let mockCreate: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockCreate = vi.fn()
    vi.mocked(Anthropic).mockImplementation(() => ({
      messages: { create: mockCreate },
    }) as unknown as Anthropic)
  })

  it('returns valid fallback copy when the API throws', async () => {
    mockCreate.mockRejectedValue(new Error('API unavailable'))
    const result = await generateProposalCopy(base)
    // All 7 keys must be present and non-empty
    const keys = ['cover_subtitle', 'exec_intro', 'integration_intro',
                  'solution_intro', 'solution_tier_description', 'roi_body', 'next_steps_intro'] as const
    for (const key of keys) {
      expect(result[key], `key "${key}" should be non-empty`).toBeTruthy()
    }
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
      integration_intro: 'Integrations',
      solution_intro: 'Solution',
      solution_tier_description: 'Tier desc',
      roi_body: 'ROI info',
      next_steps_intro: 'Next steps',
    }
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: '```json\n' + JSON.stringify(payload) + '\n```' }],
    })
    const result = await generateProposalCopy(base)
    expect(result.cover_subtitle).toBe('A subtitle')
    expect(result.next_steps_intro).toBe('Next steps')
  })

  it('fills missing keys from fallback copy', async () => {
    const partial = { cover_subtitle: 'Custom subtitle', exec_intro: 'Custom intro' }
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: JSON.stringify(partial) }],
    })
    const result = await generateProposalCopy(base)
    // Provided keys kept
    expect(result.cover_subtitle).toBe('Custom subtitle')
    expect(result.exec_intro).toBe('Custom intro')
    // Missing keys filled from fallback (non-empty)
    expect(result.integration_intro).toBeTruthy()
    expect(result.solution_intro).toBeTruthy()
    expect(result.roi_body).toBeTruthy()
    expect(result.next_steps_intro).toBeTruthy()
  })

  it('returns a successful parse when API responds with valid JSON', async () => {
    const full = {
      cover_subtitle: 'c', exec_intro: 'e', integration_intro: 'i',
      solution_intro: 's', solution_tier_description: 'd', roi_body: 'r', next_steps_intro: 'n',
    }
    mockCreate.mockResolvedValue({ content: [{ type: 'text', text: JSON.stringify(full) }] })
    const result = await generateProposalCopy(base)
    expect(result).toEqual(full)
  })
})
