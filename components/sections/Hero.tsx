'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Space_Grotesk, Archivo } from 'next/font/google'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import posthog from 'posthog-js'

// Hero typography (ADR-adjacent decision, ticket #9) — scoped here until the rest of
// the site's type rollout happens in a follow-on effort.
const heroHeading = Space_Grotesk({ weight: ['300'], subsets: ['latin'] })
const heroBody = Archivo({ weight: ['400'], subsets: ['latin'] })

// Lazy-load the Three.js canvas — keeps it out of the initial JS bundle
const CubeGridBackground = dynamic(
  () =>
    import('@/components/ui/cube-grid-background').then((m) => ({ default: m.CubeGridBackground })),
  { ssr: false, loading: () => null }
)

export function Hero() {
  // null = not yet determined (avoids ever mounting the WebGL canvas on mobile — the
  // instanced grid is heavier than the dot shader it replaced, so it keeps the same
  // hard mobile skip rather than the dot shader's pointer-events-none fallback)
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section className="relative h-svh w-full flex flex-col items-center justify-center overflow-hidden">
      {isMobile === false && (
        <div className="absolute inset-0">
          <CubeGridBackground />
        </div>
      )}

      {/* Gradient overlay for content legibility */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent"
        style={{ ['--tw-gradient-to' as string]: 'var(--hero-bg)' }}
      />

      {/* Soft dark scrim behind the heading — the cube grid's bright specular highlights
          would otherwise wash out the text in spots */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 42%, rgba(5,8,14,0.65) 0%, rgba(5,8,14,0.25) 55%, rgba(5,8,14,0) 80%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 md:px-8 max-w-5xl mx-auto gap-6">
        <div
          className="inline-flex items-center gap-2 border rounded-[6px] px-4 py-1.5 text-[10px] tracking-[0.25em] uppercase mb-2"
          style={{
            borderColor: 'color-mix(in srgb, var(--hero-overlay-accent) 20%, transparent)',
            color: 'var(--hero-overlay-accent-text)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: 'var(--hero-overlay-accent)' }}
          />
          Johannesburg, South Africa
        </div>

        <h1
          className={`${heroHeading.className} font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.08em] uppercase leading-[1.1]`}
          style={{
            color: 'var(--hero-overlay-text)',
            textShadow: '0 2px 20px rgba(5,8,14,0.85), 0 1px 3px rgba(5,8,14,0.9)',
          }}
        >
          Automate The Work.
          <br />
          <span
            style={{
              color: 'var(--hero-overlay-accent-text)',
              textShadow: '0 2px 20px rgba(5,8,14,0.9), 0 1px 3px rgba(5,8,14,0.95)',
            }}
          >
            Amplify The Results.
          </span>
        </h1>

        <p
          className={`${heroBody.className} text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed`}
          style={{ color: 'var(--hero-overlay-muted)' }}
        >
          Most SA businesses are paying people to do work a machine should handle. We identify
          exactly what to automate, build it, and show you the rand value — before you commit.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <Link
            href="/assessment"
            onClick={() => posthog.capture('assessment_cta_clicked', { source: 'hero' })}
          >
            <Button
              size="lg"
              className="font-medium tracking-widest text-xs uppercase px-8 h-12 touch-manipulation transition-all duration-300 rounded-[10px]"
              style={{
                background: 'linear-gradient(120deg, var(--hero-accent-a), var(--hero-accent-b))',
                color: 'var(--hero-bg)',
              }}
            >
              Get Your Free Audit
              <ArrowRight size={14} className="ml-2" />
            </Button>
          </Link>
          <a
            href="#how-it-works"
            onClick={() => posthog.capture('how_it_works_section_viewed', { source: 'hero' })}
          >
            <Button
              size="lg"
              variant="ghost"
              className="rounded-[10px] border tracking-widest text-xs uppercase px-8 h-12 touch-manipulation transition-colors"
              style={{ color: 'var(--hero-overlay-muted)', borderColor: 'rgba(255,255,255,0.15)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--hero-overlay-text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--hero-overlay-muted)')}
            >
              See How It Works
            </Button>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 z-10">
        <span
          className="text-[9px] tracking-[0.3em] uppercase"
          style={{ color: 'var(--hero-overlay-text)' }}
        >
          Scroll
        </span>
        <div
          className="w-px h-8"
          style={{
            background: 'linear-gradient(to bottom, var(--hero-overlay-text), transparent)',
          }}
        />
      </div>
    </section>
  )
}
