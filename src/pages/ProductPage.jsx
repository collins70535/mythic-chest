import { useParams } from "react-router-dom"
import { useCart } from "../context/useCart"
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
          <p className="text-blue-400 uppercase tracking-widest mb-4">
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
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-3xl text-blue-400 font-bold mb-8">
            {product.price}
          </p>

          <button
            type="button"
            className="px-8 py-4 rounded-xl bg-blue-500 hover:bg-blue-400 transition font-semibold"
            onClick={() => addItem(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
