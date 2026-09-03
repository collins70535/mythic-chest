function sendJson(response, status, body) {
  response.status(status).json(body)
}

function getSessionId(request) {
  const rawId = request.query?.session_id
  const sessionId = Array.isArray(rawId) ? rawId[0] : rawId

  if (typeof sessionId !== "string" || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
    throw new Error("Invalid Checkout Session ID")
  }

  return sessionId
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET")
    return sendJson(response, 405, { error: "Method not allowed." })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    return sendJson(response, 503, { error: "Checkout is not configured yet." })
  }

  try {
    const sessionId = getSessionId(request)
    const stripeResponse = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
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
      return sendJson(response, 502, { error: "Payment status could not be confirmed." })
    }

    return sendJson(response, 200, {
      status: session.status,
      paymentStatus: session.payment_status,
    })
  } catch (error) {
    if (error.message !== "Invalid Checkout Session ID") {
      console.error("Checkout confirmation failed", error)
    }

    return sendJson(response, 400, { error: "This checkout confirmation link is invalid." })
  }
}
