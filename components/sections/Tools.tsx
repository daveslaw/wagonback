const tools = [
  {
    name: 'Enterprise Integration Layer',
    tagline: 'Mission-critical automation at scale',
    description:
      'Handles complex, high-volume workflows with built-in governance, 1,000+ pre-built connectors, and enterprise-grade reliability — ideal for businesses running complex ERP and CRM stacks.',
    badge: 'Enterprise',
    color: '#E84B35',
  },
  {
    name: 'Visual Workflow Engine',
    tagline: 'Rapid deployment, zero complexity',
    description:
      'Rapid deployment through intuitive visual workflow design. Map entire business processes in hours, not weeks — built for mid-market teams that need speed without sacrificing power.',
    badge: 'Flexible',
    color: '#6C3EBE',
  },
  {
    name: 'AI-Native Automation',
    tagline: 'Intelligent, adaptive workflows',
    description:
      'Self-learning, adaptive workflows that evolve with your data. Deeply integrates with LLMs and intelligent pipelines — for businesses ready to embed AI into their operations.',
    badge: 'AI-Native',
    color: '#EA4B71',
  },
]

export function Tools() {
  return (
    <section id="tools" className="py-20 md:py-28 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-[#00c8ff]" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#00c8ff]/70">
            Our Approach
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-wide uppercase text-white">
            Our Automation
            <br />
            <span className="text-white/40">Framework.</span>
          </h2>
          <p className="text-sm text-white/40 max-w-xs leading-relaxed">
            We select and deploy the right automation tier for your scale, complexity, and goals — you never need to evaluate or manage platforms yourself.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="group relative bg-[#161616] border border-white/5 rounded-2xl p-7 hover:border-white/10 transition-all duration-300 overflow-hidden"
            >
              {/* Accent glow */}
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-40"
                style={{ background: `linear-gradient(90deg, transparent, ${tool.color}, transparent)` }}
              />

              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-xl font-light text-white tracking-wide">{tool.name}</h3>
                  <p className="text-xs text-white/30 tracking-wider mt-0.5">{tool.tagline}</p>
                </div>
                <span
                  className="text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full border font-medium"
                  style={{ color: tool.color, borderColor: `${tool.color}30`, background: `${tool.color}10` }}
                >
                  {tool.badge}
                </span>
              </div>

              <p className="text-sm text-white/40 leading-relaxed">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
