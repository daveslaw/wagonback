import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Wagon Back Solutions',
  description:
    'Meet Dave Lawrence, founder of Wagon Back Solutions — an AI automation and integration studio helping South African SMEs reclaim hours lost to manual work.',
  alternates: {
    canonical: 'https://www.wagonback.com/about',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
