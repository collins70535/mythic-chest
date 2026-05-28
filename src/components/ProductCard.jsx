import { Link } from "react-router-dom"

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="glow-card rounded-2xl overflow-hidden block"
    >
      <img
        src={product.image}
        alt={product.name}
        className="h-72 w-full object-cover"
      />

      <div className="p-6">
        <h3 className="text-2xl font-bold">{product.name}</h3>

        <p className="text-blue-400 text-xl mt-2">
          {product.price}
        </p>

        <button className="mt-6 w-full py-3 rounded-xl bg-zinc-800 hover:bg-blue-500 transition">
          Add to Cart
        </button>
      </div>
    </Link>
  )
}