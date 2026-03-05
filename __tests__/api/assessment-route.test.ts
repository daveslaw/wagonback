import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AssessmentFormData, INDUSTRIES, TEAM_SIZES, REVENUE_RANGES, BUDGET_RANGES, TIMELINES } from '@/types/assessment'

// Mock all external services before any imports that might pull them in
vi.mock('@/lib/supabase')
vi.mock('@/lib/posthog-server', () => ({
  getPostHogClient: vi.fn(() => ({
    identify: vi.fn(),
    capture: vi.fn(),
    shutdown: vi.fn().mockResolvedValue(undefined),
  })),
}))
vi.mock('@/lib/sendProposalEmail', () => ({
  sendInternalNotification: vi.fn().mockResolvedValue(undefined),
}))

import { createServerClient } from '@/lib/supabase'
import { POST } from '@/app/api/assessment/route'

// ── Supabase builder mock factory ─────────────────────────────────────────────
// Simulates the Supabase query builder chain used in the route:
//   email rate limit: .from().select().eq('email', ...).gte() → { count }
//   IP rate limit:    .from().select().eq('submitter_ip', ...).gte() → { count }
//   insert:           .from().insert().select('id').single() → { data, error }
//   ip update:        .from().update().eq('id', ...).then(cb) → fire-and-forget

function makeSupabaseMock({
  emailCount = 0,
  ipCount = 0,
  insertResult = { data: { id: 'test-id' }, error: null } as { data: { id: string } | null, error: unknown },
} = {}) {
  let gteCallCount = 0

  const builder: Record<string, ReturnType<typeof vi.fn>> = {
    select: vi.fn(),
    eq:     vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    single: vi.fn().mockResolvedValue(insertResult),
    // thenable for the fire-and-forget ip update: .update().eq().then(cb)
    then:   vi.fn((cb: (v: { error: null }) => void) => Promise.resolve(cb({ error: null }))),
    gte:    vi.fn(() => {
      gteCallCount++
      if (gteCallCount === 1) return Promise.resolve({ count: emailCount })
      return Promise.resolve({ count: ipCount })
    }),
  }

  // Every builder method returns the same builder (chainable)
  builder.select.mockReturnValue(builder)
  builder.eq.mockReturnValue(builder)
  builder.insert.mockReturnValue(builder)
  builder.update.mockReturnValue(builder)

  return { from: vi.fn(() => builder) }
}

// ── Test fixtures ─────────────────────────────────────────────────────────────

const validData: AssessmentFormData = {
  business_name:    'Test Corp',
  contact_name:     'Jane Doe',
  email:            'jane@testcorp.com',
  phone:            '0800000000',
  industry:         INDUSTRIES[0],       // 'Retail / E-commerce'
  team_size:        TEAM_SIZES[1],       // '6–20'
  pain_points:      [],
  current_tools:    [],
  time_drains:      'Too much manual work',
  desired_outcomes: 'Automate reporting',
  revenue_range:    REVENUE_RANGES[0],   // 'Under R1M/year'
  budget_range:     BUDGET_RANGES[1],    // 'R3,000 – R8,000/month'
  timeline:         TIMELINES[0],        // 'ASAP – we have an urgent problem'
  additional_notes: '',
}

function makeReq(body: object, headers: Record<string, string> = {}) {
  return new Request('http://localhost/api/assessment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  }) as unknown as import('next/server').NextRequest
}

beforeEach(() => {
  vi.mocked(createServerClient).mockReturnValue(makeSupabaseMock() as ReturnType<typeof createServerClient>)
})

// ── Validation ────────────────────────────────────────────────────────────────

describe('POST /api/assessment — validation', () => {
  it('returns 400 when required fields are missing', async () => {
    const res = await POST(makeReq({ email: 'test@test.com' }))
    expect(res.status).toBe(400)
    expect((await res.json()).error).toMatch(/required/i)
  })

  it('returns 400 for an invalid email format', async () => {
    const res = await POST(makeReq({ ...validData, email: 'not-an-email' }))
    expect(res.status).toBe(400)
    expect((await res.json()).error).toMatch(/email/i)
  })

  it('returns 400 for an invalid industry value', async () => {
    const res = await POST(makeReq({ ...validData, industry: 'Fake Industry' }))
    expect(res.status).toBe(400)
    expect((await res.json()).error).toMatch(/industry/i)
  })

  it('returns 400 for an invalid team_size value', async () => {
    const res = await POST(makeReq({ ...validData, team_size: '999' }))
    expect(res.status).toBe(400)
    expect((await res.json()).error).toMatch(/team_size/i)
  })

  it('returns 400 for an invalid budget_range value', async () => {
    const res = await POST(makeReq({ ...validData, budget_range: 'Loads of money' }))
    expect(res.status).toBe(400)
    expect((await res.json()).error).toMatch(/budget_range/i)
  })

  it('returns 400 for an invalid timeline value', async () => {
    const res = await POST(makeReq({ ...validData, timeline: 'Eventually' }))
    expect(res.status).toBe(400)
    expect((await res.json()).error).toMatch(/timeline/i)
  })

  it('returns 400 when a free-text field exceeds 2000 characters', async () => {
    const res = await POST(makeReq({ ...validData, time_drains: 'x'.repeat(2001) }))
    expect(res.status).toBe(400)
    expect((await res.json()).error).toMatch(/too long/i)
  })

  it('returns 400 when desired_outcomes exceeds 2000 characters', async () => {
    const res = await POST(makeReq({ ...validData, desired_outcomes: 'y'.repeat(2001) }))
    expect(res.status).toBe(400)
    expect((await res.json()).error).toMatch(/too long/i)
  })
})

// ── Rate limiting ─────────────────────────────────────────────────────────────

describe('POST /api/assessment — rate limiting', () => {
  it('returns 429 when the same email was submitted within the last 24 hours', async () => {
    vi.mocked(createServerClient).mockReturnValue(
      makeSupabaseMock({ emailCount: 1 }) as ReturnType<typeof createServerClient>
    )
    const res = await POST(makeReq(validData))
    expect(res.status).toBe(429)
    expect((await res.json()).error).toMatch(/recently received/i)
  })

  it('returns 429 when the same IP has exceeded the hourly limit', async () => {
    vi.mocked(createServerClient).mockReturnValue(
      makeSupabaseMock({ ipCount: 5 }) as ReturnType<typeof createServerClient>
    )
    const res = await POST(makeReq(validData, { 'x-forwarded-for': '1.2.3.4' }))
    expect(res.status).toBe(429)
    expect((await res.json()).error).toMatch(/too many/i)
  })

  it('skips IP check when header is absent (ip = "unknown")', async () => {
    // With no forwarded-for header, IP is 'unknown' and the check is skipped entirely.
    // Submission should succeed (DB insert mock returns success).
    const res = await POST(makeReq(validData))
    expect(res.status).toBe(200)
  })
})

// ── Happy path & DB errors ────────────────────────────────────────────────────

describe('POST /api/assessment — happy path', () => {
  it('returns 200 with success and id on a valid submission', async () => {
    const res = await POST(makeReq(validData))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.id).toBe('test-id')
  })

  it('returns 500 when the DB insert fails', async () => {
    vi.mocked(createServerClient).mockReturnValue(
      makeSupabaseMock({
        insertResult: { data: null, error: { message: 'unique constraint', code: '23505' } },
      }) as ReturnType<typeof createServerClient>
    )
    const res = await POST(makeReq(validData))
    expect(res.status).toBe(500)
  })
})
