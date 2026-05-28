import { Link } from "react-router-dom"
export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6 border-b border-white/10 backdrop-blur">
      <Link to="/">
  <h1 className="text-3xl font-bold tracking-widest text-blue-400">
    MYTHIC CHEST
  </h1>
</Link>

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
  )
}