import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Automation Audit | Wagon Back Solutions',
  description:
    'Answer a few quick questions about your business. We\u2019ll review your answers and send a personalised AI automation proposal within 24 hours \u2014 free, no obligation.',
  alternates: {
    canonical: 'https://www.wagonback.com/assessment',
  },
  openGraph: {
    title: 'Free Automation Audit | Wagon Back Solutions',
    description:
      'Answer a few quick questions about your business. We\u2019ll review your answers and send a personalised AI automation proposal within 24 hours \u2014 free, no obligation.',
    type: 'website',
    url: 'https://www.wagonback.com/assessment',
    siteName: 'Wagon Back Solutions',
    locale: 'en_ZA',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Wagon Back Solutions' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Automation Audit | Wagon Back Solutions',
    description:
      'Answer a few quick questions about your business. We\u2019ll review your answers and send a personalised AI automation proposal within 24 hours \u2014 free, no obligation.',
    images: ['/og-image.png'],
  },
}

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
