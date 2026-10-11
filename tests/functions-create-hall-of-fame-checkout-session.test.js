import assert from "node:assert/strict"
import test from "node:test"

import { onRequest } from "../functions/api/create-hall-of-fame-checkout-session.js"

const ENV = { STRIPE_SECRET_KEY: "sk_test_placeholder", HOF_EMBEDDED_CHECKOUT: "false" }

function postRequest(payload) {
  return new Request("https://example.com/api/create-hall-of-fame-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
}

const VALID_PAYLOAD = {
  cart: [{ color: "Black", size: "L", quantity: 2 }],
  customer: { name: "Test Buyer", email: "buyer@example.com", phone: "555-0100" },
  fulfillment: "Local Pickup",
}

function mockStripe(returned) {
  const originalFetch = globalThis.fetch
  const calls = []
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options })
    return new Response(JSON.stringify(returned), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  }
  return { calls, restore: () => { globalThis.fetch = originalFetch } }
}

test("rejects non-POST methods with 405", async () => {
  const response = await onRequest({
    request: new Request("https://example.com/api/create-hall-of-fame-checkout-session"),
    env: ENV,
  })

  assert.equal(response.status, 405)
})

test("returns 503 when Stripe is not configured", async () => {
  const response = await onRequest({ request: postRequest(VALID_PAYLOAD), env: {} })

  assert.equal(response.status, 503)
})

test("rejects an empty cart without calling Stripe", async () => {
  const stripe = mockStripe({ url: "https://checkout.stripe.com/test" })

  try {
    const response = await onRequest({
      request: postRequest({ ...VALID_PAYLOAD, cart: [] }),
      env: ENV,
    })

    assert.equal(response.status, 400)
    assert.equal(stripe.calls.length, 0)
  } finally {
    stripe.restore()
  }
})

test("rejects missing customer fields", async () => {
  const response = await onRequest({
    request: postRequest({ ...VALID_PAYLOAD, customer: { name: "Only Name" } }),
    env: ENV,
  })

  assert.equal(response.status, 400)
})

test("rejects invalid colors and sizes", async () => {
  const badColor = await onRequest({
    request: postRequest({
      ...VALID_PAYLOAD,
      cart: [{ color: "Purple", size: "L", quantity: 1 }],
    }),
    env: ENV,
  })
  assert.equal(badColor.status, 400)

  const badSize = await onRequest({
    request: postRequest({
      ...VALID_PAYLOAD,
      cart: [{ color: "Black", size: "4XL", quantity: 1 }],
    }),
    env: ENV,
  })
  assert.equal(badSize.status, 400)
})

test("creates a hosted checkout session with the Bearer secret key", async () => {
  const stripe = mockStripe({ url: "https://checkout.stripe.com/test-session" })

  try {
    const response = await onRequest({ request: postRequest(VALID_PAYLOAD), env: ENV })

    assert.equal(response.status, 200)
    const body = await response.json()
    assert.equal(body.url, "https://checkout.stripe.com/test-session")
    assert.equal(stripe.calls.length, 1)
    assert.match(stripe.calls[0].options.headers.Authorization, /^Bearer sk_test_/)
    const params = new URLSearchParams(stripe.calls[0].options.body)
    assert.equal(params.get("line_items[0][price_data][unit_amount]"), "2000")
    assert.equal(params.get("success_url"), "https://mythic-chest.com/hall-of-fame-2026?payment=success&session_id={CHECKOUT_SESSION_ID}")
  } finally {
    stripe.restore()
  }
})
