import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createServerClient } from '@/lib/supabase'
import { generateProposalDocument } from '@/lib/generateProposal'
import { generateProposalCopy } from '@/lib/generateProposalCopy'
import { sendProposalEmail } from '@/lib/sendProposalEmail'
import { AssessmentFormData } from '@/types/assessment'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyElement = any

export async function POST(req: NextRequest) {
  try {
    const { id, token } = await req.json()

    // 1. Auth check
    if (!token || token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const supabase = createServerClient()

    // 2. Fetch the assessment row
    const { data: row, error: fetchError } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !row) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    // 3. Prevent double-sending
    if (row.proposal_sent_at) {
      return NextResponse.json({ error: 'Proposal already sent' }, { status: 409 })
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

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('generate-proposal error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
