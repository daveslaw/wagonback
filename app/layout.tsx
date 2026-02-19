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
  title: 'Wagon Back Solutions | AI Automation & Integration',
  description:
    'Johannesburg-based AI automation and integration specialists. We connect Salesforce, Xero, Shopify, HubSpot and more to save your SME time and increase ROI.',
  keywords: [
    'AI automation',
    'business integration',
    'workflow automation',
    'Johannesburg',
    'South Africa',
    'SME',
    'Salesforce',
    'Xero',
    'Shopify',
    'n8n',
    'Make.com',
    'Workato',
  ],
  openGraph: {
    title: 'Wagon Back Solutions | AI Automation & Integration',
    description:
      'Connecting your platforms. Automating your workflows. Amplifying your results.',
    type: 'website',
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
