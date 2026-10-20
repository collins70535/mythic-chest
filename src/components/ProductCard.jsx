import { Link } from "react-router-dom"
import { useCart } from "../context/useCart"
import { COMING_SOON } from "../config/comingSoon"

export default function ProductCard({ product }) {
  const { addItem } = useCart()

  return (
    <article className="glow-card flex h-full flex-col overflow-hidden rounded-2xl">
      <Link
        to={`/product/${product.slug}`}
        className="flex aspect-square items-center justify-center bg-black p-4"
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain"
        />
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-zinc-500">
          {product.series}
        </p>

        <Link to={`/product/${product.slug}`} className="hover:text-amber-200">
          <h3 className="text-2xl font-bold">{product.name}</h3>
        </Link>

        <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-wider text-zinc-300">
          <span className="rounded-full border border-white/10 px-3 py-1">
            {product.grade}
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1">
            {product.stock}
          </span>
        </div>

        <p className={`mt-2 text-xl ${COMING_SOON ? "text-zinc-400 line-through" : "text-amber-300"}`}>
          {product.price}
        </p>

        {COMING_SOON ? (
          <div className="mt-auto w-full rounded-xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-center text-sm font-bold uppercase tracking-[0.16em] text-amber-200">
            Placeholder · Launch preview
            <span className="mt-2 block text-xs font-normal normal-case tracking-normal">
              Displayed price is not accurate. Final pricing to come.
            </span>
          </div>
        ) : (
          <button
            type="button"
            className="mt-auto w-full rounded-xl bg-zinc-800 py-3 transition hover:bg-blue-500"
            onClick={() => addItem(product)}
          >
            Add to Cart
          </button>
        )}
      </div>
    </article>
  )
}
