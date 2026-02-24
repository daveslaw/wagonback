import { Clock, TrendingUp, Zap } from 'lucide-react'

const props = [
  {
    icon: Clock,
    title: 'Cut Admin Cost, Not Headcount',
    description:
      'Replace manual data entry, reporting, and copy-paste workflows with automated systems. Same team, significantly lower cost per transaction.',
    stat: 'Avg. 22 hrs',
    statLabel: 'recovered per team/week',
  },
  {
    icon: TrendingUp,
    title: 'Payback in Weeks, Not Years',
    description:
      'Faster invoicing, zero-error reconciliation, and instant lead response. Most clients recover their full investment within 6–10 weeks.',
    stat: '6–10 wks',
    statLabel: 'typical payback period',
  },
  {
    icon: Zap,
    title: 'Scale Without Hiring',
    description:
      'Handle 2× the orders, leads, and admin without 2× the headcount. Your platforms work in sync — automatically, in real time.',
    stat: '50+',
    statLabel: 'platforms connected',
  },
]

export function ValueProps() {
  return (
    <section id="services" className="py-20 md:py-28 bg-[#0d0d0d]">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-px bg-[#00c8ff]" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#00c8ff]/70">
            Why Wagon Back
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {props.map((prop) => {
            const Icon = prop.icon
            return (
              <div
                key={prop.title}
                className="group bg-[#161616] border border-white/5 rounded-2xl p-7 hover:border-[#00c8ff]/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#00c8ff]/10 flex items-center justify-center">
                    <Icon size={18} className="text-[#00c8ff]" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extralight text-white tracking-tight">
                      {prop.stat}
                    </div>
                    <div className="text-[9px] tracking-widest uppercase text-white/30">
                      {prop.statLabel}
                    </div>
                  </div>
                </div>
                <h3 className="text-base font-light tracking-wide text-white mb-3">
                  {prop.title}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed">{prop.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
