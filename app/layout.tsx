import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.wagonback.co.za'),
  title: 'Wagon Back Solutions | AI Automation & Integration',
  description:
    'Johannesburg-based AI automation and integration specialists. We connect Salesforce, Xero, Shopify, HubSpot and more to save your SME time and increase ROI.',
  keywords: [
    'AI automation',
    'AI automation consultancy',
    'business integration',
    'workflow automation',
    'workflow automation South Africa',
    'business process automation',
    'Johannesburg',
    'South Africa',
    'SME',
    'Salesforce integration',
    'Xero integration',
    'Shopify automation',
    'HubSpot automation',
  ],
  robots: { index: true, follow: true },
  alternates: {
    canonical: 'https://www.wagonback.co.za',
  },
  openGraph: {
    title: 'Wagon Back Solutions | AI Automation & Integration',
    description:
      'Connecting your platforms. Automating your workflows. Amplifying your results.',
    type: 'website',
    url: 'https://www.wagonback.co.za',
    siteName: 'Wagon Back Solutions',
    locale: 'en_ZA',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Wagon Back Solutions' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wagon Back Solutions | AI Automation & Integration',
    description:
      'Connecting your platforms. Automating your workflows. Amplifying your results.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'Wagon Back Solutions',
              description:
                'Johannesburg-based AI automation and integration specialists helping South African SMEs connect their platforms, automate workflows, and amplify results.',
              url: 'https://www.wagonback.co.za',
              email: 'hello@wagonback.co.za',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Johannesburg',
                addressRegion: 'Gauteng',
                addressCountry: 'ZA',
              },
              areaServed: {
                '@type': 'Country',
                name: 'South Africa',
              },
              serviceType: 'AI Automation and Business Integration',
            }),
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
