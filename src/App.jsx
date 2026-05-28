const products = [
  {
    id: 1,
    name: "RX-78 Gundam",
    price: "$89.99",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Wing Zero Custom",
    price: "$119.99",
    image:
      "https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Barbatos Lupus",
    price: "$99.99",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
  },
]

export default function App() {
  return (
    <div className="min-h-screen text-white">
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/10 backdrop-blur">
        <h1 className="text-3xl font-bold tracking-widest text-blue-400">
          MYTHIC CHEST
        </h1>

        <div className="flex gap-6 text-sm uppercase tracking-wider">
          <a href="#" className="hover:text-blue-400">
            Shop
          </a>
          <a href="#" className="hover:text-blue-400">
            Collections
          </a>
          <a href="#" className="hover:text-blue-400">
            About
          </a>
        </div>
      </nav>

      <section className="px-8 py-24 text-center">
        <h2 className="text-6xl font-black mb-6">
          Premium Models & Collectibles
        </h2>

        <p className="max-w-2xl mx-auto text-zinc-400 text-lg">
          Curated Gundam kits, collectibles, and premium hobby gear for builders
          who demand legendary detail.
        </p>

        <button className="mt-10 px-8 py-4 rounded-xl bg-blue-500 hover:bg-blue-400 font-semibold transition">
          Explore Collection
        </button>
      </section>

      <section className="px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="glow-card rounded-2xl overflow-hidden"
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
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}