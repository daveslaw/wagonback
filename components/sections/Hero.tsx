'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Space_Grotesk, Archivo } from 'next/font/google'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { PrototypeSwitcher } from '@/components/ui/prototype-switcher'

// PROTOTYPE INSTRUMENTATION — answers wayfinder ticket #12 (hero visual & motion
// direction). Everything under the "// PROTOTYPE" markers is throwaway: it swaps the
// background technique via ?variant= and locally previews the Deepwater gradient
// (ticket #8) and Space Grotesk/Archivo type (ticket #9) ahead of those tokens actually
// landing globally. Capture the winner into real tokens/components on this branch's
// context pointer — none of this instrumentation should reach main as-is.

const protoHeading = Space_Grotesk({ weight: ['300'], subsets: ['latin'] })
const protoBody = Archivo({ weight: ['400'], subsets: ['latin'] })

const DotScreenShader = dynamic(
  () =>
    import('@/components/ui/dot-shader-background').then((m) => ({ default: m.DotScreenShader })),
  { ssr: false, loading: () => null }
)
const HeightfieldWaveBackground = dynamic(
  () =>
    import('@/components/ui/prototype-heightfield-wave-background').then((m) => ({
      default: m.HeightfieldWaveBackground,
    })),
  { ssr: false, loading: () => null }
)
const InstancedCubeGridBackground = dynamic(
  () =>
    import('@/components/ui/prototype-instanced-cube-grid-background').then((m) => ({
      default: m.InstancedCubeGridBackground,
    })),
  { ssr: false, loading: () => null }
)

const VARIANTS = [
  { key: 'current', label: 'Current dot shader' },
  { key: 'B', label: 'Heightfield wave (Option B)' },
  { key: 'A', label: 'Instanced cube grid (Option A)' },
]

export function Hero() {
  // null = not yet determined (avoids ever mounting the WebGL canvas on mobile)
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const [variant, setVariant] = useState('current') // PROTOTYPE

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // PROTOTYPE — read initial variant from ?variant=, keep URL in sync on change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const v = params.get('variant')
    if (v && VARIANTS.some((opt) => opt.key === v)) setVariant(v)
  }, [])

  const handleVariantChange = (key: string) => {
    setVariant(key)
    const url = new URL(window.location.href)
    url.searchParams.set('variant', key)
    window.history.replaceState({}, '', url)
  }

  const isDeepwater = variant !== 'current' // PROTOTYPE — B/A also preview the new palette + type

  return (
    <section className="relative h-svh w-full flex flex-col items-center justify-center overflow-hidden">
      {isMobile === false && (
        <div className="absolute inset-0">
          {variant === 'current' && <DotScreenShader />}
          {variant === 'B' && <HeightfieldWaveBackground />}
          {variant === 'A' && <InstancedCubeGridBackground />}
        </div>
      )}

      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-[#0d0d0d]"
        style={isDeepwater ? { ['--tw-gradient-to' as string]: '#0a0e14' } : undefined}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-4 md:px-8 max-w-5xl mx-auto gap-6">
        <div
          className="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-[10px] tracking-[0.25em] uppercase mb-2"
          style={{ borderColor: 'rgba(0,200,255,0.2)', color: 'rgba(0,200,255,0.8)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00c8ff] animate-pulse" />
          Johannesburg, South Africa
        </div>

        <h1
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.08em] uppercase leading-[1.1] ${
            isDeepwater
              ? protoHeading.className + ' font-light'
              : 'font-extralight text-gray-900 dark:text-white'
          }`}
          style={isDeepwater ? { color: '#f2f5f8' } : undefined}
        >
          Automate The Work.
          <br />
          <span
            style={
              isDeepwater
                ? {
                    background: 'linear-gradient(120deg, #00c8ff, #5b4fff)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }
                : { color: '#00c8ff' }
            }
          >
            Amplify The Results.
          </span>
        </h1>

        <p
          className={`text-sm sm:text-base md:text-lg font-light max-w-2xl leading-relaxed ${
            isDeepwater ? protoBody.className : 'text-gray-500 dark:text-white/50'
          }`}
          style={isDeepwater ? { color: '#7c8aa0' } : undefined}
        >
          Most SA businesses are paying people to do work AI agents should handle. We find exactly
          what to automate, build or connect the tools for it, and show you the rand value — before
          you commit.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <Link href="/assessment">
            <Button
              size="lg"
              className="font-medium tracking-widest text-xs uppercase px-8 h-12 touch-manipulation transition-all duration-300"
              style={
                isDeepwater
                  ? {
                      background: 'linear-gradient(120deg, #00c8ff, #5b4fff)',
                      color: '#050810',
                      borderRadius: 10,
                    }
                  : { background: '#00c8ff', color: '#0d0d0d', borderRadius: 999 }
              }
            >
              Get Your Free Audit
              <ArrowRight size={14} className="ml-2" />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button
              size="lg"
              variant="ghost"
              className="text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/30 tracking-widest text-xs uppercase px-8 h-12 touch-manipulation"
              style={{ borderRadius: isDeepwater ? 10 : 999 }}
            >
              See How It Works
            </Button>
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <span className="text-[9px] tracking-[0.3em] uppercase text-gray-400 dark:text-white">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-gray-400 dark:from-white to-transparent" />
      </div>

      {/* PROTOTYPE — remove with everything else marked PROTOTYPE above */}
      <PrototypeSwitcher variants={VARIANTS} current={variant} onChange={handleVariantChange} />
    </section>
  )
}
