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

// NOTE: checkout is currently disabled via COMING_SOON, so these tests pin
// the disabled behavior. The live checkout logic is covered by
// tests/functions-create-checkout-session.test.js (re-enable those paths here
// if COMING_SOON is ever flipped off).
test("returns 503 coming-soon for GET while checkout is disabled", async () => {
  const response = createResponse()

  await handler({ method: "GET", headers: {} }, response)

  assert.equal(response.statusCode, 503)
  assert.match(response.body.error, /coming soon/i)
})

test("returns 503 coming-soon without contacting Stripe", async () => {
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
  assert.equal(response.statusCode, 503)
  assert.equal(called, false)
})

test("does not create a Checkout session while coming-soon is enabled", async () => {
  process.env.STRIPE_SECRET_KEY = "sk_test_placeholder"
  process.env.PUBLIC_SITE_URL = "https://www.mythicchest.com/"
  process.env.STRIPE_AUTOMATIC_TAX = "false"
  const originalFetch = globalThis.fetch
  let called = false
  globalThis.fetch = async () => {
    called = true
    throw new Error("Stripe should not be called")
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
  assert.equal(response.statusCode, 503)
  assert.equal(called, false)
})
