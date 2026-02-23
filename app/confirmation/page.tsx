import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Mail, Calendar, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Assessment Received | Wagon Back Solutions',
  description: 'Your automation assessment has been received. We\u2019ll review it and send your personalised proposal within 24 hours.',
  robots: { index: false, follow: false },
}

export default function ConfirmationPage() {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || '#'

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col">
      {/* Top bar */}
      <div className="px-4 md:px-8 py-5 flex items-center justify-between border-b border-white/5">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs tracking-widest uppercase"
        >
          <ArrowLeft size={14} />
          Home
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-extralight tracking-[0.15em] uppercase text-white/50">
            Wagon Back
          </span>
          <span className="w-px h-3 bg-[#00c8ff]/40" />
          <span className="text-xs font-light tracking-[0.12em] uppercase text-[#00c8ff]/70">
            Solutions
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24">
        <div className="w-full max-w-xl text-center flex flex-col items-center gap-8">
          {/* Success icon */}
          <div className="w-16 h-16 rounded-full bg-[#00c8ff]/10 border border-[#00c8ff]/20 flex items-center justify-center">
            <CheckCircle size={28} className="text-[#00c8ff]" />
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-wide uppercase text-white">
              You&#39;re All Set.
            </h1>
            <p className="text-sm text-white/40 leading-relaxed max-w-md mx-auto">
              Your assessment has been received. We&#39;ll review it and send your personalised automation proposal within 24 hours.
            </p>
          </div>

          {/* Steps */}
          <div className="w-full flex flex-col gap-4 text-left mt-2">
            <div className="flex items-start gap-4 bg-[#161616] border border-white/5 rounded-2xl px-5 py-4">
              <div className="w-8 h-8 rounded-full bg-[#00c8ff]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Mail size={14} className="text-[#00c8ff]" />
              </div>
              <div>
                <p className="text-sm font-light text-white mb-1">Expect Your Proposal</p>
                <p className="text-xs text-white/40 leading-relaxed">
                  We&#39;ll review your answers and send a personalised automation proposal to your inbox — covering your key opportunities, our recommended approach, and estimated ROI.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-[#161616] border border-white/5 rounded-2xl px-5 py-4">
              <div className="w-8 h-8 rounded-full bg-[#00c8ff]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Calendar size={14} className="text-[#00c8ff]" />
              </div>
              <div>
                <p className="text-sm font-light text-white mb-1">Book a Discovery Call</p>
                <p className="text-xs text-white/40 leading-relaxed">
                  Can&#39;t wait? Book a free 30-minute call now and we&#39;ll walk through everything together — no obligation.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button className="w-full bg-[#00c8ff] text-[#0d0d0d] hover:bg-white font-medium tracking-widest text-xs uppercase rounded-full px-8 h-12 touch-manipulation transition-all duration-300">
                Book a Discovery Call
                <Calendar size={14} className="ml-2" />
              </Button>
            </a>
            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="ghost"
                className="w-full text-white/40 hover:text-white border border-white/10 hover:border-white/30 tracking-widest text-xs uppercase rounded-full px-8 h-12 touch-manipulation"
              >
                Back to Home
              </Button>
            </Link>
          </div>

          <p className="text-[10px] text-white/20 tracking-widest uppercase">
            Questions? Contact us at{' '}
            <a href="mailto:hello@wagonback.co.za" className="text-[#00c8ff]/60 hover:text-[#00c8ff] transition-colors">
              hello@wagonback.co.za
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
