import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { sendInternalNotification } from '@/lib/sendProposalEmail'
import {
  AssessmentFormData,
  INDUSTRIES,
  TEAM_SIZES,
  REVENUE_RANGES,
  BUDGET_RANGES,
  TIMELINES,
  PAIN_POINTS,
  TOOL_OPTIONS,
} from '@/types/assessment'
import { getPostHogClient } from '@/lib/posthog-server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_TEXT_LENGTH = 2000
// Rate limit: max submissions per window
const RATE_LIMIT_EMAIL_MAX = 1 // same email: 1 per 24 h
const RATE_LIMIT_IP_MAX = 5 // same IP:    5 per hour
const RATE_LIMIT_EMAIL_WINDOW_H = 24
const RATE_LIMIT_IP_WINDOW_H = 1

export async function POST(req: NextRequest) {
  // Read PostHog client-session IDs forwarded from the browser for event correlation
  const phDistinctId = req.headers.get('X-PostHog-Distinct-ID')
  const phSessionId = req.headers.get('X-PostHog-Session-ID')

  try {
    const data: AssessmentFormData = await req.json()

    // ── Rate limiting (uses existing Supabase — no extra infrastructure needed) ──
    const supabase = createServerClient()
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      req.headers.get('x-real-ip') ??
      'unknown'

    const emailWindowStart = new Date(
      Date.now() - RATE_LIMIT_EMAIL_WINDOW_H * 60 * 60 * 1000
    ).toISOString()
    const ipWindowStart = new Date(
      Date.now() - RATE_LIMIT_IP_WINDOW_H * 60 * 60 * 1000
    ).toISOString()

    // 1. Duplicate email check — prevents re-submissions and most spam bots
    if (data.email && EMAIL_RE.test(data.email)) {
      const { count: emailCount } = await supabase
        .from('assessments')
        .select('*', { count: 'exact', head: true })
        .eq('email', data.email.toLowerCase())
        .gte('created_at', emailWindowStart)

      if ((emailCount ?? 0) >= RATE_LIMIT_EMAIL_MAX) {
        return NextResponse.json(
          {
            error:
              'An assessment from this email was recently received. Contact us at hello@wagonback.com if you need assistance.',
          },
          { status: 429 }
        )
      }
    }

    // 2. IP-based check — secondary guard against high-volume attacks
    if (ip !== 'unknown') {
      const { count: ipCount } = await supabase
        .from('assessments')
        .select('*', { count: 'exact', head: true })
        .eq('submitter_ip', ip)
        .gte('created_at', ipWindowStart)

      if ((ipCount ?? 0) >= RATE_LIMIT_IP_MAX) {
        return NextResponse.json(
          { error: 'Too many submissions from this connection. Please try again later.' },
          { status: 429 }
        )
      }
    }
    // ── End rate limiting ──

    // Validate required fields
    if (!data.business_name || !data.contact_name || !data.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate email format
    if (!EMAIL_RE.test(data.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Validate enum fields against known constant arrays
    const enumChecks: [string, string | undefined, readonly string[]][] = [
      ['industry', data.industry, INDUSTRIES],
      ['team_size', data.team_size, TEAM_SIZES],
      ['revenue_range', data.revenue_range, REVENUE_RANGES],
      ['budget_range', data.budget_range, BUDGET_RANGES],
      ['timeline', data.timeline, TIMELINES],
    ]
    for (const [field, value, allowed] of enumChecks) {
      if (value && !(allowed as readonly string[]).includes(value)) {
        return NextResponse.json({ error: `Invalid value for ${field}` }, { status: 400 })
      }
    }

    // Validate multi-select array lengths against the defined option sets
    if (data.pain_points && data.pain_points.length > PAIN_POINTS.length) {
      return NextResponse.json({ error: 'Invalid selection' }, { status: 400 })
    }
    if (data.current_tools && data.current_tools.length > TOOL_OPTIONS.length) {
      return NextResponse.json({ error: 'Invalid selection' }, { status: 400 })
    }

    // Enforce length limits on free-text fields to prevent prompt bloat / oversized PDFs
    for (const field of ['time_drains', 'desired_outcomes', 'additional_notes'] as const) {
      if (data[field] && data[field].length > MAX_TEXT_LENGTH) {
        return NextResponse.json(
          {
            error: `Response too long — please keep each field under ${MAX_TEXT_LENGTH} characters`,
          },
          { status: 400 }
        )
      }
    }

    // Normalise email to lowercase before insert to prevent duplicate detection misses
    data.email = data.email.toLowerCase()

    // 1. Save to Supabase
    const { data: inserted, error: dbError } = await supabase
      .from('assessments')
      .insert([data])
      .select('id')
      .single()

    if (dbError) {
      console.error('Supabase error:', dbError)
      const posthog = getPostHogClient()
      posthog.capture({
        distinctId: phDistinctId ?? data.email,
        event: 'assessment_submission_error',
        properties: {
          error_type: 'db_error',
          ...(phSessionId && { $session_id: phSessionId }),
        },
      })
      await posthog.shutdown()
      return NextResponse.json({ error: 'Failed to save assessment' }, { status: 500 })
    }

    // 1b. Store submitter IP for rate limiting (non-fatal — requires submitter_ip column to exist)
    //     Run: ALTER TABLE assessments ADD COLUMN submitter_ip TEXT;
    if (ip !== 'unknown') {
      supabase
        .from('assessments')
        .update({ submitter_ip: ip })
        .eq('id', inserted.id)
        .then(({ error }) => {
          if (error)
            console.warn('submitter_ip update skipped (column may not exist yet):', error.message)
        })
    }

    // 2. Notify internally (non-fatal) — so you know a submission arrived
    await sendInternalNotification(data, inserted.id).catch((err) =>
      console.warn('Internal notification failed (non-fatal):', err)
    )

    // 3. Track successful assessment receipt server-side
    const posthog = getPostHogClient()
    posthog.identify({
      distinctId: phDistinctId ?? data.email,
      properties: {
        email: data.email,
        name: data.contact_name,
        business_name: data.business_name,
        industry: data.industry,
        team_size: data.team_size,
      },
    })
    posthog.capture({
      distinctId: phDistinctId ?? data.email,
      event: 'assessment_received',
      properties: {
        assessment_id: inserted.id,
        industry: data.industry,
        team_size: data.team_size,
        revenue_range: data.revenue_range,
        budget_range: data.budget_range,
        timeline: data.timeline,
        ...(phSessionId && { $session_id: phSessionId }),
      },
    })
    await posthog.shutdown()

    return NextResponse.json({ success: true, id: inserted.id })
  } catch (err) {
    console.error('Assessment API error:', err)
    const posthog = getPostHogClient()
    posthog.capture({
      distinctId: phDistinctId ?? 'unknown',
      event: 'assessment_submission_error',
      properties: {
        error_type: 'internal_server_error',
        ...(phSessionId && { $session_id: phSessionId }),
      },
    })
    await posthog.shutdown()
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
