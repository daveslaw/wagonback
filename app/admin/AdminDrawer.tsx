'use client'

import { useEffect, useRef, useState } from 'react'
import { AssessmentRow, LeadStatus } from '@/types/assessment'
import { GenerateButton } from './GenerateButton'

interface AdminDrawerProps {
  row: AssessmentRow | null
  onClose: () => void
  onUpdate: (id: string, patch: Partial<AssessmentRow>) => void
}

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  in_discussion: 'In Discussion',
  won: 'Won',
  lost: 'Lost',
}

const STATUS_COLOURS: Record<LeadStatus, string> = {
  new: 'text-amber-400',
  contacted: 'text-blue-400',
  in_discussion: 'text-purple-400',
  won: 'text-emerald-400',
  lost: 'text-red-400/60',
}

async function patchAssessment(id: string, patch: Record<string, unknown>) {
  await fetch(`/api/admin/assessment/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  })
}

export function AdminDrawer({ row, onClose, onUpdate }: AdminDrawerProps) {
  const [notes, setNotes] = useState('')
  const [previewLoading, setPreviewLoading] = useState(false)
  const notesRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setNotes(row?.admin_notes ?? '')
  }, [row?.id, row?.admin_notes])

  useEffect(() => {
    if (!row) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [row, onClose])

  if (!row) return null

  async function handleStatusChange(status: LeadStatus) {
    if (!row) return
    await patchAssessment(row.id, { status })
    onUpdate(row.id, { status })
  }

  async function handleNotesBlur() {
    if (!row) return
    if (notes === (row.admin_notes ?? '')) return
    await patchAssessment(row.id, { admin_notes: notes || null })
    onUpdate(row.id, { admin_notes: notes || null })
  }

  async function handleArchiveToggle() {
    if (!row) return
    const archived = !row.archived
    await patchAssessment(row.id, { archived })
    onUpdate(row.id, { archived })
    onClose()
  }

  async function handlePreview() {
    setPreviewLoading(true)
    try {
      window.open(`/api/preview-proposal?id=${row!.id}`, '_blank')
    } finally {
      setPreviewLoading(false)
    }
  }

  const submittedDate = new Date(row.created_at).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 h-full w-full max-w-[520px] bg-[#111] border-l border-white/5 z-50 flex flex-col overflow-hidden">
        {/* Drawer header */}
        <div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-white/5 shrink-0">
          <div>
            <p className="text-[9px] tracking-[0.3em] uppercase text-[#00c8ff]/60 mb-1">
              Assessment Detail
            </p>
            <h2 className="text-lg font-extralight tracking-wide uppercase text-white">
              {row.business_name}
            </h2>
            <p className="text-xs text-white/30 mt-0.5">{submittedDate}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/20 hover:text-white/60 transition-colors mt-1 text-lg leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* Status */}
          <div>
            <label className="block text-[9px] tracking-widest uppercase text-white/30 mb-2">
              Pipeline Status
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-full border transition-all ${
                    row.status === s
                      ? `border-current ${STATUS_COLOURS[s]} bg-current/10`
                      : 'border-white/10 text-white/30 hover:border-white/20 hover:text-white/50'
                  }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[9px] tracking-widest uppercase text-white/30 mb-2">Contact</p>
            <p className="text-sm text-white/80">{row.contact_name}</p>
            <p className="text-xs text-white/40">{row.email}</p>
            {row.phone && <p className="text-xs text-white/30">{row.phone}</p>}
          </div>

          {/* Business info */}
          <div className="grid grid-cols-2 gap-4">
            {[
              ['Industry', row.industry],
              ['Team Size', row.team_size],
              ['Revenue', row.revenue_range],
              ['Budget', row.budget_range],
              ['Timeline', row.timeline],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[9px] tracking-widest uppercase text-white/30 mb-1">{label}</p>
                <p className="text-xs text-white/60">{value || '—'}</p>
              </div>
            ))}
          </div>

          {/* Pain points */}
          {row.pain_points?.length > 0 && (
            <div>
              <p className="text-[9px] tracking-widest uppercase text-white/30 mb-2">Pain Points</p>
              <ul className="space-y-1">
                {row.pain_points.map((p) => (
                  <li key={p} className="text-xs text-white/50 flex gap-2">
                    <span className="text-[#00c8ff] mt-0.5 shrink-0">·</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Current tools */}
          {row.current_tools?.length > 0 && (
            <div>
              <p className="text-[9px] tracking-widest uppercase text-white/30 mb-2">Current Tools</p>
              <div className="flex flex-wrap gap-1.5">
                {row.current_tools.map((t) => (
                  <span
                    key={t}
                    className="text-[9px] tracking-wide px-2 py-1 rounded-full border border-white/10 text-white/40"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Time drains */}
          {row.time_drains && (
            <div>
              <p className="text-[9px] tracking-widest uppercase text-white/30 mb-2">Time Drains</p>
              <p className="text-xs text-white/50 leading-relaxed whitespace-pre-wrap">{row.time_drains}</p>
            </div>
          )}

          {/* Desired outcomes */}
          {row.desired_outcomes && (
            <div>
              <p className="text-[9px] tracking-widest uppercase text-white/30 mb-2">Desired Outcomes</p>
              <p className="text-xs text-white/50 leading-relaxed whitespace-pre-wrap">{row.desired_outcomes}</p>
            </div>
          )}

          {/* Additional notes */}
          {row.additional_notes && (
            <div>
              <p className="text-[9px] tracking-widest uppercase text-white/30 mb-2">Additional Notes (from prospect)</p>
              <p className="text-xs text-white/50 leading-relaxed whitespace-pre-wrap">{row.additional_notes}</p>
            </div>
          )}

          {/* Admin notes */}
          <div>
            <label
              htmlFor="admin-notes"
              className="block text-[9px] tracking-widest uppercase text-white/30 mb-2"
            >
              Internal Notes
            </label>
            <textarea
              id="admin-notes"
              ref={notesRef}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesBlur}
              rows={4}
              placeholder="Private notes — never sent to prospect"
              className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg px-4 py-3 text-xs text-white/70 placeholder-white/20 focus:outline-none focus:border-[#00c8ff]/40 resize-none"
            />
          </div>
        </div>

        {/* Drawer footer — actions */}
        <div className="px-8 py-6 border-t border-white/5 shrink-0 space-y-3">
          <div className="flex items-center gap-3">
            <GenerateButton id={row.id} alreadySent={!!row.proposal_sent_at} />
            <button
              onClick={handlePreview}
              disabled={previewLoading}
              className="text-xs tracking-widest uppercase px-4 py-2 rounded-full border border-white/10 text-white/40 hover:border-white/20 hover:text-white/60 transition-all disabled:opacity-40"
            >
              {previewLoading ? 'Opening…' : 'Preview PDF'}
            </button>
          </div>
          <button
            onClick={handleArchiveToggle}
            className="text-[10px] tracking-widest uppercase text-white/20 hover:text-white/50 transition-colors"
          >
            {row.archived ? 'Unarchive' : 'Archive lead'}
          </button>
        </div>
      </aside>
    </>
  )
}
