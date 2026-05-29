import ProductCard from "./ProductCard"

export default function ProductGrid({ products }) {
  return (
    <section id="shop" className="px-5 pb-24 md:px-8">
      <div className="mx-auto mb-10 max-w-6xl">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-blue-400">
          Featured Stock
        </p>
        <h2 className="text-3xl font-black md:text-4xl">
          Collector-ready kits
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
