import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import * as Sentry from '@sentry/nextjs'
import { createServerClient } from '@/lib/supabase'
import { generateProposalDocument } from '@/lib/generateProposal'
import { generateProposalCopy } from '@/lib/generateProposalCopy'
import { sendProposalEmail } from '@/lib/sendProposalEmail'
import { AssessmentFormData } from '@/types/assessment'
import { getPostHogClient } from '@/lib/posthog-server'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyElement = any

const COOKIE_NAME = 'wb_admin'

type PipelineResult =
  | { status: 401 | 400 | 404 | 500; error: string; row?: never; data?: never }
  | { status: 409; error: string; row: Record<string, unknown>; data?: never }
  | { status: 200; error?: never; row?: never; data: AssessmentFormData }

async function runPipeline(id: string, token: string): Promise<PipelineResult> {
  // 1. Auth check
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return { status: 401, error: 'Unauthorized' }
  }
  if (!id) {
    return { status: 400, error: 'Missing id' }
  }

  const supabase = createServerClient()

  // 2. Fetch the assessment row
  const { data: row, error: fetchError } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !row) {
    return { status: 404, error: 'Assessment not found' }
  }

  // 3. Prevent double-sending
  if (row.proposal_sent_at) {
    return { status: 409, error: 'Proposal already sent', row }
  }

  const data = row as AssessmentFormData

  // 4. Generate bespoke copy via Claude
  const proposalCopy = await generateProposalCopy(data)

  // 5. Generate PDF
  const doc: AnyElement = generateProposalDocument(data, proposalCopy)
  const pdfBuffer = await renderToBuffer(doc)

  // 6. Email to prospect
  await sendProposalEmail(data, Buffer.from(pdfBuffer))

  // 7. Mark as sent
  const { error: markError } = await supabase
    .from('assessments')
    .update({ proposal_sent_at: new Date().toISOString() })
    .eq('id', id)
  if (markError) {
    // Non-fatal but worth knowing — email went out but DB wasn't updated
    Sentry.captureException(new Error('Failed to mark proposal as sent'), {
      extra: { supabaseError: markError, assessmentId: id },
    })
    console.error('Failed to mark proposal as sent — email was delivered but row not updated:', markError)
  }

  // 8. Track proposal sent server-side
  const posthog = getPostHogClient()
  posthog.capture({
    distinctId: data.email,
    event: 'proposal_sent',
    properties: {
      assessment_id: id,
      industry: data.industry,
      team_size: data.team_size,
      budget_range: data.budget_range,
    },
  })
  await posthog.shutdown()

  return { status: 200, data }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value || ''
    const { id } = await req.json()
    const result = await runPipeline(id, token)

    if (result.status !== 200) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    Sentry.captureException(err, { tags: { context: 'generate-proposal' } })
    console.error('generate-proposal error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
