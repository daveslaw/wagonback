import { Nav } from '@/components/sections/Nav'
import { About } from '@/components/sections/About'
import { CTABanner } from '@/components/sections/CTABanner'
import { Footer } from '@/components/sections/Footer'

export default function AboutPage() {
  return (
    <main className="bg-[#0d0d0d] min-h-screen">
      <Nav />
      <div className="pt-16">
        <About />
      </div>
      <CTABanner />
      <Footer />
    </main>
  )
}
