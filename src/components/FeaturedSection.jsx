import { useState } from "react"
import { Link } from "react-router-dom"
import accessoriesImage from "../assets/featured/accessories.jpg"
import apparelImage from "../assets/featured/apparel.jpg"
import comicsImage from "../assets/featured/comics.jpg"
import figuresImage from "../assets/featured/figures.jpg"
import modelKitsImage from "../assets/featured/model-kits.jpg"
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
    image: figuresImage,
    name: "Megami Device - Sora SKY",
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
  const [liked, setLiked] = useState(false)

  return (
    <article className="loot-card group relative flex flex-col overflow-hidden rounded-2xl">
      <Link to={item.href} className="relative block">
        <img
          src={item.image}
          alt={item.category}
          className="h-44 w-full object-cover"
          loading="lazy"
        />
      </Link>
      <button
        type="button"
        aria-label={`Save ${item.name} to favorites`}
        aria-pressed={liked}
        onClick={() => setLiked((current) => !current)}
        className="absolute right-3 top-3 text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] transition hover:scale-110"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill={liked ? "#f43f5e" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20.7C6.4 17 3 13.6 3 9.9 3 7.2 5.1 5 7.7 5c1.7 0 3.3.9 4.3 2.4C13 5.9 14.6 5 16.3 5 18.9 5 21 7.2 21 9.9c0 3.7-3.4 7.1-9 10.8Z" />
        </svg>
      </button>

      <div className="flex flex-1 flex-col p-5">
        <Link
          to={item.href}
          className="flex items-center gap-2 text-base font-extrabold uppercase tracking-wide hover:text-amber-300"
        >
          {item.category}
          <span className="text-amber-400 transition group-hover:translate-x-1">
            →
          </span>
        </Link>
        <p className="mt-3 flex-1 text-center text-base font-bold leading-snug">
          {item.name}
        </p>
        <p className="mt-2 text-center text-lg font-extrabold text-amber-400">
          {item.price}
        </p>
      </div>
    </article>
  )
}

export default function FeaturedSection() {
  return (
    <section id="shop" className="scroll-mt-32 px-5 pb-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-6">
          <h2 className="text-3xl font-black uppercase tracking-wide md:text-4xl">
            Featured Products
          </h2>
          <div className="h-0.5 flex-1 bg-gradient-to-r from-amber-400 to-transparent" />
          <Link
            to="/collections/model-kits"
            className="shrink-0 font-extrabold uppercase tracking-wide text-amber-400 hover:text-amber-300"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {featured.map((item) => (
            <FeaturedCard key={item.category} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
