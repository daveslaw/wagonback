'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error, { tags: { context: 'admin' } })
    console.error('Admin panel error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center px-4 text-center">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-px bg-[#00c8ff]" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#00c8ff]/70">Admin Error</span>
      </div>

      <h2 className="text-2xl font-extralight tracking-wide uppercase text-white mb-3">
        Failed to Load
      </h2>

      <p className="text-sm text-white/40 max-w-xs leading-relaxed mb-8">
        {error.message ?? 'An unexpected error occurred in the admin panel.'}
      </p>

      <button
        onClick={reset}
        className="text-[10px] tracking-widest uppercase px-6 py-2.5 rounded-full border border-[#00c8ff]/30 text-[#00c8ff]/70 hover:border-[#00c8ff] hover:text-[#00c8ff] transition-all"
      >
        Try Again
      </button>
    </div>
  )
}
