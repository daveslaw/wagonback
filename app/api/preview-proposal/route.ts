import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createServerClient } from '@/lib/supabase'
import { generateProposalDocument } from '@/lib/generateProposal'
import { generateProposalCopy } from '@/lib/generateProposalCopy'
import { AssessmentFormData } from '@/types/assessment'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyElement = any

const COOKIE_NAME = 'wb_admin'

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value || ''
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const id = req.nextUrl.searchParams.get('id')
  if (!id) return new NextResponse('Missing id', { status: 400 })

  try {
    const supabase = createServerClient()
    const { data: row, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !row) return new NextResponse('Assessment not found', { status: 404 })

    const data = row as AssessmentFormData
    const proposalCopy = await generateProposalCopy(data)
    const doc: AnyElement = generateProposalDocument(data, proposalCopy)
    const pdfBuffer = await renderToBuffer(doc)

    const filename = `WagonBack-Preview-${(row.business_name as string).replace(/\s+/g, '-')}.pdf`

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    })
  } catch (err) {
    console.error('preview-proposal error:', err)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
