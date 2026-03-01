import { createServerClient } from '@/lib/supabase'
import { AssessmentRow } from '@/types/assessment'
import { logoutAction } from './login/actions'
import { AdminClientPanel } from './AdminClientPanel'

export default async function AdminPage() {
  const supabase = createServerClient()
  const { data: rows, error } = await supabase
    .from('assessments')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <p className="text-red-400 text-sm">Failed to load assessments: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] px-4 md:px-8 py-10">
      {/* Header */}
      <div className="mb-10 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-[#00c8ff]" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#00c8ff]/70">
              Admin
            </span>
          </div>
          <h1 className="text-2xl font-extralight tracking-wide uppercase text-white">
            Assessment Submissions
          </h1>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-[10px] tracking-widest uppercase text-white/20 hover:text-white/50 transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>

      <AdminClientPanel initialRows={(rows ?? []) as AssessmentRow[]} />
    </div>
  )
}
