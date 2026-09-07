const COMING_SOON = true

const PRICES = { S: 1000, M: 2000, L: 2000, XL: 2000, "2XL": 2500, "3XL": 2500 }
const COLORS = new Set(["Black", "Green", "White"])

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

export default async function handler(request, response) {
  if (COMING_SOON) {
    return response.status(503).json({
      error: "Coming Soon - browsing only. Orders and checkout are not live yet.",
    })
  }

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
      totalQuantity += quantity
      return { color: item.color, size: item.size, quantity, unitAmount: PRICES[item.size] }
    })
    if (totalQuantity > 10 && fulfillment === "Delivery") return response.status(400).json({ error: "Delivery orders above 10 shirts require a shipping quote." })

    const origin = "https://mythic-chest.com"
    const params = new URLSearchParams()
    params.set("mode", "payment")
    params.set("success_url", `${origin}/hall-of-fame-2026?payment=success&session_id={CHECKOUT_SESSION_ID}`)
    params.set("cancel_url", `${origin}/hall-of-fame-2026?payment=cancelled#hof-order-summary`)
    params.set("customer_email", customer.email.trim())
    params.set("phone_number_collection[enabled]", "true")
    params.set("billing_address_collection", "required")
    params.set("metadata[customer_name]", customer.name.trim().slice(0, 200))
    params.set("metadata[customer_phone]", customer.phone.trim().slice(0, 200))
    params.set("metadata[fulfillment]", fulfillment)

    normalized.forEach((item, index) => {
      params.set(`line_items[${index}][price_data][currency]`, "usd")
      params.set(`line_items[${index}][price_data][unit_amount]`, String(item.unitAmount))
      params.set(`line_items[${index}][price_data][product_data][name]`, `Hall of Fame 2026 Tee — ${item.color}, ${item.size}`)
      params.set(`line_items[${index}][price_data][product_data][description]`, "Eunice Bobcats • Mitchell #7")
      params.set(`line_items[${index}][quantity]`, String(item.quantity))
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
    if (!stripeResponse.ok || !session.url) throw new Error(session.error?.message || "Stripe could not create the checkout session.")
    return response.status(200).json({ url: session.url })
  } catch (error) {
    return response.status(400).json({ error: error.message || "Unable to start checkout." })
  }
}
