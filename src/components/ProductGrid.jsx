import ProductCard from "./ProductCard"

export default function ProductGrid({ products }) {
  return (
    <section className="px-8 pb-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}