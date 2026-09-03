import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../context/useCart"

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart()
  const [sessionId] = useState(() => new URLSearchParams(window.location.search).get("session_id"))
  const [confirmation, setConfirmation] = useState(() =>
    sessionId
      ? { status: "loading", message: "" }
      : { status: "error", message: "This checkout confirmation link is incomplete." },
  )

  useEffect(() => {
    const controller = new AbortController()

    if (!sessionId) {
      return () => controller.abort()
    }

    async function confirmPayment() {
      try {
        const response = await fetch(`/api/checkout-session?session_id=${encodeURIComponent(sessionId)}`, {
          signal: controller.signal,
        })
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "Payment status could not be confirmed.")
        }

        if (result.paymentStatus === "paid") {
          clearCart()
          setConfirmation({ status: "paid", message: "" })
          return
        }

        setConfirmation({
          status: "processing",
          message: "Stripe is still processing this payment. Please keep your confirmation email for your records.",
        })
      } catch (error) {
        if (error.name !== "AbortError") {
          setConfirmation({ status: "error", message: error.message })
        }
      }
    }

    confirmPayment()
    return () => controller.abort()
  }, [clearCart, sessionId])

  const isPaid = confirmation.status === "paid"

  return (
    <main className="mx-auto max-w-3xl px-5 py-20 text-center md:px-8">
      <section
        className={`rounded-3xl border px-6 py-14 md:px-12 ${
          isPaid
            ? "border-emerald-400/30 bg-emerald-500/10"
            : "border-blue-400/30 bg-blue-500/10"
        }`}
      >
        <p
          className={`mb-3 text-sm font-bold uppercase tracking-[0.3em] ${
            isPaid ? "text-emerald-300" : "text-blue-300"
          }`}
        >
          {confirmation.status === "loading" && "Confirming payment"}
          {isPaid && "Payment received"}
          {confirmation.status === "processing" && "Payment processing"}
          {confirmation.status === "error" && "Confirmation unavailable"}
        </p>
        <h1 className="text-4xl font-black md:text-5xl">
          {isPaid ? "Thank you for your order" : "Checking your order"}
        </h1>
        <p className="mx-auto mt-5 max-w-xl leading-7 text-zinc-300">
          {confirmation.status === "loading" &&
            "Please wait while Mythic Chest confirms your payment with Stripe."}
          {isPaid &&
            "Your payment was confirmed. Mythic Chest will use the shipping details from your secure checkout to prepare your order."}
          {(confirmation.status === "processing" || confirmation.status === "error") &&
            confirmation.message}
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-xl bg-blue-500 px-6 py-3 font-semibold transition hover:bg-blue-400"
        >
          Return to Mythic Chest
        </Link>
      </section>
    </main>
  )
}
