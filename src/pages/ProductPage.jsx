import { useParams } from "react-router-dom"
import { useCart } from "../context/useCart"
import { COMING_SOON } from "../config/comingSoon"
import products from "../data/products"

export default function ProductPage() {
  const { slug } = useParams()
  const { addItem } = useCart()

  const product = products.find(
    (item) => item.slug === slug
  )

  if (!product) {
    return (
      <div className="px-8 py-24">
        <h1 className="text-5xl font-black">
          Product Not Found
        </h1>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <img
          src={product.image}
          alt={product.name}
          className="aspect-square w-full rounded-2xl object-cover"
        />

        <div>
          <p className="mb-4 uppercase tracking-widest text-amber-300">
            {product.series}
          </p>

          <h1 className="mb-6 text-4xl font-black md:text-5xl">
            {product.name}
          </h1>

          <div className="mb-8 flex flex-wrap gap-3 text-sm uppercase tracking-wider text-zinc-300">
            <span className="rounded-full border border-white/10 px-4 py-2">
              {product.grade}
            </span>
            <span className="rounded-full border border-white/10 px-4 py-2">
              {product.category}
            </span>
            <span className="rounded-full border border-white/10 px-4 py-2">
              {product.stock}
            </span>
          </div>

          <p className="text-zinc-400 text-lg mb-8">
            {product.description}
          </p>

          <div className="mb-8 border-y border-white/10 py-6">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-zinc-500">
              Kit Highlights
            </h2>
            <ul className="grid gap-3 text-zinc-300">
              {product.features.map((feature) => (
                <li key={feature} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mb-8 text-3xl font-bold text-amber-300">
            {product.price}
          </p>

          {COMING_SOON ? (
            <div className="rounded-xl border border-amber-300/30 bg-amber-300/10 px-6 py-4 text-amber-100">
              <p className="font-bold">Browsing preview</p>
              <p className="mt-1 text-sm text-zinc-300">
                Ordering is not live yet. This item will be available to shop at launch.
              </p>
            </div>
          ) : (
            <button
              type="button"
              className="rounded-xl bg-blue-500 px-8 py-4 font-semibold transition hover:bg-blue-400"
              onClick={() => addItem(product)}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
