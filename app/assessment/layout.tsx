import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Automation Assessment | Wagon Back Solutions',
  description:
    'Answer a few quick questions about your business. We\u2019ll review your answers and send a personalised AI automation proposal within 24 hours \u2014 free, no obligation.',
  alternates: {
    canonical: 'https://www.wagonback.co.za/assessment',
  },
}

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
