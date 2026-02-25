const platforms = [
  { name: 'Salesforce', category: 'CRM' },
  { name: 'HubSpot', category: 'CRM' },
  { name: 'Zoho CRM', category: 'CRM' },
  { name: 'Xero', category: 'Accounting' },
  { name: 'QuickBooks', category: 'Accounting' },
  { name: 'Shopify', category: 'E-commerce' },
  { name: 'WooCommerce', category: 'E-commerce' },
  { name: 'WhatsApp', category: 'Messaging' },
  { name: 'Gmail', category: 'Email' },
  { name: 'Microsoft 365', category: 'Productivity' },
  { name: 'Slack', category: 'Messaging' },
  { name: 'Monday.com', category: 'Project Mgmt' },
  { name: 'Asana', category: 'Project Mgmt' },
  { name: 'Stripe', category: 'Payments' },
  { name: 'Pipedrive', category: 'CRM' },
  { name: 'Airtable', category: 'Database' },
]

export function Integrations() {
  return (
    <section id="integrations" className="py-20 md:py-28 bg-white dark:bg-[#0d0d0d]">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-[#00c8ff]" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#00c8ff]/70">
            Integrations
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-wide uppercase text-gray-900 dark:text-white">
            Your Platforms,
            <br />
            <span className="text-gray-400 dark:text-white/40">Finally Talking.</span>
          </h2>
          <p className="text-sm text-gray-400 dark:text-white/40 max-w-xs leading-relaxed">
            We integrate the tools you already use — no ripping and replacing, no months of onboarding.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className="group bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-4 hover:border-[#00c8ff]/20 transition-all duration-200 flex items-center justify-between"
            >
              <span className="text-sm font-light text-gray-600 dark:text-white/70 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                {platform.name}
              </span>
              <span className="text-[9px] tracking-wider uppercase text-gray-300 dark:text-white/20 group-hover:text-[#00c8ff]/50 transition-colors hidden sm:block">
                {platform.category}
              </span>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-300 dark:text-white/20 mt-8 tracking-widest uppercase">
          + Hundreds more via our automation platform integrations
        </p>
      </div>
    </section>
  )
}
