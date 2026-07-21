import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Audit Received | Wagon Back Solutions',
  description:
    'Your automation audit has been received. We\u2019ll review it and send your personalised proposal within 24 hours.',
  robots: { index: false, follow: false },
  alternates: {
    canonical: 'https://www.wagonback.com/confirmation',
  },
}

export default function ConfirmationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
