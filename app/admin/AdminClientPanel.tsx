'use client'

import { useMemo, useState } from 'react'
import { AssessmentRow, LeadStatus, INDUSTRIES } from '@/types/assessment'
import { AdminDrawer } from './AdminDrawer'

interface Props {
  initialRows: AssessmentRow[]
}

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  in_discussion: 'In Discussion',
  won: 'Won',
  lost: 'Lost',
}

const STATUS_COLOURS: Record<LeadStatus, string> = {
  new: 'text-amber-400 bg-amber-400/10',
  contacted: 'text-blue-400 bg-blue-400/10',
  in_discussion: 'text-purple-400 bg-purple-400/10',
  won: 'text-emerald-400 bg-emerald-400/10',
  lost: 'text-red-400/60 bg-red-400/5',
}

type SortKey = 'created_at' | 'business_name' | 'budget_range' | 'status'

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-[#161616] border border-white/5 rounded-xl px-5 py-4">
      <p className="text-[9px] tracking-widest uppercase text-white/30 mb-1">{label}</p>
      <p className="text-2xl font-extralight text-white">{value}</p>
      {sub && <p className="text-[10px] text-white/20 mt-0.5">{sub}</p>}
    </div>
  )
}

export function AdminClientPanel({ initialRows }: Props) {
  const [rows, setRows] = useState<AssessmentRow[]>(initialRows)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<LeadStatus | ''>('')
  const [filterIndustry, setFilterIndustry] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortAsc, setSortAsc] = useState(false)

  const selectedRow = rows.find((r) => r.id === selectedId) ?? null

  // Stats (computed from all non-archived rows regardless of filters)
  const activeRows = rows.filter((r) => !r.archived)
  const thisMonth = activeRows.filter((r) => {
    const d = new Date(r.created_at)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const sentCount = activeRows.filter((r) => r.proposal_sent_at).length
  const wonCount = activeRows.filter((r) => r.status === 'won').length
  const conversionPct =
    sentCount > 0 ? Math.round((wonCount / sentCount) * 100) : 0

  // Filtered + sorted rows
  const displayed = useMemo(() => {
    let result = rows.filter((r) => (showArchived ? r.archived : !r.archived))

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (r) =>
          r.business_name.toLowerCase().includes(q) ||
          r.contact_name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q)
      )
    }
    if (filterStatus) result = result.filter((r) => r.status === filterStatus)
    if (filterIndustry) result = result.filter((r) => r.industry === filterIndustry)

    result = [...result].sort((a, b) => {
      const av = a[sortKey] ?? ''
      const bv = b[sortKey] ?? ''
      const cmp = String(av).localeCompare(String(bv))
      return sortAsc ? cmp : -cmp
    })

    return result
  }, [rows, search, filterStatus, filterIndustry, showArchived, sortKey, sortAsc])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc((p) => !p)
    } else {
      setSortKey(key)
      setSortAsc(false)
    }
  }

  function handleRowUpdate(id: string, patch: Partial<AssessmentRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
    // Keep drawer open unless archived
    if (patch.archived !== undefined) setSelectedId(null)
  }

  function SortHeader({ label, col }: { label: string; col: SortKey }) {
    const active = sortKey === col
    return (
      <th
        scope="col"
        onClick={() => toggleSort(col)}
        className="pb-3 pr-6 text-[9px] tracking-widest uppercase text-white/30 font-normal cursor-pointer select-none hover:text-white/50 transition-colors"
      >
        {label}
        {active && <span className="ml-1 text-[#00c8ff]">{sortAsc ? '↑' : '↓'}</span>}
      </th>
    )
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard label="Total Leads" value={activeRows.length} />
        <StatCard label="Proposals Sent" value={sentCount} />
        <StatCard label="This Month" value={thisMonth.length} />
        <StatCard label="Conversion" value={`${conversionPct}%`} sub={`${wonCount} won of ${sentCount} sent`} />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="search"
          placeholder="Search business, contact or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-xs text-white/70 placeholder-white/20 focus:outline-none focus:border-[#00c8ff]/40"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as LeadStatus | '')}
          className="bg-[#161616] border border-white/10 rounded-lg px-3 py-2 text-xs text-white/50 focus:outline-none focus:border-[#00c8ff]/40"
        >
          <option value="">All statuses</option>
          {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>

        <select
          value={filterIndustry}
          onChange={(e) => setFilterIndustry(e.target.value)}
          className="bg-[#161616] border border-white/10 rounded-lg px-3 py-2 text-xs text-white/50 focus:outline-none focus:border-[#00c8ff]/40"
        >
          <option value="">All industries</option>
          {INDUSTRIES.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>

        <button
          onClick={() => setShowArchived((p) => !p)}
          className={`text-[9px] tracking-widest uppercase px-3 py-2 rounded-lg border transition-all ${
            showArchived
              ? 'border-[#00c8ff]/40 text-[#00c8ff]'
              : 'border-white/10 text-white/30 hover:border-white/20'
          }`}
        >
          {showArchived ? 'Archived' : 'Show archived'}
        </button>

        <a
          href="/api/admin/export"
          className="text-[9px] tracking-widest uppercase px-3 py-2 rounded-lg border border-white/10 text-white/30 hover:border-white/20 hover:text-white/50 transition-all"
        >
          Export CSV
        </a>
      </div>

      {/* Table */}
      {displayed.length === 0 ? (
        <p className="text-white/30 text-sm">
          {search || filterStatus || filterIndustry ? 'No results match your filters.' : 'No submissions yet.'}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <SortHeader label="Business" col="business_name" />
                <th className="pb-3 pr-6 text-[9px] tracking-widest uppercase text-white/30 font-normal">Contact</th>
                <th className="pb-3 pr-6 text-[9px] tracking-widest uppercase text-white/30 font-normal">Industry</th>
                <th className="pb-3 pr-6 text-[9px] tracking-widest uppercase text-white/30 font-normal">Team</th>
                <SortHeader label="Budget" col="budget_range" />
                <SortHeader label="Submitted" col="created_at" />
                <SortHeader label="Status" col="status" />
                <th className="pb-3 text-[9px] tracking-widest uppercase text-white/30 font-normal">Proposal</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((row) => {
                const sentDate = row.proposal_sent_at
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
                    onClick={() => setSelectedId(row.id)}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <td className="py-4 pr-6 text-sm text-white font-light">{row.business_name}</td>
                    <td className="py-4 pr-6">
                      <p className="text-sm text-white/60">{row.contact_name}</p>
                      <p className="text-[10px] text-white/30">{row.email}</p>
                    </td>
                    <td className="py-4 pr-6 text-xs text-white/40">{row.industry}</td>
                    <td className="py-4 pr-6 text-xs text-white/40">{row.team_size}</td>
                    <td className="py-4 pr-6 text-xs text-white/40">{row.budget_range}</td>
                    <td className="py-4 pr-6 text-xs text-white/30">{submittedDate}</td>
                    <td className="py-4 pr-6">
                      <span
                        className={`text-[9px] tracking-widest uppercase px-2 py-1 rounded-full ${STATUS_COLOURS[row.status]}`}
                      >
                        {STATUS_LABELS[row.status]}
                      </span>
                    </td>
                    <td className="py-4 text-xs">
                      {sentDate ? (
                        <span className="text-[9px] tracking-widest uppercase text-[#00c8ff]/60">
                          Sent {sentDate}
                        </span>
                      ) : (
                        <span className="text-[9px] tracking-widest uppercase text-white/20">
                          Not sent
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <AdminDrawer
        row={selectedRow}
        onClose={() => setSelectedId(null)}
        onUpdate={handleRowUpdate}
      />
    </>
  )
}
