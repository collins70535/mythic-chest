// Cloudflare Pages Function version of the Vercel serverless handler in
// api/checkout-session.js. Same validation and Stripe lookup; only the
// request/response plumbing differs (Fetch API instead of Vercel's
// (request, response) signature, env instead of process.env).
// The api/ original is kept as the Vercel rollback copy.

function getSessionId(request) {
  const sessionId = new URL(request.url).searchParams.get("session_id")

  if (typeof sessionId !== "string" || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
    throw new Error("Invalid Checkout Session ID")
  }

  return sessionId
}

export async function onRequest({ request, env }) {
  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), {
      status: 405,
      headers: { Allow: "GET", "Content-Type": "application/json" },
    })
  }

  const secretKey = env.STRIPE_SECRET_KEY

  if (!secretKey) {
    return Response.json({ error: "Checkout is not configured yet." }, { status: 503 })
  }

  try {
    const sessionId = getSessionId(request)
    const stripeResponse = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      {
        headers: {
          Authorization: `Basic ${btoa(`${secretKey}:`)}`,
        },
      },
    )
    const session = await stripeResponse.json()

    if (!stripeResponse.ok) {
      console.error("Stripe Checkout session lookup failed", {
        status: stripeResponse.status,
        type: session?.error?.type,
        code: session?.error?.code,
      })
      return Response.json({ error: "Payment status could not be confirmed." }, { status: 502 })
    }

    return Response.json(
      {
        status: session.status,
        paymentStatus: session.payment_status,
      },
      { status: 200 },
    )
  } catch (error) {
    if (error.message !== "Invalid Checkout Session ID") {
      console.error("Checkout confirmation failed", error)
    }

    return Response.json({ error: "This checkout confirmation link is invalid." }, { status: 400 })
  }
}
