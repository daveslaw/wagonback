'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DotScreenShader } from '@/components/ui/dot-shader-background'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section className="relative h-svh w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Dot shader background */}
      <div className={`absolute inset-0 ${isMobile ? 'pointer-events-none' : ''}`}>
        <DotScreenShader isMobile={isMobile} />
      </div>

      {/* Gradient overlay for content legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-[#0d0d0d]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 md:px-8 max-w-5xl mx-auto gap-6">
        <div className="inline-flex items-center gap-2 border border-[#00c8ff]/20 rounded-full px-4 py-1.5 text-[10px] tracking-[0.25em] uppercase text-[#00c8ff]/80 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00c8ff] animate-pulse" />
          Johannesburg, South Africa
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-[0.08em] uppercase text-gray-900 dark:text-white leading-[1.1]">
          Automate The Work.
          <br />
          <span className="text-[#00c8ff]">Amplify The Results.</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg font-light text-gray-500 dark:text-white/50 max-w-2xl leading-relaxed">
          Most SA businesses are paying people to do work a machine should handle. We identify
          exactly what to automate, build it, and show you the rand value — before you commit.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <Link href="/assessment">
            <Button
              size="lg"
              className="bg-[#00c8ff] text-[#0d0d0d] hover:bg-gray-100 dark:hover:bg-white font-medium tracking-widest text-xs uppercase rounded-full px-8 h-12 touch-manipulation transition-all duration-300"
            >
              Get Your Free Assessment
              <ArrowRight size={14} className="ml-2" />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button
              size="lg"
              variant="ghost"
              className="text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/30 tracking-widest text-xs uppercase rounded-full px-8 h-12 touch-manipulation"
            >
              See How It Works
            </Button>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <span className="text-[9px] tracking-[0.3em] uppercase text-gray-400 dark:text-white">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-gray-400 dark:from-white to-transparent" />
      </div>
    </section>
  )
}
