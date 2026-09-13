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

function getBody(request) {
  return typeof request.body === "string" ? JSON.parse(request.body) : (request.body ?? {})
}

function sanitizeSizeDetail(value) {
  if (typeof value !== "string") return ""
  return value
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .slice(0, SIZE_DETAIL_MAX)
}

function isEmbeddedCheckoutEnabled() {
  const value = process.env.HOF_EMBEDDED_CHECKOUT
  return value === "true" || value === "1"
}

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." })
  if (!process.env.STRIPE_SECRET_KEY) return response.status(503).json({ error: "Stripe is not configured yet." })

  try {
    const { cart, customer, fulfillment } = getBody(request)
    if (!Array.isArray(cart) || cart.length === 0 || cart.length > 30) return response.status(400).json({ error: "Your cart is empty or too large." })
    if (!customer?.name || !customer?.email || !customer?.phone) return response.status(400).json({ error: "Name, phone, and email are required." })
    if (!["Local Pickup", "Delivery"].includes(fulfillment)) return response.status(400).json({ error: "Choose local pickup or delivery." })

    let totalQuantity = 0
    const normalized = cart.map((item) => {
      const quantity = Number(item.quantity)
      if (!COLORS.has(item.color) || !PRICES[item.size] || !Number.isInteger(quantity) || quantity < 1 || quantity > 12) throw new Error("One or more shirt selections are invalid.")

      const needsDetail = SIZES_REQUIRING_DETAIL.has(item.size)
      const sizeDetail = needsDetail ? sanitizeSizeDetail(item.sizeDetail) : ""
      if (needsDetail && !sizeDetail) throw new Error("Youth and Toddler sizes require a specific size detail (e.g. 1T-2T, Onesie).")

      totalQuantity += quantity
      return { color: item.color, size: item.size, quantity, unitAmount: PRICES[item.size], sizeDetail }
    })
    if (totalQuantity > 10 && fulfillment === "Delivery") return response.status(400).json({ error: "Delivery orders above 10 shirts require a shipping quote." })

    const origin = "https://mythic-chest.com"
    const embedded = isEmbeddedCheckoutEnabled()
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
      params.set(`line_items[${index}][price_data][product_data][description]`, productDescription)
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
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
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
      return response.status(200).json({ clientSecret: session.client_secret })
    }

    if (!session.url) throw new Error(session.error?.message || "Stripe could not create the checkout session.")
    return response.status(200).json({ url: session.url })
  } catch (error) {
    return response.status(400).json({ error: error.message || "Unable to start checkout." })
  }
}
