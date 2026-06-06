import { Link } from "react-router-dom"

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <section className="grid gap-10 md:grid-cols-[1fr_360px]">
        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-blue-400">
            About Mythic Chest
          </p>
          <h1 className="mb-6 text-4xl font-black md:text-6xl">
            Built for collectors, builders, and display shelves.
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-zinc-400">
            Mythic Chest is a hobby storefront focused on model kits,
            collectibles, and display gear. This page will grow into the full
            story behind the shop, including what we carry, how we source it,
            and what builders can expect from each drop.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/#shop"
              className="rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-400"
            >
              Shop Collections
            </Link>
            <Link
              to="/collections/action-bases"
              className="rounded-xl border border-white/10 px-6 py-3 font-semibold hover:border-blue-400 hover:text-blue-300"
            >
              View Action Bases
            </Link>
          </div>
        </div>

        <aside className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-5 text-2xl font-bold">Coming soon</h2>
          <ul className="grid gap-4 text-zinc-400">
            <li>Brand story and mission</li>
            <li>Shipping and fulfillment notes</li>
            <li>Drop schedule details</li>
            <li>Contact and support information</li>
          </ul>
        </aside>
      </section>
    </main>
  )
}
