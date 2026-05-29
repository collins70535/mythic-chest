import { Link } from "react-router-dom"
import { useCart } from "../context/useCart"

export default function CartDrawer() {
  const {
    cartTotal,
    closeCart,
    isCartOpen,
    items,
    removeItem,
    updateQuantity,
  } = useCart()

  if (!isCartOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        className="absolute inset-0 h-full w-full bg-black/70"
        aria-label="Close cart"
        onClick={closeCart}
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-blue-400">
              Checkout
            </p>
            <h2 className="text-2xl font-black">Your Cart</h2>
          </div>

          <button
            type="button"
            className="h-10 w-10 rounded-lg border border-white/10 bg-white/5 text-xl hover:bg-white/10"
            aria-label="Close cart"
            onClick={closeCart}
          >
            x
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <h3 className="mb-3 text-2xl font-bold">Your cart is empty</h3>
            <p className="mb-6 text-zinc-400">
              Add a kit to start building your order.
            </p>
            <button
              type="button"
              className="rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-400"
              onClick={closeCart}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-6">
              <div className="grid gap-5">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-[88px_1fr] gap-4">
                    <Link to={`/product/${item.slug}`} onClick={closeCart}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-24 w-22 rounded-lg object-cover"
                      />
                    </Link>

                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          to={`/product/${item.slug}`}
                          className="font-bold hover:text-blue-300"
                          onClick={closeCart}
                        >
                          {item.name}
                        </Link>
                        <p className="shrink-0 text-blue-400">{item.price}</p>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="flex items-center rounded-lg border border-white/10">
                          <button
                            type="button"
                            className="h-9 w-9 hover:bg-white/10"
                            aria-label={`Decrease ${item.name} quantity`}
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            -
                          </button>
                          <span className="w-10 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="h-9 w-9 hover:bg-white/10"
                            aria-label={`Increase ${item.name} quantity`}
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          className="text-sm text-zinc-500 hover:text-red-300"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 p-5">
              <div className="mb-5 flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-400">${cartTotal.toFixed(2)}</span>
              </div>
              <button
                type="button"
                className="w-full rounded-xl bg-blue-500 py-4 font-semibold hover:bg-blue-400"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
