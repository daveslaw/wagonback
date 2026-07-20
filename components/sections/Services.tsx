import { Route, Zap, Brain, Workflow, PlugZap } from 'lucide-react'

const services = [
  {
    icon: Route,
    name: 'Process Redesign & Optimisation',
    description:
      'We map your workflows and strip out the admin fat before writing any code — so automation actually holds.',
    bestFor: 'Operations that have never been mapped or standardised',
  },
  {
    icon: Zap,
    name: '"Quick-Win" Automations',
    description:
      'We connect Xero, Shopify, WhatsApp and more — killing repetitive copy-paste and data entry for good.',
    bestFor: 'Teams that need 5–10 hours back a week, fast',
  },
  {
    icon: Brain,
    name: 'AI Knowledge Systems',
    description:
      'Custom AI trained on your internal databases, SOPs, or catalogues — instant answers, 24/7.',
    bestFor: 'Teams drowning in repeat questions',
  },
  {
    icon: Workflow,
    name: 'Custom Workflows & AI Skills',
    description:
      'Intelligent pipelines for judgment-heavy work — lead qualification, proposals, multi-step data tasks.',
    bestFor: 'Processes too nuanced for a template, too repetitive to do by hand',
  },
  {
    icon: PlugZap,
    name: 'Full Ecosystem Sync',
    description: 'Enterprise-grade integration across Salesforce, Zoho, Xero, Shopify, and more.',
    bestFor: 'Scaling without scaling headcount',
  },
]

export function Services() {
  return (
    <section id="services" className="py-20 md:py-28 bg-[#f5f5f5] dark:bg-[#0a0a0a]">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-[#00c8ff]" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#00c8ff]/70">Services</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-wide uppercase text-gray-900 dark:text-white">
            Custom Systems
            <br />
            <span className="text-gray-400 dark:text-white/40">Built To Scale.</span>
          </h2>
          <p className="text-sm text-gray-400 dark:text-white/40 max-w-xs leading-relaxed">
            We design and deploy high-impact technical assets tailored to your business operations.
            No confusing retainers — just fixed-price, outcome-based implementations.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.name}
                className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/5 rounded-2xl p-7 hover:border-[#00c8ff]/20 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-[#00c8ff]/10 flex items-center justify-center mb-5">
                  <Icon size={18} className="text-[#00c8ff]" />
                </div>
                <h3 className="text-base font-light tracking-wide text-gray-900 dark:text-white mb-3">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-400 dark:text-white/40 leading-relaxed mb-4">
                  {service.description}
                </p>
                <p className="text-[9px] tracking-widest uppercase text-gray-400 dark:text-white/30">
                  Best for: {service.bestFor}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
