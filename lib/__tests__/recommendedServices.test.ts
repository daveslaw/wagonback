import { describe, it, expect } from 'vitest'
import { SERVICES, getRecommendedServices, getHeadlineTotal } from '../recommendedServices'
import type { AssessmentFormData } from '@/types/assessment'

function makeData(overrides: Partial<AssessmentFormData> = {}): AssessmentFormData {
  return {
    business_name: 'Test Co',
    contact_name: 'Jane',
    email: 'jane@test.co.za',
    phone: '',
    industry: 'Technology',
    team_size: '6–20',
    pain_points: [],
    current_tools: [],
    time_drains: '',
    desired_outcomes: '',
    revenue_range: 'R1M – R5M/year',
    budget_range: 'R3,000 – R8,000/month',
    timeline: 'Within 1–3 months',
    additional_notes: '',
    ...overrides,
  }
}

describe('SERVICES', () => {
  it('defines exactly the 5 real Services section offerings', () => {
    expect(SERVICES.map((s) => s.name)).toEqual([
      'Process Redesign & Optimisation',
      '"Quick-Win" Automations',
      'AI Knowledge Systems',
      'Custom Workflows & AI Skills',
      'Full Ecosystem Sync',
    ])
  })
})

describe('getRecommendedServices — candidate selection', () => {
  it('recommends "Quick-Win" Automations when a matching pain point and an integration tool are both present', () => {
    const data = makeData({
      pain_points: ['Manual data entry across multiple systems'],
      current_tools: ['Xero'],
    })
    const names = getRecommendedServices(data).map((s) => s.name)
    expect(names).toContain('"Quick-Win" Automations')
  })

  it('does not recommend "Quick-Win" Automations when the pain point matches but no integration tool is present', () => {
    const data = makeData({
      pain_points: ['Manual data entry across multiple systems'],
      current_tools: ['Custom ERP'],
    })
    const names = getRecommendedServices(data).map((s) => s.name)
    expect(names).not.toContain('"Quick-Win" Automations')
  })

  it('recommends Process Redesign & Optimisation when tools are minimal, even with no pain points', () => {
    const data = makeData({ pain_points: [], current_tools: [] })
    const names = getRecommendedServices(data).map((s) => s.name)
    expect(names).toContain('Process Redesign & Optimisation')
  })

  it('recommends AI Knowledge Systems for the new repeat-questions pain point', () => {
    const data = makeData({
      pain_points: ['Repeatedly answering the same customer or staff questions'],
    })
    const names = getRecommendedServices(data).map((s) => s.name)
    expect(names).toContain('AI Knowledge Systems')
  })

  it('recommends AI Knowledge Systems for a knowledge-heavy industry even with no matching pain point', () => {
    const data = makeData({ industry: 'Healthcare', pain_points: [] })
    const names = getRecommendedServices(data).map((s) => s.name)
    expect(names).toContain('AI Knowledge Systems')
  })

  it('recommends Custom Workflows & AI Skills for lead-follow-up pain points', () => {
    const data = makeData({ pain_points: ['Inconsistent lead follow-up'] })
    const names = getRecommendedServices(data).map((s) => s.name)
    expect(names).toContain('Custom Workflows & AI Skills')
  })

  it('recommends Full Ecosystem Sync for high budget regardless of pain points', () => {
    const data = makeData({ budget_range: 'Over R20,000/month', pain_points: [] })
    const names = getRecommendedServices(data).map((s) => s.name)
    expect(names).toContain('Full Ecosystem Sync')
  })

  it('recommends Full Ecosystem Sync for large team size', () => {
    const data = makeData({ team_size: '100+', pain_points: [] })
    const names = getRecommendedServices(data).map((s) => s.name)
    expect(names).toContain('Full Ecosystem Sync')
  })

  it('recommends Full Ecosystem Sync for a broad tool stack (4+ tools)', () => {
    const data = makeData({
      current_tools: ['Salesforce', 'Xero', 'Shopify', 'Slack'],
      pain_points: [],
    })
    const names = getRecommendedServices(data).map((s) => s.name)
    expect(names).toContain('Full Ecosystem Sync')
  })

  it('falls back to Process Redesign & Optimisation when nothing else matches', () => {
    const data = makeData({
      pain_points: [],
      current_tools: ['Custom ERP', 'Other'],
      budget_range: 'Under R3,000/month',
      team_size: '6–20',
      industry: 'Technology',
    })
    const result = getRecommendedServices(data)
    expect(result.length).toBeGreaterThan(0)
    expect(result.some((s) => s.name === 'Process Redesign & Optimisation')).toBe(true)
  })
})

