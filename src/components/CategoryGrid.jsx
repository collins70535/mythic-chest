import CategoryCard from "./CategoryCard"

export default function CategoryGrid({ categories }) {
  return (
    <section id="shop" className="px-5 pb-24 md:px-8">
      <div className="mx-auto mb-10 max-w-6xl">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-blue-400">
          Shop The Chest
        </p>
        <h2 className="text-3xl font-black md:text-4xl">
          Three ways to build your display
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  )
}
