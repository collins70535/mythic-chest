// Cloudflare Pages Function version of the Vercel serverless handler in
// api/create-hall-of-fame-checkout-session.js. Same validation, pricing, and
// Stripe calls; only the request/response plumbing differs (Fetch API instead
// of Vercel's (request, response) signature, env instead of process.env).
// The api/ original is kept as the Vercel rollback copy.
// NOTE: the Hall of Fame 2026 page is sunsetting; this route goes away with it.

const PRICES = { S: 2000, M: 2000, L: 2000, XL: 2000, "2XL": 2500, "3XL": 2500, Youth: 1200, Toddler: 1200 }
const COLORS = new Set(["Black", "Green", "White"])
const SIZES_REQUIRING_DETAIL = new Set(["Youth", "Toddler"])
const SIZE_DETAIL_MAX = 40

function shippingAmount(quantity) {
  if (quantity === 1) return 700
  if (quantity <= 3) return 900
  if (quantity <= 6) return 1200
  if (quantity <= 10) return 1500
  return null
}

async function getBody(request) {
  const text = await request.text()

  if (!text) {
    return {}
  }

  return JSON.parse(text)
}

function sanitizeSizeDetail(value) {
  if (typeof value !== "string") return ""
  return value
    // Intentional: stripping ASCII control characters from user input.
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .slice(0, SIZE_DETAIL_MAX)
}

function isEmbeddedCheckoutEnabled(env) {
  const value = env.HOF_EMBEDDED_CHECKOUT
  return value === "true" || value === "1"
}

export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    })
  }

  if (!env.STRIPE_SECRET_KEY) {
    return Response.json({ error: "Stripe is not configured yet." }, { status: 503 })
  }

  try {
    const { cart, customer, fulfillment } = await getBody(request)
    if (!Array.isArray(cart) || cart.length === 0 || cart.length > 30) {
      return Response.json({ error: "Your cart is empty or too large." }, { status: 400 })
    }
    if (!customer?.name || !customer?.email || !customer?.phone) {
      return Response.json({ error: "Name, phone, and email are required." }, { status: 400 })
    }
    if (!["Local Pickup", "Delivery"].includes(fulfillment)) {
      return Response.json({ error: "Choose local pickup or delivery." }, { status: 400 })
    }

    let totalQuantity = 0
    const normalized = cart.map((item) => {
      const quantity = Number(item.quantity)
      if (!COLORS.has(item.color) || !PRICES[item.size] || !Number.isInteger(quantity) || quantity < 1 || quantity > 12) {
        throw new Error("One or more shirt selections are invalid.")
      }

      const needsDetail = SIZES_REQUIRING_DETAIL.has(item.size)
      const sizeDetail = needsDetail ? sanitizeSizeDetail(item.sizeDetail) : ""
      if (needsDetail && !sizeDetail) {
        throw new Error("Youth and Toddler sizes require a specific size detail (e.g. 1T-2T, Onesie).")
      }

      totalQuantity += quantity
      return { color: item.color, size: item.size, quantity, unitAmount: PRICES[item.size], sizeDetail }
    })
    if (totalQuantity > 10 && fulfillment === "Delivery") {
      return Response.json({ error: "Delivery orders above 10 shirts require a shipping quote." }, { status: 400 })
    }

    const origin = "https://mythic-chest.com"
    const embedded = isEmbeddedCheckoutEnabled(env)
    const params = new URLSearchParams()
    params.set("mode", "payment")

    // Embedded Checkout (TEST spike): ui_mode=embedded_page + return_url.
    // Hosted (LIVE default): success_url + cancel_url — unchanged when flag off.
    if (embedded) {
      params.set("ui_mode", "embedded_page")
      params.set("return_url", `${origin}/hall-of-fame-2026?payment=success&session_id={CHECKOUT_SESSION_ID}`)
    } else {
      params.set("success_url", `${origin}/hall-of-fame-2026?payment=success&session_id={CHECKOUT_SESSION_ID}`)
      params.set("cancel_url", `${origin}/hall-of-fame-2026?payment=cancelled#hof-order-summary`)
    }

    params.set("customer_email", customer.email.trim())
    params.set("phone_number_collection[enabled]", "true")
    params.set("billing_address_collection", "required")
    params.set("metadata[customer_name]", customer.name.trim().slice(0, 200))
    params.set("metadata[customer_phone]", customer.phone.trim().slice(0, 200))
    params.set("metadata[fulfillment]", fulfillment)
    params.set("metadata[checkout_ui]", embedded ? "embedded_page" : "hosted")

    normalized.forEach((item, index) => {
      const productName = item.sizeDetail
        ? `Hall of Fame 2026 Tee — ${item.size}, detail: ${item.sizeDetail}`
        : `Hall of Fame 2026 Tee — ${item.color}, ${item.size}`
      const productDescription = item.sizeDetail
        ? `${item.color} • Eunice Bobcats • Mitchell #7`
        : "Eunice Bobcats • Mitchell #7"

      params.set(`line_items[${index}][price_data][currency]`, "usd")
      params.set(`line_items[${index}][price_data][unit_amount]`, String(item.unitAmount))
      params.set(`line_items[${index}][price_data][product_data][name]`, productName)
      params.set(`line_items[${index}][price_data][description]`, productDescription)
      params.set(`line_items[${index}][quantity]`, String(item.quantity))
      params.set(`metadata[item_${index}_color]`, item.color)
      params.set(`metadata[item_${index}_size]`, item.size)
      if (item.sizeDetail) params.set(`metadata[item_${index}_size_detail]`, item.sizeDetail)
    })

    if (fulfillment === "Delivery") {
      params.set("shipping_address_collection[allowed_countries][0]", "US")
      params.set("shipping_options[0][shipping_rate_data][type]", "fixed_amount")
      params.set("shipping_options[0][shipping_rate_data][fixed_amount][amount]", String(shippingAmount(totalQuantity)))
      params.set("shipping_options[0][shipping_rate_data][fixed_amount][currency]", "usd")
      params.set("shipping_options[0][shipping_rate_data][display_name]", "Standard shipping")
    }

    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    })
    const session = await stripeResponse.json()

    if (!stripeResponse.ok) {
      throw new Error(session.error?.message || "Stripe could not create the checkout session.")
    }

    if (embedded) {
      if (!session.client_secret) throw new Error("Stripe did not return a client secret for embedded checkout.")
      // Never log client_secret.
      return Response.json({ clientSecret: session.client_secret }, { status: 200 })
    }

    if (!session.url) throw new Error(session.error?.message || "Stripe could not create the checkout session.")
    return Response.json({ url: session.url }, { status: 200 })
  } catch (error) {
    return Response.json({ error: error.message || "Unable to start checkout." }, { status: 400 })
  }
}
