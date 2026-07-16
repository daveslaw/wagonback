import { Nav } from '@/components/sections/Nav'
import { Hero } from '@/components/sections/Hero'
import { ValueProps } from '@/components/sections/ValueProps'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { Integrations } from '@/components/sections/Integrations'
import { About } from '@/components/sections/About'
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
      <About />
      <CTABanner />
      <Footer />
    </main>
  )
}
