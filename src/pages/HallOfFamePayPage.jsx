import { useCallback, useEffect, useMemo, useState } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import logo from "../assets/mc-logo.png"
import { HALL_OF_FAME_CHECKOUT_ENABLED } from "../config/comingSoon"
import { HOF_CHECKOUT_PAYLOAD_KEY } from "../config/hofCheckout"

const prices = { S: 20, M: 20, L: 20, XL: 20, "2XL": 25, "3XL": 25, Youth: 12, Toddler: 12 }

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const stripePromise = publishableKey ? loadStripe(publishableKey) : null

function readPayload() {
  try {
    const raw = sessionStorage.getItem(HOF_CHECKOUT_PAYLOAD_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.cart?.length || !parsed?.customer || !parsed?.fulfillment) return null
    return parsed
  } catch {
    return null
  }
}

export default function HallOfFamePayPage() {
  const [payload] = useState(() => readPayload())
  const [mountError, setMountError] = useState("")

  useEffect(() => {
    const previousTitle = document.title
    document.title = "Pay securely | Mythic Chest — Hall of Fame 2026"
    return () => {
      document.title = previousTitle
    }
  }, [])

  const summary = useMemo(() => {
    if (!payload) return null
    const subtotal = payload.cart.reduce((sum, item) => sum + prices[item.size] * item.quantity, 0)
    const totalQuantity = payload.cart.reduce((sum, item) => sum + item.quantity, 0)
    return { subtotal, totalQuantity }
  }, [payload])

  const fetchClientSecret = useCallback(async () => {
    if (!payload) throw new Error("Checkout session expired. Return to the order form.")
    const response = await fetch("/api/create-hall-of-fame-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const result = await response.json()
    if (!response.ok || !result.clientSecret) {
      throw new Error(result.error || "Unable to start embedded checkout.")
    }
    return result.clientSecret
  }, [payload])

  if (!HALL_OF_FAME_CHECKOUT_ENABLED) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#130E25] px-5 text-center text-white">
        <p>Checkout is not available right now.</p>
      </main>
    )
  }

  if (!payload) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#130E25] px-5 text-center text-white">
        <p className="text-zinc-300">No pending Hall of Fame order was found.</p>
        <a className="rounded-sm bg-[#D5A92F] px-6 py-3 font-bold text-[#130E25] no-underline" href="/hall-of-fame-2026#hof-order">
          Return to order form
        </a>
      </main>
    )
  }

  if (!stripePromise) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#130E25] px-5 text-center text-white">
        <p className="text-zinc-300">Stripe publishable key is not configured for this preview.</p>
        <a className="rounded-sm bg-[#D5A92F] px-6 py-3 font-bold text-[#130E25] no-underline" href="/hall-of-fame-2026#hof-order">
          Return to order form
        </a>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#130E25] px-4 py-10 text-white md:px-6">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
        <header className="flex flex-col items-center text-center">
          <div className="relative mb-2">
            <div className="pointer-events-none absolute inset-0 -m-8 rounded-full bg-fuchsia-700/30 blur-3xl" aria-hidden="true" />
            <img src={logo} alt="Mythic Chest" className="relative mx-auto h-28 w-auto object-contain drop-shadow-[0_0_24px_rgba(168,85,247,0.45)]" />
          </div>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#D5A92F]">Secure checkout</p>
        </header>

        <section className="flex items-baseline justify-between gap-4 border-b border-white/15 pb-4 font-serif">
          <h1 className="text-lg text-white md:text-xl">Hall of Fame 2026 Tee</h1>
          <p className="text-lg text-white md:text-xl">${summary.subtotal.toFixed(2)}</p>
        </section>

        <p className="text-sm text-zinc-400">
          {summary.totalQuantity} shirt{summary.totalQuantity === 1 ? "" : "s"} · {payload.fulfillment}
          {" · "}
          Payment fields below are rendered securely by Stripe.
        </p>

        <section className="rounded-md border border-white/20 bg-[#130E25] p-1" aria-label="Stripe Embedded Checkout">
          {mountError ? (
            <div className="border-l-4 border-red-500 bg-red-950/40 p-4 text-sm text-red-200" role="alert">
              <strong className="block">Checkout could not load.</strong>
              <span>{mountError}</span>
              <a className="mt-3 inline-block font-bold text-[#D5A92F]" href="/hall-of-fame-2026#hof-order">
                Return to order form
              </a>
            </div>
          ) : (
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{
                fetchClientSecret: async () => {
                  try {
                    return await fetchClientSecret()
                  } catch (error) {
                    setMountError(error?.message || "Unable to start embedded checkout.")
                    throw error
                  }
                },
                onComplete: () => {
                  try {
                    sessionStorage.removeItem(HOF_CHECKOUT_PAYLOAD_KEY)
                  } catch {
                    /* ignore */
                  }
                },
              }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
        </section>

        <p className="text-center text-xs text-zinc-500">
          After payment you return to the Hall of Fame page with your confirmation. Secrets are never placed in the URL.
        </p>
      </div>
    </main>
  )
}
