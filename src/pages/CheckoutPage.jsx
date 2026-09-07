import { useState } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../context/useCart"
import { COMING_SOON, COMING_SOON_BANNER } from "../config/comingSoon"

export default function CheckoutPage() {
  const { cartTotal, items } = useCart()
  const [checkoutError, setCheckoutError] = useState("")
  const [isRedirecting, setIsRedirecting] = useState(false)

  const shippingEstimate = items.length > 0 ? 12 : 0
  const orderTotal = cartTotal + shippingEstimate

  async function startCheckout() {
    if (COMING_SOON) {
      setCheckoutError(COMING_SOON_BANNER)
      return
    }

    setCheckoutError("")
    setIsRedirecting(true)

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ id, quantity }) => ({ id, quantity })),
        }),
      })
      const result = await response.json()

      if (!response.ok || !result.url) {
        throw new Error(result.error || "Checkout could not be started.")
      }

      window.location.assign(result.url)
    } catch (error) {
      setCheckoutError(error.message || "Checkout could not be started.")
      setIsRedirecting(false)
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <div className="mb-10">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-blue-400">
          {COMING_SOON ? "Coming Soon" : "Secure Checkout"}
        </p>
        <h1 className="text-4xl font-black md:text-5xl">
          {COMING_SOON ? "Orders are not live yet" : "Complete your order"}
        </h1>
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
            <div className="rounded-2xl border border-blue-400/30 bg-blue-500/10 p-6 md:p-8">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-blue-300">
                Powered by Stripe
              </p>
              <h2 className="mb-4 text-3xl font-black">Secure hosted checkout</h2>
              <p className="max-w-2xl leading-7 text-zinc-300">
                Continue to Stripe to enter your email, shipping address, and
                payment details. Mythic Chest never stores your card number.
                Available payment methods, including eligible wallets, are shown
                securely by Stripe.
              </p>
              <div className="mt-6 grid gap-3 text-sm text-zinc-400 sm:grid-cols-3">
                <p className="rounded-xl border border-white/10 bg-black/20 p-4">Encrypted payment</p>
                <p className="rounded-xl border border-white/10 bg-black/20 p-4">US shipping collected</p>
                <p className="rounded-xl border border-white/10 bg-black/20 p-4">Stripe payment confirmation</p>
              </div>
            </div>
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
                <span>Estimated total</span>
                <span className="text-blue-400">${orderTotal.toFixed(2)}</span>
              </div>
              <p className="text-xs leading-5 text-zinc-500">
                Applicable taxes are calculated during secure checkout.
              </p>
            </div>

            {COMING_SOON ? (
              <div className="mt-6 grid gap-3">
                <p className="rounded-xl border border-blue-400/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
                  {COMING_SOON_BANNER}
                </p>
                <button
                  type="button"
                  className="w-full cursor-not-allowed rounded-xl bg-zinc-700 py-4 font-semibold text-zinc-300"
                  disabled
                >
                  Checkout unavailable
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="mt-6 w-full rounded-xl bg-blue-500 py-4 font-semibold transition hover:bg-blue-400 disabled:cursor-wait disabled:opacity-60"
                disabled={isRedirecting}
                onClick={startCheckout}
              >
                {isRedirecting ? "Opening secure checkout…" : "Continue to Stripe"}
              </button>
            )}

            {checkoutError && (
              <p role="alert" className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
                {checkoutError}
              </p>
            )}
          </aside>
        </div>
      )}
    </main>
  )
}
