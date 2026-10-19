import { useEffect, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import logo from "../assets/mc-logo.png"
import { useCart } from "../context/useCart"
import { COMING_SOON, COMING_SOON_BANNER } from "../config/comingSoon"
import categories from "../data/categories"
import products from "../data/products"

const navLinks = [
  { label: "Shop", href: "/#shop", match: (path) => path === "/" },
  ...categories.map((category) => ({
    label: category.name,
    href: category.href,
    match: (path) => path === category.href,
  })),
  {
    label: "Apparel",
    href: "/custom-apparel",
    match: (path) => path.startsWith("/custom"),
  },
]

function SearchBar({ onNavigate }) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const boxRef = useRef(null)

  useEffect(() => {
    function onClickOutside(event) {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  const term = query.trim().toLowerCase()
  const productHits =
    term.length > 0
      ? products
          .filter((product) =>
            [product.name, product.series, product.category, product.grade]
              .join(" ")
              .toLowerCase()
              .includes(term),
          )
          .slice(0, 5)
      : []
  const categoryHits =
    term.length > 0
      ? categories.filter((category) =>
          category.name.toLowerCase().includes(term),
        )
      : []
  const hasHits = productHits.length > 0 || categoryHits.length > 0

  function go(href) {
    setIsOpen(false)
    setQuery("")
    if (onNavigate) onNavigate()
    navigate(href)
  }

  return (
    <div ref={boxRef} className="relative w-full max-w-xs">
      <div className="flex items-center gap-2 rounded-full border border-amber-400/50 bg-white/5 px-4 py-2 focus-within:border-amber-300">
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && productHits.length > 0) {
              event.preventDefault()
              go(`/product/${productHits[0].slug}`)
            }
          }}
          placeholder="Search products..."
          aria-label="Search products"
          className="w-full bg-transparent text-sm text-white placeholder:text-zinc-400 focus:outline-none"
        />
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 shrink-0 text-amber-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.8-3.8" />
        </svg>
      </div>

      {isOpen && term.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#150b24] shadow-2xl shadow-black/60">
          {hasHits ? (
            <ul className="grid max-h-80 overflow-auto py-2">
              {categoryHits.map((category) => (
                <li key={category.id}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-white/5"
                    onClick={() => go(category.href)}
                  >
                    <span className="font-semibold uppercase tracking-wider">
                      {category.name}
                    </span>
                    <span className="text-xs text-amber-300">Collection</span>
                  </button>
                </li>
              ))}
              {productHits.map((product) => (
                <li key={product.id}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-white/5"
                    onClick={() => go(`/product/${product.slug}`)}
                  >
                    <span>{product.name}</span>
                    <span className="text-xs text-zinc-400">
                      {product.price}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-zinc-400">
              No matches in the chest yet.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cartCount, openCart } = useCart()
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 border-b border-purple-400/20 bg-[#0b0616]/90 backdrop-blur">
      <div className="border-b border-white/10 bg-[#150b24] px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.25em] text-amber-300 md:text-sm">
        {COMING_SOON ? COMING_SOON_BANNER : "Secure online checkout powered by Stripe"}
      </div>

      <nav className="px-5 py-3 md:px-8">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="shrink-0"
          >
            <img src={logo} alt="Mythic Chest" className="h-14 w-auto md:h-16" />
          </Link>

          <div className="hidden items-center gap-6 text-sm font-semibold uppercase tracking-wider lg:flex">
            {navLinks.map((link) => {
              const isActive = link.match(location.pathname)
              const classes = isActive
                ? "border-b-2 border-amber-400 pb-1 text-amber-400"
                : "pb-1 text-zinc-100 hover:text-amber-300"
              return link.href.startsWith("/#") ? (
                <a key={link.label} href={link.href} className={classes}>
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} to={link.href} className={classes}>
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden md:block">
              <SearchBar />
            </div>

            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:border-amber-400 hover:text-amber-300"
              onClick={openCart}
              aria-label={`Open cart, ${cartCount} items`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="20" r="1.4" />
                <circle cx="17" cy="20" r="1.4" />
                <path d="M2 3h3l2.6 12.4a1.5 1.5 0 0 0 1.5 1.1h7.9a1.5 1.5 0 0 0 1.5-1.2L20.5 7H6" />
              </svg>
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[11px] font-extrabold text-black">
                {cartCount}
              </span>
            </button>

            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 lg:hidden"
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
          <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 lg:hidden">
            <SearchBar onNavigate={() => setIsMenuOpen(false)} />
            <div className="grid gap-2 text-sm font-semibold uppercase tracking-wider">
              {navLinks.map((link) =>
                link.href.startsWith("/#") ? (
                  <a
                    key={link.label}
                    href={link.href}
                    className="rounded-lg bg-white/5 px-4 py-3 hover:bg-purple-500/20 hover:text-amber-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="rounded-lg bg-white/5 px-4 py-3 hover:bg-purple-500/20 hover:text-amber-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
