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
  { name: 'PAIN_POINTS',    values: PAIN_POINTS    as readonly string[] },
  { name: 'TOOL_OPTIONS',   values: TOOL_OPTIONS   as readonly string[] },
  { name: 'TEAM_SIZES',     values: TEAM_SIZES     as readonly string[] },
  { name: 'REVENUE_RANGES', values: REVENUE_RANGES as readonly string[] },
  { name: 'BUDGET_RANGES',  values: BUDGET_RANGES  as readonly string[] },
  { name: 'TIMELINES',      values: TIMELINES      as readonly string[] },
  { name: 'INDUSTRIES',     values: INDUSTRIES     as readonly string[] },
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
  it('BUDGET_RANGES contains the tier boundary values used in getRecommendedTier', () => {
    expect(BUDGET_RANGES).toContain('Over R20,000/month')
    expect(BUDGET_RANGES).toContain('R8,000 – R20,000/month')
    expect(BUDGET_RANGES).toContain('R3,000 – R8,000/month')
  })

  it('TEAM_SIZES contains the size bands used in getROIEstimate', () => {
    expect(TEAM_SIZES).toContain('100+')
    expect(TEAM_SIZES).toContain('51–100')
    expect(TEAM_SIZES).toContain('21–50')
    expect(TEAM_SIZES).toContain('6–20')
    expect(TEAM_SIZES).toContain('1–5')
  })
})
