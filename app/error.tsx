'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
    console.error('Unhandled error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0d] flex flex-col items-center justify-center px-4 text-center">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-px bg-[#00c8ff]" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#00c8ff]/70">Error</span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-extralight tracking-wide uppercase text-gray-900 dark:text-white mb-4">
        Something Went Wrong
      </h1>

      <p className="text-sm text-gray-400 dark:text-white/40 max-w-sm leading-relaxed mb-10">
        An unexpected error occurred. Try refreshing the page — if it keeps happening, contact us at{' '}
        <a href="mailto:hello@wagonback.com" className="text-[#00c8ff]/70 hover:text-[#00c8ff] transition-colors">
          hello@wagonback.com
        </a>
        .
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button
          onClick={reset}
          size="lg"
          className="bg-[#00c8ff] text-[#0d0d0d] hover:bg-gray-100 dark:hover:bg-white font-medium tracking-widest text-xs uppercase rounded-full px-8 h-12 transition-all duration-300"
        >
          Try Again
          <ArrowRight size={14} className="ml-2" />
        </Button>
        <Link href="/">
          <Button
            size="lg"
            variant="ghost"
            className="text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/30 tracking-widest text-xs uppercase rounded-full px-8 h-12 transition-all duration-300"
          >
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
