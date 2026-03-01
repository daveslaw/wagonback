import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Assessment Received | Wagon Back Solutions',
  description:
    'Your automation assessment has been received. We\u2019ll review it and send your personalised proposal within 24 hours.',
  robots: { index: false, follow: false },
}

export default function ConfirmationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
