import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createServerClient } from '@/lib/supabase'
import { generateProposalDocument } from '@/lib/generateProposal'
import { sendProposalEmail, sendInternalNotification } from '@/lib/sendProposalEmail'
import { AssessmentFormData } from '@/types/assessment'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyElement = any

export async function POST(req: NextRequest) {
  try {
    const data: AssessmentFormData = await req.json()

    // Validate required fields
    if (!data.business_name || !data.contact_name || !data.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
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
      return NextResponse.json({ error: 'Failed to save assessment' }, { status: 500 })
    }

    // 2. Generate PDF
    const doc: AnyElement = generateProposalDocument(data)
    const pdfBuffer = await renderToBuffer(doc)

    // 3. Send proposal email to prospect
    await sendProposalEmail(data, Buffer.from(pdfBuffer))

    // 4. Send internal notification (optional — only if env var set)
    await sendInternalNotification(data).catch((err) =>
      console.warn('Internal notification failed (non-fatal):', err)
    )

    return NextResponse.json({ success: true, id: inserted.id })
  } catch (err) {
    console.error('Assessment API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
