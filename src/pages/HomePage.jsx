import Hero from "../components/Hero"
import ProductGrid from "../components/ProductGrid"
import products from "../data/products"

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductGrid products={products} />
    </>
  )
}