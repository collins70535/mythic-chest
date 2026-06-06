import { Link } from "react-router-dom"

export default function CategoryCard({ category }) {
  return (
    <article className="glow-card flex h-full flex-col overflow-hidden rounded-2xl">
      <Link
        to={category.href}
        className="flex aspect-square items-center justify-center bg-black p-4"
      >
        <img
          src={category.image}
          alt={category.name}
          className="h-full w-full object-contain"
        />
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-blue-400">
          {category.eyebrow}
        </p>
        <h3 className="text-2xl font-bold">{category.name}</h3>
        <p className="mt-4 flex-1 text-sm leading-6 text-zinc-400">
          {category.description}
        </p>

        <Link
          to={category.href}
          className="mt-6 flex w-full items-center justify-center rounded-xl bg-zinc-800 py-3 font-semibold transition hover:bg-blue-500"
        >
          View Collection
        </Link>
      </div>
    </article>
  )
}
