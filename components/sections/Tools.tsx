const tools = [
  {
    name: 'Workato',
    tagline: 'Enterprise-grade automation',
    description:
      'The most powerful integration platform for mid-market and enterprise workflows. Handles complex logic, conditional branching, and enterprise security requirements.',
    badge: 'Enterprise',
    color: '#E84B35',
  },
  {
    name: 'Make.com',
    tagline: 'Visual workflow builder',
    description:
      'Intuitive drag-and-drop automation with exceptional flexibility. Perfect for SMEs needing fast, affordable automation across 1,500+ apps.',
    badge: 'Flexible',
    color: '#6C3EBE',
  },
  {
    name: 'n8n',
    tagline: 'AI-native automation',
    description:
      'Open-source, self-hostable automation platform with deep AI integration. Ideal for data privacy requirements and custom AI agent workflows.',
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
            Our Stack
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-wide uppercase text-white">
            World-Class Tools,
            <br />
            <span className="text-white/40">Right Tool For Your Need.</span>
          </h2>
          <p className="text-sm text-white/40 max-w-xs leading-relaxed">
            We match the automation platform to your complexity, budget, and data requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
