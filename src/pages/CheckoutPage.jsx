import { Link } from "react-router-dom"
import { useCart } from "../context/useCart"

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-400"

export default function CheckoutPage() {
  const { cartTotal, items } = useCart()

  const shippingEstimate = items.length > 0 ? 12 : 0
  const orderTotal = cartTotal + shippingEstimate

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <div className="mb-10">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-blue-400">
          Secure Checkout
        </p>
        <h1 className="text-4xl font-black md:text-5xl">Complete your order</h1>
      </div>

      {items.length === 0 ? (
        <section className="rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center">
          <h2 className="mb-3 text-2xl font-bold">Your cart is empty</h2>
          <p className="mb-6 text-zinc-400">
            Add a kit before heading into checkout.
          </p>
          <Link
            to="/#shop"
            className="inline-flex rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-400"
          >
            Continue Shopping
          </Link>
        </section>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <section className="grid gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
              <h2 className="mb-5 text-2xl font-bold">Express checkout</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="rounded-xl border border-white/15 bg-black px-5 py-4 font-semibold text-white opacity-60"
                  disabled
                >
                  Apple Pay
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-white/15 bg-white px-5 py-4 font-semibold text-zinc-950 opacity-60"
                  disabled
                >
                  Google Pay
                </button>
              </div>
              <p className="mt-4 text-sm text-zinc-500">
                Wallet buttons will be powered by Stripe Express Checkout after
                Stripe keys and domain verification are added.
              </p>
            </div>

            <form className="grid gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
                <h2 className="mb-5 text-2xl font-bold">Contact</h2>
                <label className="grid gap-2 text-sm text-zinc-400">
                  Email
                  <input
                    className={inputClass}
                    type="email"
                    autoComplete="email"
                    placeholder="builder@example.com"
                  />
                </label>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
                <h2 className="mb-5 text-2xl font-bold">Shipping</h2>
                <div className="grid gap-4">
                  <label className="grid gap-2 text-sm text-zinc-400">
                    Full name
                    <input
                      className={inputClass}
                      autoComplete="name"
                      placeholder="Amuro Ray"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-zinc-400">
                    Address
                    <input
                      className={inputClass}
                      autoComplete="street-address"
                      placeholder="123 Colony Way"
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <label className="grid gap-2 text-sm text-zinc-400 sm:col-span-1">
                      City
                      <input
                        className={inputClass}
                        autoComplete="address-level2"
                        placeholder="Houston"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-zinc-400">
                      State
                      <input
                        className={inputClass}
                        autoComplete="address-level1"
                        placeholder="TX"
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-zinc-400">
                      ZIP
                      <input
                        className={inputClass}
                        autoComplete="postal-code"
                        placeholder="77002"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
                <h2 className="mb-5 text-2xl font-bold">Payment</h2>
                <div className="rounded-xl border border-dashed border-white/15 px-5 py-8 text-center text-zinc-500">
                  Stripe Payment Element will mount here.
                </div>
              </div>
            </form>
          </section>

          <aside className="h-fit rounded-2xl border border-white/10 bg-zinc-950 p-5 md:p-6">
            <h2 className="mb-5 text-2xl font-bold">Order summary</h2>
            <div className="grid gap-5">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-[72px_1fr] gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-18 rounded-lg object-cover"
                  />
                  <div>
                    <div className="flex justify-between gap-3">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-blue-400">{item.price}</p>
                    </div>
                    <p className="mt-2 text-sm text-zinc-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Shipping estimate</span>
                <span>${shippingEstimate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-400">${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              className="mt-6 w-full rounded-xl bg-blue-500 py-4 font-semibold opacity-60"
              disabled
            >
              Pay with Stripe
            </button>
          </aside>
        </div>
      )}
    </main>
  )
}
