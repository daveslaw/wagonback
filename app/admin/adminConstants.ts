import { LeadStatus } from '@/types/assessment'

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  in_discussion: 'In Discussion',
  won: 'Won',
  lost: 'Lost',
}

/** Badge colours — text + background. Used in the table chip. */
export const STATUS_BADGE_COLOURS: Record<LeadStatus, string> = {
  new: 'text-amber-400 bg-amber-400/10',
  contacted: 'text-blue-400 bg-blue-400/10',
  in_discussion: 'text-purple-400 bg-purple-400/10',
  won: 'text-emerald-400 bg-emerald-400/10',
  lost: 'text-red-400/60 bg-red-400/5',
}

/** Text-only colours. Used in the drawer status-button active state. */
export const STATUS_TEXT_COLOURS: Record<LeadStatus, string> = {
  new: 'text-amber-400',
  contacted: 'text-blue-400',
  in_discussion: 'text-purple-400',
  won: 'text-emerald-400',
  lost: 'text-red-400/60',
}
