import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createServerClient } from '@/lib/supabase'
import { generateProposalDocument } from '@/lib/generateProposal'
import { generateProposalCopy } from '@/lib/generateProposalCopy'
import { sendProposalEmail } from '@/lib/sendProposalEmail'
import { AssessmentFormData } from '@/types/assessment'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyElement = any

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
  await supabase
    .from('assessments')
    .update({ proposal_sent_at: new Date().toISOString() })
    .eq('id', id)

  return { status: 200, data }
}

export async function POST(req: NextRequest) {
  try {
    const { id, token } = await req.json()
    const result = await runPipeline(id, token)

    if (result.status !== 200) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('generate-proposal error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const id = searchParams.get('id') || ''
  const token = searchParams.get('token') || ''
  const adminUrl = `/admin?token=${encodeURIComponent(token)}`

  try {
    const result = await runPipeline(id, token)

    if (result.status === 401) {
      return htmlPage('Access Denied', 'Invalid token.', '#ff4444', 401)
    }
    if (result.status === 404) {
      return htmlPage('Not Found', 'This submission could not be found.', '#ff4444', 404)
    }
    if (result.status === 409) {
      const name = (result.row?.contact_name as string) || 'this contact'
      const biz = (result.row?.business_name as string) || 'this business'
      return htmlPage(
        'Already Sent',
        `A proposal was already sent to ${name} at ${biz}.`,
        '#888',
        200,
        adminUrl
      )
    }

    const name = result.data?.contact_name || 'the contact'
    const biz = result.data?.business_name || 'this business'
    return htmlPage(
      'Proposal Sent',
      `Successfully sent to ${name} at ${biz}.`,
      '#00c8ff',
      200,
      adminUrl
    )
  } catch (err) {
    console.error('generate-proposal GET error:', err)
    return htmlPage('Error', 'Something went wrong. Check Vercel logs.', '#ff4444', 500)
  }
}

function htmlPage(
  heading: string,
  body: string,
  accentColor: string,
  status: number,
  backUrl?: string
) {
  const backLink = backUrl
    ? `<a href="${backUrl}" style="margin-top:24px;display:inline-block;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#555;text-decoration:none;">← Back to admin</a>`
    : ''
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${heading} — Wagon Back</title>
</head>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:Helvetica,Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;">
  <div style="text-align:center;padding:40px 20px;">
    <p style="margin:0 0 12px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${accentColor};">Wagon Back Solutions</p>
    <h1 style="margin:0 0 16px;font-size:28px;font-weight:300;color:#f5f5f5;letter-spacing:1px;">${heading}</h1>
    <p style="margin:0;font-size:14px;color:#888;line-height:1.6;">${body}</p>
    ${backLink}
  </div>
</body>
</html>`
  return new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
