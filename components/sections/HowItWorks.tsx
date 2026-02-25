import { Search, Cpu, Rocket } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Free Assessment',
    description:
      'Tell us about your business, the tools you use, and the processes eating your time. We map out exactly where automation can help.',
  },
  {
    number: '02',
    icon: Cpu,
    title: 'Custom Design',
    description:
      'We design a tailored integration and AI workflow plan — connecting your platforms and automating the right touchpoints for your business.',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Deploy & Scale',
    description:
      'We build, test, and launch your automations. You see results fast — and we stay on to refine and scale as your business grows.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-[#f5f5f5] dark:bg-[#0a0a0a]">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-[#00c8ff]" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#00c8ff]/70">
            The Process
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-wide uppercase text-gray-900 dark:text-white mb-16">
          How It Works
        </h2>

        {/* Desktop: horizontal. Mobile: vertical */}
        <div className="relative">
          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-10 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-gradient-to-r from-[#00c8ff]/20 via-[#00c8ff]/40 to-[#00c8ff]/20" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="flex flex-col gap-5">
                  {/* Mobile connector */}
                  {i > 0 && (
                    <div className="lg:hidden w-px h-8 bg-gradient-to-b from-[#00c8ff]/30 to-transparent ml-5" />
                  )}
                  <div className="flex lg:flex-col gap-5 lg:gap-5">
                    {/* Icon circle */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full border border-[#00c8ff]/30 bg-[#00c8ff]/5 flex items-center justify-center">
                        <Icon size={18} className="text-[#00c8ff]" />
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] tracking-[0.3em] uppercase text-[#00c8ff]/50 mb-2">
                        Step {step.number}
                      </div>
                      <h3 className="text-lg font-light tracking-wide text-gray-900 dark:text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-400 dark:text-white/40 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
