import { Link } from "react-router-dom"

export default function AboutPreview() {
  return (
    <section id="about-mythic-chest" className="scroll-mt-36 px-5 pb-24 md:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-purple-300/15 bg-[linear-gradient(135deg,rgba(59,18,93,0.42),rgba(10,5,18,0.94)_58%)] px-6 py-10 sm:px-10 md:py-14 lg:px-14">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-purple-500/15 blur-3xl" aria-hidden="true" />
        <div className="relative grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-amber-300">
              About Mythic Chest
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-4xl">
              A veteran-owned home for collectors, builders, and legendary shelves.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300">
              Mythic Chest is more than a destination for anime figures, model kits,
              and pop culture collectibles—it’s a welcoming space where all people
              can be themselves, share their passions, and feel accepted without
              judgment. Through a love of stories, creativity, and community, we
              encourage reading, support local youth clubs, and celebrate what makes
              everyone unique.
            </p>
          </div>
          <Link
            to="/about"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-amber-300/50 px-7 py-3 font-bold text-amber-200 transition hover:bg-amber-300 hover:text-[#12091f]"
          >
            Our story
          </Link>
        </div>
      </div>
    </section>
  )
}
