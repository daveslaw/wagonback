import { describe, it, expect } from 'vitest'
import {
  PAIN_POINTS,
  TOOL_OPTIONS,
  TEAM_SIZES,
  REVENUE_RANGES,
  BUDGET_RANGES,
  TIMELINES,
  INDUSTRIES,
} from '@/types/assessment'

const ALL_CONSTANTS = [
  { name: 'PAIN_POINTS', values: PAIN_POINTS as readonly string[] },
  { name: 'TOOL_OPTIONS', values: TOOL_OPTIONS as readonly string[] },
  { name: 'TEAM_SIZES', values: TEAM_SIZES as readonly string[] },
  { name: 'REVENUE_RANGES', values: REVENUE_RANGES as readonly string[] },
  { name: 'BUDGET_RANGES', values: BUDGET_RANGES as readonly string[] },
  { name: 'TIMELINES', values: TIMELINES as readonly string[] },
  { name: 'INDUSTRIES', values: INDUSTRIES as readonly string[] },
]

describe('assessment constants', () => {
  it.each(ALL_CONSTANTS)('$name is non-empty', ({ values }) => {
    expect(values.length).toBeGreaterThan(0)
  })

  it.each(ALL_CONSTANTS)('$name has no duplicate values', ({ values }) => {
    expect(new Set(values).size).toBe(values.length)
  })

  it.each(ALL_CONSTANTS)('$name values are all non-empty strings', ({ values }) => {
    for (const v of values) {
      expect(typeof v).toBe('string')
      expect(v.trim().length).toBeGreaterThan(0)
    }
  })

  // Spot-checks to guard against accidental deletions
  it('BUDGET_RANGES contains the boundary value used by Full Ecosystem Sync in getRecommendedServices', () => {
    expect(BUDGET_RANGES).toContain('Over R20,000/month')
  })

  it('TEAM_SIZES contains the size bands used by Full Ecosystem Sync in getRecommendedServices', () => {
    expect(TEAM_SIZES).toContain('100+')
    expect(TEAM_SIZES).toContain('51–100')
  })

  it('PAIN_POINTS contains the repeat-questions pain point used by AI Knowledge Systems', () => {
    expect(PAIN_POINTS).toContain('Repeatedly answering the same customer or staff questions')
  })
})
