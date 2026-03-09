'use client'

import posthog from 'posthog-js'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function BookingButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full sm:w-auto"
      onClick={() => posthog.capture('discovery_call_booked', { source: 'confirmation_page' })}
    >
      <Button className="w-full bg-[#00c8ff] text-[#0d0d0d] hover:bg-gray-100 dark:hover:bg-white font-medium tracking-widest text-xs uppercase rounded-full px-8 h-12 touch-manipulation transition-all duration-300">
        Book a Discovery Call
        <Calendar size={14} className="ml-2" />
      </Button>
    </a>
  )
}
