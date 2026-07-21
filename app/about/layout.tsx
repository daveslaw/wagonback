import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Wagon Back Solutions',
  description:
    'Meet Dave Lawrence, founder of Wagon Back Solutions — an AI automation and integration studio helping South African SMEs reclaim hours lost to manual work.',
  alternates: {
    canonical: 'https://www.wagonback.com/about',
  },
  openGraph: {
    title: 'About | Wagon Back Solutions',
    description:
      'Meet Dave Lawrence, founder of Wagon Back Solutions — an AI automation and integration studio helping South African SMEs reclaim hours lost to manual work.',
    type: 'website',
    url: 'https://www.wagonback.com/about',
    siteName: 'Wagon Back Solutions',
    locale: 'en_ZA',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Wagon Back Solutions' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | Wagon Back Solutions',
    description:
      'Meet Dave Lawrence, founder of Wagon Back Solutions — an AI automation and integration studio helping South African SMEs reclaim hours lost to manual work.',
    images: ['/og-image.png'],
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Dave Lawrence',
            jobTitle: 'Founder & Lead Engineer',
            worksFor: {
              '@id': 'https://www.wagonback.com/#organization',
            },
            url: 'https://www.wagonback.com/about',
            image: 'https://www.wagonback.com/dave-lawrence.jpg',
            homeLocation: {
              '@type': 'Place',
              name: 'Johannesburg, South Africa',
            },
          }),
        }}
      />
      {children}
    </>
  )
}
