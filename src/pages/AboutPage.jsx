import { Link } from "react-router-dom"

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <section className="grid gap-10 md:grid-cols-[1fr_360px]">
        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-amber-300">
            About Mythic Chest
          </p>
          <h1 className="mb-6 text-4xl font-black md:text-6xl">
            Veteran-owned. Collector-focused.
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-zinc-400">
            Mythic Chest is a veteran-owned destination for model kits,
            figures, comics, accessories, and custom apparel. We are building
            a focused, honest shop for collectors who care about craft,
            character, and the story behind every piece on the shelf.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/#shop"
              className="rounded-xl bg-amber-400 px-6 py-3 font-semibold text-[#12091f] hover:bg-amber-300"
            >
              Shop Collections
            </Link>
            <Link
              to="/collections/model-kits"
              className="rounded-xl border border-white/10 px-6 py-3 font-semibold hover:border-amber-300 hover:text-amber-200"
            >
              Browse Model Kits
            </Link>
          </div>
        </div>

        <aside className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-5 text-2xl font-bold">What guides the chest</h2>
          <ul className="grid gap-4 text-zinc-400">
            <li>Collector-first curation</li>
            <li>Clear, honest product information</li>
            <li>Respect for the craft and the community</li>
            <li>Service-led attention to detail</li>
          </ul>
        </aside>
      </section>
    </main>
  )
}
