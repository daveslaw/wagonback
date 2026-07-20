export function About() {
  return (
    <section className="py-20 md:py-28 bg-white dark:bg-[#0d0d0d]">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-3xl">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-[#00c8ff]" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#00c8ff]/70">
            The Founder
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-wide uppercase text-gray-900 dark:text-white leading-tight mb-4">
          I&#39;m Dave Lawrence,
          <br />
          founder of <span className="text-[#00c8ff]">Wagon Back Solutions.</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-400 dark:text-white/40 tracking-wide mb-12">
          An AI automation and integration studio based in Johannesburg.
        </p>

        <div className="flex flex-col gap-6 text-sm sm:text-base text-gray-500 dark:text-white/50 leading-relaxed font-light">
          <p>
            I started Wagon Back after five years in software engineering, watching talented teams
            lose hours to work a machine should be doing — manual data entry, disconnected
            platforms, processes held together by spreadsheets and good intentions.
          </p>
          <p>
            My mission is simple — help South African SMEs reclaim that time. We design and build
            custom automations that plug into the tools you already use, so your business runs
            smoother without replacing your stack or your people.
          </p>
          <p>
            Outside of work, I&#39;m a percussionist and music lover — so I appreciate when things
            are in sync and on beat. That&#39;s exactly what I aim to bring to your business.
          </p>
        </div>
      </div>
    </section>
  )
}
