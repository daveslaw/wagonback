import { Nav } from '@/components/sections/Nav'
import { FounderProfile } from '@/components/sections/FounderProfile'
import { CTABanner } from '@/components/sections/CTABanner'
import { Footer } from '@/components/sections/Footer'

export default function AboutPage() {
  return (
    <main className="bg-[#0d0d0d] min-h-screen">
      <Nav />
      <div className="pt-16">
        <FounderProfile />
      </div>
      <CTABanner />
      <Footer />
    </main>
  )
}
