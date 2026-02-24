import { createServerClient } from '@/lib/supabase'
import { GenerateButton } from './GenerateButton'
import { logoutAction } from './login/actions'

export default async function AdminPage() {
  const supabase = createServerClient()
  const { data: rows, error } = await supabase
    .from('assessments')
    .select('id, created_at, business_name, contact_name, email, industry, team_size, budget_range, proposal_sent_at')
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
          <p className="text-xs text-white/30 mt-1">{rows?.length ?? 0} total</p>
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

      {/* Table */}
      {!rows || rows.length === 0 ? (
        <p className="text-white/30 text-sm">No submissions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                {['Business', 'Contact', 'Email', 'Industry', 'Team', 'Budget', 'Submitted', 'Status', 'Action'].map(
                  (h) => (
                    <th
                      key={h}
                      scope="col"
                      className="pb-3 pr-6 text-[9px] tracking-widest uppercase text-white/30 font-normal"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const sent = !!row.proposal_sent_at
                const sentDate = sent
                  ? new Date(row.proposal_sent_at).toLocaleDateString('en-ZA', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : null
                const submittedDate = new Date(row.created_at).toLocaleDateString('en-ZA', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })

                return (
                  <tr
                    key={row.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-4 pr-6 text-sm text-white font-light">{row.business_name}</td>
                    <td className="py-4 pr-6 text-sm text-white/60">{row.contact_name}</td>
                    <td className="py-4 pr-6 text-sm text-white/40 text-xs">{row.email}</td>
                    <td className="py-4 pr-6 text-xs text-white/40">{row.industry}</td>
                    <td className="py-4 pr-6 text-xs text-white/40">{row.team_size}</td>
                    <td className="py-4 pr-6 text-xs text-white/40">{row.budget_range}</td>
                    <td className="py-4 pr-6 text-xs text-white/30">{submittedDate}</td>
                    <td className="py-4 pr-6">
                      {sent ? (
                        <span className="text-[9px] tracking-widest uppercase text-white/20">
                          Sent {sentDate}
                        </span>
                      ) : (
                        <span className="text-[9px] tracking-widest uppercase text-amber-400/60">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-4">
                      <GenerateButton id={row.id} alreadySent={sent} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
