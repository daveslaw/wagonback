import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { sendInternalNotification } from '@/lib/sendProposalEmail'
import { AssessmentFormData } from '@/types/assessment'

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

    // 2. Notify internally (non-fatal) — so you know a submission arrived
    await sendInternalNotification(data).catch((err) =>
      console.warn('Internal notification failed (non-fatal):', err)
    )

    return NextResponse.json({ success: true, id: inserted.id })
  } catch (err) {
    console.error('Assessment API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
