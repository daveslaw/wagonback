import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { sendInternalNotification } from '@/lib/sendProposalEmail'
import { AssessmentFormData } from '@/types/assessment'
import { getPostHogClient } from '@/lib/posthog-server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_TEXT_LENGTH = 2000

export async function POST(req: NextRequest) {
  // Read PostHog client-session IDs forwarded from the browser for event correlation
  const phDistinctId = req.headers.get('X-PostHog-Distinct-ID')
  const phSessionId = req.headers.get('X-PostHog-Session-ID')

  try {
    const data: AssessmentFormData = await req.json()

    // Validate required fields
    if (!data.business_name || !data.contact_name || !data.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate email format
    if (!EMAIL_RE.test(data.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Enforce length limits on free-text fields to prevent prompt bloat / oversized PDFs
    for (const field of ['time_drains', 'desired_outcomes', 'additional_notes'] as const) {
      if (data[field] && data[field].length > MAX_TEXT_LENGTH) {
        return NextResponse.json(
          { error: `Response too long — please keep each field under ${MAX_TEXT_LENGTH} characters` },
          { status: 400 }
        )
      }
    }

    // 1. Save to Supabase
    const supabase = createServerClient()
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
