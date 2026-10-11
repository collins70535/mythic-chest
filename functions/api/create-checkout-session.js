// Cloudflare Pages Function version of the Vercel serverless handler in
// api/create-checkout-session.js. Validation, catalog, and Stripe calls are
// identical; only the request/response plumbing differs (Fetch API instead
// of Vercel's (request, response) signature, env instead of process.env).
// The api/ original is kept as the Vercel rollback copy.

const COMING_SOON = true

const CATALOG = new Map([
  [1, { name: "RX-78 Gundam", description: "Master Grade model kit", unitAmount: 8999 }],
  [2, { name: "Wing Zero Custom", description: "Master Grade Ver. Ka model kit", unitAmount: 11999 }],
  [3, { name: "Barbatos Lupus", description: "Full Mechanics model kit", unitAmount: 9999 }],
])

const MAX_CART_LINES = 20
const MAX_QUANTITY = 10
const SHIPPING_AMOUNT = 1200

function json(body, status) {
  return Response.json(body, { status })
}

async function getBody(request) {
  const text = await request.text()

  if (!text) {
    return {}
  }

  return JSON.parse(text)
}

export function getValidatedItems(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0 || rawItems.length > MAX_CART_LINES) {
    throw new Error("Your cart is empty or contains too many items.")
  }

  return rawItems.map((item) => {
    const id = Number(item?.id)
    const quantity = Number(item?.quantity)
    const product = CATALOG.get(id)

    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      throw new Error("Your cart contains an invalid item or quantity.")
    }

    return { id, quantity, ...product }
  })
}

function getSiteUrl(request, env) {
  if (env.PUBLIC_SITE_URL) {
    return env.PUBLIC_SITE_URL.replace(/\/$/, "")
  }

  const protocol = request.headers.get("x-forwarded-proto") || "https"
  const host = request.headers.get("x-forwarded-host") || new URL(request.url).host

  if (!host) {
    throw new Error("The website URL is not configured.")
  }

  return `${protocol}://${host}`
}

export function buildStripeParams(items, siteUrl, automaticTax) {
  const params = new URLSearchParams()

  params.set("mode", "payment")
  params.set("payment_method_types[0]", "card")
  params.set("submit_type", "pay")
  params.set("success_url", `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`)
  params.set("cancel_url", `${siteUrl}/checkout`)
  params.set("customer_creation", "always")
  params.set("phone_number_collection[enabled]", "true")
  params.set("shipping_address_collection[allowed_countries][0]", "US")
  params.set("shipping_options[0][shipping_rate_data][type]", "fixed_amount")
  params.set("shipping_options[0][shipping_rate_data][fixed_amount][amount]", String(SHIPPING_AMOUNT))
  params.set("shipping_options[0][shipping_rate_data][fixed_amount][currency]", "usd")
  params.set("shipping_options[0][shipping_rate_data][display_name]", "Standard shipping")
  params.set("automatic_tax[enabled]", automaticTax === "true" ? "true" : "false")
  params.set("metadata[cart]", items.map(({ id, quantity }) => `${id}:${quantity}`).join(","))

  items.forEach((item, index) => {
    params.set(`line_items[${index}][price_data][currency]`, "usd")
    params.set(`line_items[${index}][price_data][unit_amount]`, String(item.unitAmount))
    params.set(`line_items[${index}][price_data][product_data][name]`, item.name)
    params.set(`line_items[${index}][price_data][description]`, item.description)
    params.set(`line_items[${index}][quantity]`, String(item.quantity))
  })

  return params
}

export async function onRequest({ request, env }) {
  if (COMING_SOON) {
    return json(
      { error: "Coming Soon - browsing only. Orders and checkout are not live yet." },
      503,
    )
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), {
      status: 405,
      headers: { Allow: "POST", "Content-Type": "application/json" },
    })
  }

  const secretKey = env.STRIPE_SECRET_KEY

  if (!secretKey) {
    return json({ error: "Checkout is not configured yet." }, 503)
  }

  try {
    const body = await getBody(request)
    const items = getValidatedItems(body.items)
    const siteUrl = getSiteUrl(request, env)
    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${secretKey}:`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: buildStripeParams(items, siteUrl, env.STRIPE_AUTOMATIC_TAX),
    })
    const session = await stripeResponse.json()

    if (!stripeResponse.ok || !session.url) {
      console.error("Stripe Checkout session creation failed", {
        status: stripeResponse.status,
        type: session?.error?.type,
        code: session?.error?.code,
      })
      return json({ error: "Stripe could not start checkout. Please try again." }, 502)
    }

    return json({ url: session.url }, 200)
  } catch (error) {
    const isCartError = error instanceof SyntaxError || /cart|item|quantity/i.test(error.message)

    if (!isCartError) {
      console.error("Checkout initialization failed", error)
    }

    return json(
      { error: isCartError ? "Please review your cart and try again." : "Checkout is temporarily unavailable." },
      isCartError ? 400 : 500,
    )
  }
}
