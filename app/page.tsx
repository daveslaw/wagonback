import { Nav } from '@/components/sections/Nav'
import { Hero } from '@/components/sections/Hero'
import { ValueProps } from '@/components/sections/ValueProps'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { Integrations } from '@/components/sections/Integrations'
import { Services } from '@/components/sections/Services'
import { FounderProfile } from '@/components/sections/FounderProfile'
import { CTABanner } from '@/components/sections/CTABanner'
import { Footer } from '@/components/sections/Footer'

export default function Home() {
  return (
    <main className="bg-[#0d0d0d] min-h-screen">
      <Nav />
      <Hero />
      <ValueProps />
      <HowItWorks />
      <Integrations />
      <Services />
      <FounderProfile />
      <CTABanner />
      <Footer />
    </main>
  )
}
