import Image from 'next/image'

const partners = [
  { name: 'Make',       slug: 'make',       href: 'https://make.com' },
  { name: 'Zapier',     slug: 'zapier',     href: 'https://zapier.com' },
  { name: 'n8n',        slug: 'n8n',        href: 'https://n8n.io' },
  { name: 'Xero',       slug: 'xero',       href: 'https://xero.com' },
  { name: 'Shopify',    slug: 'shopify',    href: 'https://shopify.com' },
  { name: 'HubSpot',    slug: 'hubspot',    href: 'https://hubspot.com' },
  { name: 'Airtable',   slug: 'airtable',   href: 'https://airtable.com' },
  { name: 'Zoho',       slug: 'zoho',       href: 'https://zoho.com' },
  { name: 'QuickBooks', slug: 'quickbooks', href: 'https://quickbooks.intuit.com' },
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

        {/* Headline + subheadline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-wide uppercase text-gray-900 dark:text-white">
            Works With The Tools
            <br />
            <span className="text-gray-400 dark:text-white/40">You Already Use.</span>
          </h2>
          <p className="text-sm text-gray-400 dark:text-white/40 max-w-xs leading-relaxed">
            We build powerful automations across Make, Zapier, Xero, Shopify, HubSpot, and more —
            no ripping and replacing, no months of onboarding. Your stack stays, your team gets hours back.
          </p>
        </div>

        {/* Logo grid — 3 cols mobile, 5 tablet, 9 desktop */}
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
          {partners.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              aria-label={`${p.name} — opens in new tab`}
              className="group bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/5 rounded-xl py-6 px-4 flex items-center justify-center hover:border-[#00c8ff]/20 hover:scale-105 transition-all duration-300"
            >
              <Image
                src={`/logos/${p.slug}.svg`}
                alt={`${p.name} logo`}
                width={80}
                height={32}
                className="h-8 w-auto grayscale opacity-40 dark:opacity-25 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                unoptimized
              />
            </a>
          ))}
        </div>

        <p className="text-center text-xs text-gray-300 dark:text-white/20 mt-8 tracking-widest uppercase">
          + Sage Pastel, Monday.com, Slack, WhatsApp, and hundreds more
        </p>

      </div>
    </section>
  )
}
