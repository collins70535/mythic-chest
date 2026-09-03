import assert from "node:assert/strict"
import test from "node:test"

import handler from "../api/create-checkout-session.js"

function createResponse() {
  return {
    headers: {},
    statusCode: 200,
    body: null,
    setHeader(name, value) {
      this.headers[name] = value
    },
    status(code) {
      this.statusCode = code
      return this
    },
    json(body) {
      this.body = body
      return this
    },
  }
}

test("rejects unsupported methods", async () => {
  const response = createResponse()

  await handler({ method: "GET", headers: {} }, response)

  assert.equal(response.statusCode, 405)
  assert.equal(response.headers.Allow, "POST")
})

test("rejects unrecognized cart items before contacting Stripe", async () => {
  process.env.STRIPE_SECRET_KEY = "sk_test_placeholder"
  const originalFetch = globalThis.fetch
  let called = false
  globalThis.fetch = async () => {
    called = true
    throw new Error("Stripe should not be called")
  }
  const response = createResponse()

  await handler(
    { method: "POST", headers: { host: "example.com" }, body: { items: [{ id: 999, quantity: 1 }] } },
    response,
  )

  globalThis.fetch = originalFetch
  assert.equal(response.statusCode, 400)
  assert.equal(called, false)
})

test("uses the server-side catalog price when creating Checkout", async () => {
  process.env.STRIPE_SECRET_KEY = "sk_test_placeholder"
  process.env.PUBLIC_SITE_URL = "https://www.mythicchest.com/"
  process.env.STRIPE_AUTOMATIC_TAX = "false"
  const originalFetch = globalThis.fetch
  let stripeRequest
  globalThis.fetch = async (url, options) => {
    stripeRequest = { url, options }
    return new Response(JSON.stringify({ url: "https://checkout.stripe.com/test-session" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  }
  const response = createResponse()

  await handler(
    {
      method: "POST",
      headers: { host: "example.com" },
      body: { items: [{ id: 1, quantity: 2, price: 1 }] },
    },
    response,
  )

  globalThis.fetch = originalFetch
  const params = new URLSearchParams(stripeRequest.options.body)
  assert.equal(response.statusCode, 200)
  assert.equal(response.body.url, "https://checkout.stripe.com/test-session")
  assert.equal(params.get("line_items[0][price_data][unit_amount]"), "8999")
  assert.equal(params.get("line_items[0][quantity]"), "2")
  assert.equal(params.get("payment_method_types[0]"), "card")
  assert.equal(params.get("shipping_options[0][shipping_rate_data][fixed_amount][amount]"), "1200")
  assert.equal(params.get("automatic_tax[enabled]"), "false")
  assert.equal(
    params.get("success_url"),
    "https://www.mythicchest.com/checkout/success?session_id={CHECKOUT_SESSION_ID}",
  )
})
