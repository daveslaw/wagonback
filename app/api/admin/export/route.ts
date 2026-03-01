import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

const COOKIE_NAME = 'wb_admin'

function csvCell(val: unknown): string {
  if (val === null || val === undefined) return ''
  const s = Array.isArray(val) ? val.join('; ') : String(val)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

const COLUMNS = [
  'id',
  'created_at',
  'business_name',
  'contact_name',
  'email',
  'phone',
  'industry',
  'team_size',
  'revenue_range',
  'budget_range',
  'timeline',
  'pain_points',
  'current_tools',
  'status',
  'proposal_sent_at',
  'admin_notes',
] as const

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value || ''
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const supabase = createServerClient()
  const { data: rows, error } = await supabase
    .from('assessments')
    .select(COLUMNS.join(', '))
    .order('created_at', { ascending: false })

  if (error) return new NextResponse('Failed to fetch assessments', { status: 500 })

  const lines = [
    COLUMNS.join(','),
    ...(rows ?? []).map((row) =>
      COLUMNS.map((col) => csvCell(row[col as keyof typeof row])).join(',')
    ),
  ]

  return new NextResponse(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="wagonback-leads.csv"',
    },
  })
}
