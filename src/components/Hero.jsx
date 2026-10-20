import heroChest from "../assets/hero-chest.webp"

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

      <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-5 py-14 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-20">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.34em] text-amber-300 sm:text-sm">
            Curated for the display case
          </p>
          <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            Your Collection.
            <span className="mt-2 block bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
              Your Legend.
            </span>
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8 lg:mx-0">
            Explore model kits, figures, comics, accessories, and custom apparel
            selected for collectors who want every shelf to tell a story.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
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

        <div className="order-1 lg:order-2">
          <div className="showroom-case relative mx-auto max-w-[660px] overflow-hidden rounded-[2rem] border border-amber-300/25 bg-black/35 p-3 shadow-[0_35px_100px_rgba(37,8,68,0.7)] sm:p-5">
            <div className="absolute inset-x-[12%] top-0 h-px bg-gradient-to-r from-transparent via-amber-200/90 to-transparent" />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.09),transparent_24%,transparent_70%,rgba(168,85,247,0.08))]" />
            <img
              src={heroChest}
              alt="An open Mythic Chest filled with purple crystals and gold coins"
              className="relative aspect-[6/5] w-full rounded-[1.4rem] object-contain [mask-image:radial-gradient(ellipse_78%_78%_at_50%_48%,black_62%,transparent_100%)]"
            />
            <div className="absolute inset-x-8 bottom-4 h-px bg-gradient-to-r from-transparent via-purple-300/60 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
