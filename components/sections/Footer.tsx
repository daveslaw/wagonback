import Link from 'next/link'
import { MapPin, Mail } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extralight tracking-[0.2em] uppercase text-white/90">
                Wagon Back
              </span>
              <span className="w-px h-4 bg-[#00c8ff]/60" />
              <span className="text-sm font-light tracking-[0.15em] uppercase text-[#00c8ff]">
                Solutions
              </span>
            </div>
            <p className="text-xs text-white/30 leading-relaxed max-w-xs">
              AI automation and integration specialists helping South African SMEs work smarter, not harder.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[9px] tracking-[0.3em] uppercase text-white/30 mb-1">Quick Links</h4>
            {[
              { label: 'Services', href: '#services' },
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'Integrations', href: '#integrations' },
              { label: 'Free Assessment', href: '/assessment' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs text-white/40 hover:text-white transition-colors tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[9px] tracking-[0.3em] uppercase text-white/30 mb-1">Contact</h4>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <MapPin size={12} className="text-[#00c8ff]/50 flex-shrink-0" />
              Johannesburg, Gauteng, South Africa
            </div>
            <a
              href="mailto:hello@wagonback.co.za"
              className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors"
            >
              <Mail size={12} className="text-[#00c8ff]/50 flex-shrink-0" />
              hello@wagonback.co.za
            </a>
            <Link
              href="/assessment"
              className="text-xs text-[#00c8ff]/70 hover:text-[#00c8ff] transition-colors mt-1"
            >
              Book a free consultation →
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-white/20 tracking-widest uppercase">
            © {currentYear} Wagon Back Solutions. All rights reserved.
          </p>
          <p className="text-[10px] text-white/20 tracking-widest uppercase">
            Built in Johannesburg 🇿🇦
          </p>
        </div>
      </div>
    </footer>
  )
}
