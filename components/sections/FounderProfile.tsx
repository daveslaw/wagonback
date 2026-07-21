import Image from 'next/image'

export function FounderProfile() {
  return (
    <section className="py-20 md:py-28 bg-[#f5f5f5] dark:bg-[#111111]">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-px bg-[#00c8ff]" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#00c8ff]/70">
            The Founder
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-10 lg:gap-16 items-start">
          {/* Left: Profile card */}
          <div className="bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/5 rounded-2xl p-8 lg:sticky lg:top-28">
            {/* Photo */}
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#00c8ff]/20 mb-6">
              <Image
                src="/dave-lawrence.jpg"
                alt="Dave Lawrence"
                width={80}
                height={80}
                className="w-full h-full object-cover object-top"
              />
            </div>

            <h1 className="text-2xl font-extralight tracking-[0.06em] text-gray-900 dark:text-white mb-1">
              Dave Lawrence
            </h1>
            <p className="text-xs tracking-[0.2em] uppercase text-[#00c8ff]/70 mb-8">
              Founder &amp; Lead Engineer
            </p>

            <div className="w-full h-px bg-gray-100 dark:bg-white/5 mb-8" />

            <dl className="space-y-5">
              {[
                { label: 'Based in', value: 'Johannesburg, SA' },
                { label: 'Experience', value: '5+ yrs software engineering' },
                { label: 'Specialisation', value: 'AI automation & integrations' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-[9px] tracking-widest uppercase text-gray-400 dark:text-white/30 mb-0.5">
                    {label}
                  </dt>
                  <dd className="text-sm font-light text-gray-700 dark:text-white/70">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right: Copy */}
          <div className="space-y-6 lg:pt-2">
            <h2 className="text-3xl sm:text-4xl font-extralight tracking-[0.04em] text-gray-900 dark:text-white leading-snug">
              I&apos;m Dave Lawrence, founder of Wagon Back Solutions — an AI automation and
              integration studio based in Johannesburg.
            </h2>

            <div className="w-12 h-px bg-[#00c8ff]/40" />

            <p className="text-base text-gray-500 dark:text-white/50 leading-relaxed font-light">
              I started Wagon Back after five years in software engineering, where I saw the same
              thing over and over: talented teams losing hours to work that machines should be
              handling. Manual data entry, disconnected platforms, processes held together by
              spreadsheets and good intentions.
            </p>
            <p className="text-base text-gray-500 dark:text-white/50 leading-relaxed font-light">
              My mission is simple — help South African SMEs reclaim that time. We design and build
              custom automations that plug into the tools you already use, so your business runs
              smoother without replacing your stack or your people.
            </p>
            <p className="text-base text-gray-500 dark:text-white/50 leading-relaxed font-light">
              Outside of work, I&apos;m a percussionist and music lover — so I appreciate when
              things are in sync, on beat, and flowing the way they should. That&apos;s exactly what
              I aim to do for your business.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
