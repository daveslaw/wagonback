'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0d] flex flex-col items-center justify-center px-4 text-center">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-px bg-[#00c8ff]" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#00c8ff]/70">404</span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-extralight tracking-wide uppercase text-gray-900 dark:text-white mb-4">
        Page Not Found
      </h1>

      <p className="text-sm text-gray-400 dark:text-white/40 max-w-sm leading-relaxed mb-10">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link href="/">
        <Button
          size="lg"
          className="bg-[#00c8ff] text-[#0d0d0d] hover:bg-gray-100 dark:hover:bg-white font-medium tracking-widest text-xs uppercase rounded-full px-8 h-12 transition-all duration-300"
        >
          Back to Home
          <ArrowRight size={14} className="ml-2" />
        </Button>
      </Link>
    </div>
  )
}
