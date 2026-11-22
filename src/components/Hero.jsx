export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-purple-400/10">
      {/* Display-case backdrop: purple glow + faint shelving grid */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 700px 560px at 76% 44%, rgba(147,51,234,0.34), transparent 66%)," +
            "radial-gradient(ellipse 1000px 620px at 24% 80%, rgba(88,28,135,0.22), transparent 64%)," +
            "linear-gradient(135deg, #08040f 0%, #120721 52%, #07030c 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(168,85,247,0.055) 0 2px, transparent 2px 150px)," +
            "repeating-linear-gradient(0deg, rgba(168,85,247,0.045) 0 2px, transparent 2px 170px)",
          maskImage:
            "linear-gradient(90deg, black 0%, transparent 22%, transparent 78%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, black 0%, transparent 22%, transparent 78%, black 100%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[440px] max-w-7xl items-center px-5 py-14 md:px-8 lg:py-20">
        <div className="max-w-3xl text-left">
          <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.34em] text-amber-300 sm:text-sm">
            Curated for the display case
          </p>
          <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            Your Collection.
            <span className="mt-2 block bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
              Your Legend.
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
            Explore model kits, figures, comics, accessories, and custom apparel
            selected for collectors who want every shelf to tell a story.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#shop"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-amber-400 px-7 py-3 font-extrabold text-[#12091f] transition hover:bg-amber-300"
            >
              Explore the collection
            </a>
            <a
              href="#about-mythic-chest"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-purple-300/30 bg-white/5 px-7 py-3 font-bold text-white transition hover:border-amber-300/70 hover:text-amber-200"
            >
              Meet Mythic Chest
            </a>
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Browse the launch preview • Ordering opens later
          </p>
        </div>
      </div>
    </section>
  )
}
