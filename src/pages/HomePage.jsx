import CategoryGrid from "../components/CategoryGrid"
import Hero from "../components/Hero"
import categories from "../data/categories"

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid categories={categories} />
    </>
  )
}
