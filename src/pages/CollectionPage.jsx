import { Link, useParams } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import categories from "../data/categories"
import products from "../data/products"

export default function CollectionPage() {
  const { categoryId } = useParams()
  const category = categories.find((item) => item.id === categoryId)
  const collectionProducts = products.filter(
    (product) => product.categoryId === categoryId,
  )

  if (!category) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-blue-400">
          Collection
        </p>
        <h1 className="mb-6 text-4xl font-black md:text-5xl">
          Collection not found
        </h1>
        <Link
          to="/#shop"
          className="inline-flex rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-400"
        >
          Back to Shop
        </Link>
      </main>
    )
  }

  return (
    <main>
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_420px] md:px-8 md:py-24">
        <div className="flex flex-col justify-center">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-blue-400">
            {category.eyebrow}
          </p>
          <h1 className="mb-6 text-4xl font-black md:text-6xl">
            {category.name}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-400">
            {category.description}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black p-4">
          <img
            src={category.image}
            alt={category.name}
            className="aspect-square w-full object-contain"
          />
        </div>
      </section>

      <section className="px-5 pb-24 md:px-8">
        <div className="mx-auto mb-10 max-w-6xl">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-blue-400">
            Available Stock
          </p>
          <h2 className="text-3xl font-black md:text-4xl">
            {collectionProducts.length > 0
              ? "Ready to add to your shelf"
              : "Inventory being added"}
          </h2>
        </div>

        {collectionProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {collectionProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-white/5 p-8">
            <p className="max-w-2xl text-lg leading-8 text-zinc-400">
              This collection is being prepared for launch. Product listings,
              pricing, and cart actions will appear here as stock is added.
            </p>
            <Link
              to="/#shop"
              className="mt-6 inline-flex rounded-xl bg-zinc-800 px-6 py-3 font-semibold hover:bg-blue-500"
            >
              View Other Collections
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}
