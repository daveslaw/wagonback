import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTABanner() {
  return (
    <section className="py-20 md:py-28 bg-[#0d0d0d]">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="relative rounded-3xl border border-[#00c8ff]/10 bg-[#161616] overflow-hidden px-8 md:px-14 py-14 md:py-20 text-center">
          {/* Background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,200,255,0.05),transparent_70%)]" />

          <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 border border-[#00c8ff]/20 rounded-full px-4 py-1.5 text-[10px] tracking-[0.25em] uppercase text-[#00c8ff]/80">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00c8ff] animate-pulse" />
              Free &amp; No Obligation
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-wide uppercase text-white leading-tight">
              Find Out What Your Manual Processes
              <br />
              <span className="text-[#00c8ff]">Are Costing You.</span>
            </h2>

            <p className="text-sm text-white/40 leading-relaxed max-w-lg">
              Answer 10 questions about your business. We&#39;ll show you exactly what to automate,
              what it costs to build, and what you get back — in rand, not hours.
            </p>

            <Link href="/assessment">
              <Button
                size="lg"
                className="bg-[#00c8ff] text-[#0d0d0d] hover:bg-white font-medium tracking-widest text-xs uppercase rounded-full px-10 h-12 touch-manipulation transition-all duration-300 mt-2"
              >
                Get Your Free Assessment
                <ArrowRight size={14} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
