import { Link } from "react-router-dom"
import accessoriesImage from "../assets/featured/accessories.jpg"
import apparelImage from "../assets/featured/apparel.jpg"
import comicsImage from "../assets/featured/comics.jpg"
import modelKitsImage from "../assets/featured/model-kits.jpg"
import narutoShippudenImage from "../assets/featured/naruto-shippuden.jpg"
import products from "../data/products"

const featuredProduct = products.find((product) => product.slug === "rx-78-gundam")

const featured = [
  {
    category: "Model Kits",
    href: "/collections/model-kits",
    image: modelKitsImage,
    name: featuredProduct ? featuredProduct.name : "RX-78 Gundam",
    price: featuredProduct ? featuredProduct.price : "$89.99",
  },
  {
    category: "Figures",
    href: "/collections/figures",
    image: narutoShippudenImage,
    name: "Naruto Shippuden Card",
    price: "$89.99",
  },
  {
    category: "Comics",
    href: "/collections/comics",
    image: comicsImage,
    name: "Neon Nights Vol. 2 Graphic Novel",
    price: "$24.99",
  },
  {
    category: "Accessories",
    href: "/collections/accessories",
    image: accessoriesImage,
    name: "Mecha Series Keychain Set",
    price: "$14.99",
  },
  {
    category: "Apparel",
    href: "/custom-apparel",
    image: apparelImage,
    name: "RX-93 νGundam Hoodie",
    price: "$54.99",
  },
]

function FeaturedCard({ item }) {
  return (
    <article className="loot-card group flex min-w-0 flex-col overflow-hidden rounded-[1.4rem]">
      <Link to={item.href} className="relative block overflow-hidden bg-black/40">
        <img
          src={item.image}
          alt={`${item.name} — ${item.category}`}
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-[1.035] sm:h-72 lg:h-64 xl:h-72"
          loading="lazy"
        />
        <span className="absolute left-4 top-4 rounded-full border border-amber-300/35 bg-[#0c0615]/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.22em] text-amber-200 backdrop-blur">
          Placeholder · Launch preview
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <Link
          to={item.href}
          className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.15em] text-amber-300 hover:text-amber-200"
        >
          {item.category}
          <span aria-hidden="true" className="transition group-hover:translate-x-1">
            →
          </span>
        </Link>
        <h3 className="mt-4 flex-1 text-xl font-bold leading-snug">
          <Link to={item.href} className="hover:text-amber-100">
            {item.name}
          </Link>
        </h3>
        <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/10 pt-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              Placeholder price
            </p>
            <p className="mt-1 text-xl font-black text-zinc-400 line-through">{item.price}</p>
            <p className="mt-1 text-xs font-semibold text-amber-200">Not accurate · Final pricing to come</p>
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
            Browse only
          </span>
        </div>
      </div>
    </article>
  )
}

export default function FeaturedSection() {
  return (
    <section id="shop" className="scroll-mt-32 px-5 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-amber-300">
              Inside the chest
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl">
              Featured collection
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
              These launch preview cards are placeholders. Products and prices are
              examples only, and displayed prices are not accurate. Final product
              details and pricing will be confirmed at launch; ordering is not yet open.
            </p>
          </div>
          <Link
            to="/collections/model-kits"
            className="inline-flex w-fit items-center gap-2 font-extrabold uppercase tracking-[0.14em] text-amber-300 hover:text-amber-200"
          >
            Browse model kits <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7 xl:grid-cols-5 xl:gap-8">
          {featured.map((item) => (
            <FeaturedCard key={item.category} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
