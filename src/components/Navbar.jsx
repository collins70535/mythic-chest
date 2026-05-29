import { useState } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../context/useCart"

const navLinks = [
  { label: "Shop", href: "/#shop" },
  { label: "Collections", href: "/#collections" },
  { label: "About", href: "/#about" },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cartCount, openCart } = useCart()

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/70 px-5 py-5 backdrop-blur md:px-8">
      <div className="flex items-center justify-between">
        <Link to="/" onClick={() => setIsMenuOpen(false)}>
          <h1 className="text-2xl font-bold tracking-widest text-blue-400 md:text-3xl">
            MYTHIC CHEST
          </h1>
        </Link>

        <div className="hidden items-center gap-6 text-sm uppercase tracking-wider md:flex">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-blue-400">
              {link.label}
            </a>
          ))}

          <button
            type="button"
            className="rounded-lg border border-white/10 px-4 py-2 hover:border-blue-400 hover:text-blue-300"
            onClick={openCart}
          >
            Cart ({cartCount})
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            className="h-11 rounded-lg border border-white/10 bg-white/5 px-3 text-sm"
            onClick={openCart}
          >
            Cart ({cartCount})
          </button>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <span className="flex w-5 flex-col gap-1.5">
              <span className="h-0.5 rounded-full bg-white" />
              <span className="h-0.5 rounded-full bg-white" />
              <span className="h-0.5 rounded-full bg-white" />
            </span>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="mt-5 grid gap-3 border-t border-white/10 pt-5 text-sm uppercase tracking-wider md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-lg bg-white/5 px-4 py-3 hover:bg-blue-500/20 hover:text-blue-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
