import { Link } from "react-router-dom"
import ProductCard from "./ProductCard"
import products from "../data/products"

const picks = [
  "pop-demon-slayer-muichiro-chase",
  "pop-pokemon-pikachu-waving",
  "pop-jjk-gojo",
  "anime-heroes-all-might",
  "pop-premium-mha-deku",
  "ichibansho-piccolo",
  "pop-pokemon-lucario",
  "abystyle-sfc-one-piece-ace",
]

const arrivals = picks
  .map((slug) => products.find((product) => product.slug === slug))
  .filter(Boolean)

export default function NewArrivals() {
  if (arrivals.length === 0) return null

  return (
    <section id="new-arrivals" className="scroll-mt-32 px-5 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-amber-300">
              New arrivals
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl">
              Arriving for Dec 5
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
              Our first real stock drop — Funko Pop!, anime figures, pins, and
              more, at prices that let you build a collection without spending
              a fortune. First available at the Hometown Christmas Market on
              Dec 5 at the Cleveland Civic Center; online ordering opens at
              launch.
            </p>
          </div>
          <Link
            to="/collections/figures"
            className="inline-flex w-fit items-center gap-2 font-extrabold uppercase tracking-[0.14em] text-amber-300 hover:text-amber-200"
          >
            Browse all figures <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {arrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/collections/figures"
            className="inline-flex rounded-xl bg-amber-400 px-6 py-3 font-semibold text-[#12091f] hover:bg-amber-300"
          >
            Shop Figures
          </Link>
          <Link
            to="/collections/accessories"
            className="inline-flex rounded-xl bg-zinc-800 px-6 py-3 font-semibold hover:bg-purple-700"
          >
            Shop Accessories
          </Link>
        </div>
      </div>
    </section>
  )
}