describe('getRecommendedServices — ROI scaling', () => {
  it('centers on the midpoint when a service is a candidate via a non-pain-point signal with zero matched pain points', () => {
    const data = makeData({ industry: 'Healthcare', pain_points: [] }) // triggers AI Knowledge via industry, 0 pain points matched
    const aiKnowledge = getRecommendedServices(data).find((s) => s.name === 'AI Knowledge Systems')!
    const base = SERVICES.find((s) => s.name === 'AI Knowledge Systems')!.roiRange
    expect(aiKnowledge.roiRange.low).toBeGreaterThan(base.low)
    expect(aiKnowledge.roiRange.high).toBeLessThan(base.high)
  })

  it('produces a lower range when fewer trigger pain points are matched than when more are matched', () => {
    const oneMatched = makeData({
      pain_points: ['Manual data entry across multiple systems'], // 1 of 3 Quick-Win triggers
      current_tools: ['Xero'],
    })
    const twoMatched = makeData({
      pain_points: [
        'Manual data entry across multiple systems',
        'Slow invoice or quote processing',
      ], // 2 of 3
      current_tools: ['Xero'],
    })
    const oneRange = getRecommendedServices(oneMatched).find(
      (s) => s.name === '"Quick-Win" Automations'
    )!.roiRange
    const twoRange = getRecommendedServices(twoMatched).find(
      (s) => s.name === '"Quick-Win" Automations'
    )!.roiRange
    expect(oneRange.low).toBeLessThan(twoRange.low)
    expect(oneRange.high).toBeLessThan(twoRange.high)
  })

  it('centers Process Redesign & Optimisation on the midpoint when triggered by low tool count with zero matched pain points', () => {
    const data = makeData({ pain_points: [], current_tools: [] })
    const processRedesign = getRecommendedServices(data).find(
      (s) => s.name === 'Process Redesign & Optimisation'
    )!
    const base = SERVICES.find((s) => s.name === 'Process Redesign & Optimisation')!.roiRange
    expect(processRedesign.roiRange.low).toBeGreaterThan(base.low)
    expect(processRedesign.roiRange.high).toBeLessThan(base.high)
  })

  it('scales toward the high end of the base range when all trigger pain points are matched', () => {
    const data = makeData({
      pain_points: [
        'Manual data entry across multiple systems',
        'Slow invoice or quote processing',
        'Delayed order fulfillment',
      ],
      current_tools: ['Xero'],
    })
    const quickWin = getRecommendedServices(data).find((s) => s.name === '"Quick-Win" Automations')!
    const base = SERVICES.find((s) => s.name === '"Quick-Win" Automations')!.roiRange
    expect(quickWin.roiRange.high).toBe(base.high)
    expect(quickWin.roiRange.low).toBeGreaterThan(base.low)
  })

  it('shows a range centred on the midpoint for services with no pain-point triggers', () => {
    const data = makeData({ budget_range: 'Over R20,000/month', pain_points: [] })
    const sync = getRecommendedServices(data).find((s) => s.name === 'Full Ecosystem Sync')!
    const base = SERVICES.find((s) => s.name === 'Full Ecosystem Sync')!.roiRange
    expect(sync.roiRange.low).toBeGreaterThan(base.low)
    expect(sync.roiRange.high).toBeLessThan(base.high)
  })

  it('records which pain points matched for a recommended service', () => {
    const data = makeData({
      pain_points: ['Manual data entry across multiple systems'],
      current_tools: ['Xero'],
    })
    const quickWin = getRecommendedServices(data).find((s) => s.name === '"Quick-Win" Automations')!
    expect(quickWin.matchedPainPoints).toEqual(['Manual data entry across multiple systems'])
  })
})

describe('getRecommendedServices — primary selection', () => {
  it('marks exactly one service as primary, the one with the highest computed ROI range', () => {
    const data = makeData({
      pain_points: [
        'Manual data entry across multiple systems',
        'Slow invoice or quote processing',
        'Delayed order fulfillment',
      ],
      current_tools: ['Xero'],
      team_size: '100+', // also triggers Full Ecosystem Sync (higher base range)
    })
    const result = getRecommendedServices(data)
    const primaries = result.filter((s) => s.isPrimary)
    expect(primaries).toHaveLength(1)
    expect(primaries[0].name).toBe('Full Ecosystem Sync')
  })
})

describe('getRecommendedServices — tool-pair folding', () => {
  it('folds matching tool-pair opportunities under "Quick-Win" Automations', () => {
    const data = makeData({
      pain_points: ['Manual data entry across multiple systems'],
      current_tools: ['Shopify', 'Xero'],
    })
    const quickWin = getRecommendedServices(data).find((s) => s.name === '"Quick-Win" Automations')!
    const titles = quickWin.toolPairOpportunities.map((o) => o.title)
    expect(titles).toContain('Shopify → Accounting Auto-Sync')
  })

  it('never attaches the generic fallback opportunity to any service', () => {
    const data = makeData({
      pain_points: ['Manual data entry across multiple systems'],
      current_tools: ['Trello / Asana / Monday'],
    })
    const all = getRecommendedServices(data).flatMap((s) => s.toolPairOpportunities)
    expect(all.some((o) => o.title === 'Custom Integration Assessment')).toBe(false)
  })
})

describe('getHeadlineTotal', () => {
  it('sums the computed ranges of all recommended services', () => {
    const data = makeData({
      pain_points: ['Manual data entry across multiple systems'],
      current_tools: ['Xero'],
    })
    const result = getRecommendedServices(data)
    const total = getHeadlineTotal(result)
    const expectedLow = result.reduce((sum, s) => sum + s.roiRange.low, 0)
    const expectedHigh = result.reduce((sum, s) => sum + s.roiRange.high, 0)
    expect(total).toEqual({ low: expectedLow, high: expectedHigh })
  })

  it('returns zero for an empty list', () => {
    expect(getHeadlineTotal([])).toEqual({ low: 0, high: 0 })
  })
})
