'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Nav() {
  const [open, setOpen] = useState(false)

  const links = [
    { label: 'Services', href: '#services' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Integrations', href: '#integrations' },
    { label: 'Tools', href: '#tools' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d]/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xs md:text-sm font-extralight tracking-[0.2em] uppercase text-white/90">
            Wagon Back
          </span>
          <span className="w-px h-4 bg-[#00c8ff]/60" />
          <span className="text-xs md:text-sm font-light tracking-[0.15em] uppercase text-[#00c8ff]">
            Solutions
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs tracking-widest uppercase text-white/50 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <Link href="/assessment">
            <Button
              size="sm"
              className="bg-[#00c8ff] text-[#0d0d0d] hover:bg-[#00c8ff]/90 font-medium tracking-wider text-xs uppercase rounded-full px-5 touch-manipulation"
            >
              Free Assessment
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white/70 hover:text-white touch-manipulation p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-[#0d0d0d] border-t border-white/5 px-4 py-6 flex flex-col gap-5">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm tracking-widest uppercase text-white/60 hover:text-white transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link href="/assessment" onClick={() => setOpen(false)}>
            <Button className="w-full bg-[#00c8ff] text-[#0d0d0d] hover:bg-[#00c8ff]/90 font-medium tracking-wider text-xs uppercase rounded-full touch-manipulation">
              Get Your Free Assessment
            </Button>
          </Link>
        </div>
      )}
    </nav>
  )
}
