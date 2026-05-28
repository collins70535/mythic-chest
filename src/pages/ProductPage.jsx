import { useParams } from "react-router-dom"
import products from "../data/products"

export default function ProductPage() {
  const { slug } = useParams()

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
    <div className="px-8 py-24 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <img
          src={product.image}
          alt={product.name}
          className="rounded-2xl w-full"
        />

        <div>
          <p className="text-blue-400 uppercase tracking-widest mb-4">
            {product.category}
          </p>

          <h1 className="text-5xl font-black mb-6">
            {product.name}
          </h1>

          <p className="text-zinc-400 text-lg mb-8">
            {product.description}
          </p>

          <p className="text-3xl text-blue-400 font-bold mb-8">
            {product.price}
          </p>

          <button className="px-8 py-4 rounded-xl bg-blue-500 hover:bg-blue-400 transition font-semibold">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}