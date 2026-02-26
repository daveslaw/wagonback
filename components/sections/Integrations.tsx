import Image from 'next/image'
import { ExternalLink } from 'lucide-react'

// Marquee row — breadth of integrations
const marqueePartners = [
  { name: 'Xero',          slug: 'xero',         href: 'https://xero.com' },
  { name: 'Shopify',       slug: 'shopify',       href: 'https://shopify.com' },
  { name: 'HubSpot',       slug: 'hubspot',       href: 'https://hubspot.com' },
  { name: 'Airtable',      slug: 'airtable',      href: 'https://airtable.com' },
  { name: 'Zoho',          slug: 'zoho',          href: 'https://zoho.com' },
  { name: 'QuickBooks',    slug: 'quickbooks',    href: 'https://quickbooks.intuit.com' },
  { name: 'Notion',        slug: 'notion',        href: 'https://notion.so' },
  { name: 'Trello',        slug: 'trello',        href: 'https://trello.com' },
  { name: 'Stripe',        slug: 'stripe',        href: 'https://stripe.com' },
  { name: 'Mailchimp',     slug: 'mailchimp',     href: 'https://mailchimp.com' },
  { name: 'WhatsApp',      slug: 'whatsapp',      href: 'https://whatsapp.com' },
  { name: 'Zoom',          slug: 'zoom',          href: 'https://zoom.us' },
  { name: 'Asana',         slug: 'asana',         href: 'https://asana.com' },
  { name: 'Jira',          slug: 'jira',          href: 'https://atlassian.com/software/jira' },
  { name: 'ClickUp',       slug: 'clickup',       href: 'https://clickup.com' },
  { name: 'Google Drive',  slug: 'googledrive',   href: 'https://drive.google.com' },
  { name: 'Google Sheets', slug: 'googlesheets',  href: 'https://sheets.google.com' },
  { name: 'Dropbox',       slug: 'dropbox',       href: 'https://dropbox.com' },
  { name: 'WordPress',     slug: 'wordpress',     href: 'https://wordpress.com' },
  { name: 'WooCommerce',   slug: 'woocommerce',   href: 'https://woocommerce.com' },
  { name: 'Zendesk',       slug: 'zendesk',       href: 'https://zendesk.com' },
  { name: 'Intercom',      slug: 'intercom',      href: 'https://intercom.com' },
  { name: 'PayPal',        slug: 'paypal',        href: 'https://paypal.com' },
  { name: 'Calendly',      slug: 'calendly',      href: 'https://calendly.com' },
  { name: 'GitHub',        slug: 'github',        href: 'https://github.com' },
  { name: 'Gmail',         slug: 'gmail',         href: 'https://gmail.com' },
  { name: 'Brevo',         slug: 'brevo',         href: 'https://brevo.com' },
  { name: 'Discord',       slug: 'discord',       href: 'https://discord.com' },
]

// Featured section — automation platforms we specialise in
const featuredPartners = [
  { name: 'n8n',    slug: 'n8n',    href: 'https://n8n.io',      role: 'Developer-first automation' },
  { name: 'Make',   slug: 'make',   href: 'https://make.com',    role: 'Visual workflow builder' },
  { name: 'Zapier', slug: 'zapier', href: 'https://zapier.com',  role: 'No-code automation' },
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

        {/* ── Infinite scrolling marquee ── */}
        <div className="group/marquee relative overflow-hidden">
          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white dark:from-[#0d0d0d] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white dark:from-[#0d0d0d] to-transparent z-10" />

          {/* Scrolling strip — doubled for seamless loop */}
          <div className="flex gap-3 animate-marquee group-hover/marquee:[animation-play-state:paused]">
            {[...marqueePartners, ...marqueePartners].map((p, i) => (
              <a
                key={i}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label={`${p.name} — opens in new tab`}
                className="group flex-shrink-0 bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/5 rounded-xl py-5 px-5 flex items-center justify-center hover:border-[#00c8ff]/20 hover:scale-105 transition-all duration-300"
              >
                <Image
                  src={`/logos/${p.slug}.svg`}
                  alt={`${p.name} logo`}
                  width={80}
                  height={28}
                  className="h-7 w-auto grayscale opacity-40 dark:opacity-25 group-hover:grayscale-0 group-hover:opacity-100 group-hover:brightness-150 transition-all duration-300"
                  unoptimized
                />
              </a>
            ))}
          </div>
        </div>

        {/* ── Featured automation platforms ── */}
        <div className="mt-12">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 dark:text-white/30 mb-5">
            Automation Platforms We Specialise In
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {featuredPartners.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label={`${p.name} — opens in new tab`}
                className="group bg-white dark:bg-[#161616] border border-[#00c8ff]/20 rounded-2xl px-6 py-6 flex items-center gap-5 hover:border-[#00c8ff]/50 hover:scale-[1.02] transition-all duration-300"
              >
                <Image
                  src={`/logos/${p.slug}.svg`}
                  alt={`${p.name} logo`}
                  width={48}
                  height={48}
                  className="h-10 w-auto opacity-70 group-hover:opacity-100 group-hover:brightness-150 transition-all duration-300 flex-shrink-0"
                  unoptimized
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-light text-gray-900 dark:text-white">{p.name}</p>
                  <p className="text-xs text-[#00c8ff]/70 mt-0.5">{p.role}</p>
                </div>
                <ExternalLink size={14} className="text-gray-300 dark:text-white/20 group-hover:text-[#00c8ff]/60 transition-colors flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-300 dark:text-white/20 mt-10 tracking-widest uppercase">
          + Sage Pastel, Monday.com, Slack, WhatsApp Business, and hundreds more
        </p>

      </div>
    </section>
  )
}
