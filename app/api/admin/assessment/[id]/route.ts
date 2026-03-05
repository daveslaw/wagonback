import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { LeadStatus } from '@/types/assessment'

const COOKIE_NAME = 'wb_admin'
const VALID_STATUSES: LeadStatus[] = ['new', 'contacted', 'in_discussion', 'won', 'lost']

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get(COOKIE_NAME)?.value || ''
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const body = await req.json().catch(() => ({}))
  const update: Record<string, unknown> = {}

  if ('status' in body) {
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    update.status = body.status
  }
  if ('admin_notes' in body) {
    if (typeof body.admin_notes === 'string' && body.admin_notes.length > 5000) {
      return NextResponse.json({ error: 'admin_notes exceeds 5000 character limit' }, { status: 400 })
    }
    update.admin_notes = body.admin_notes ?? null
  }
  if ('archived' in body) update.archived = !!body.archived

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }

  const supabase = createServerClient()
  const { error } = await supabase.from('assessments').update(update).eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
