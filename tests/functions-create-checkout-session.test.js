import assert from "node:assert/strict"
import test from "node:test"

import {
  buildStripeParams,
  getValidatedItems,
  onRequest,
} from "../functions/api/create-checkout-session.js"

const ENV = {
  STRIPE_SECRET_KEY: "sk_test_placeholder",
  PUBLIC_SITE_URL: "https://www.mythicchest.com/",
  STRIPE_AUTOMATIC_TAX: "false",
}

function postRequest(body) {
  return new Request("https://example.com/api/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

test("returns 503 coming-soon for POST while checkout is disabled", async () => {
  const response = await onRequest({ request: postRequest({ items: [] }), env: ENV })

  assert.equal(response.status, 503)
  const body = await response.json()
  assert.match(body.error, /coming soon/i)
})

test("returns 503 coming-soon for GET while checkout is disabled", async () => {
  const response = await onRequest({
    request: new Request("https://example.com/api/create-checkout-session"),
    env: ENV,
  })

  assert.equal(response.status, 503)
})

test("getValidatedItems rejects unknown catalog ids", () => {
  assert.throws(() => getValidatedItems([{ id: 999, quantity: 1 }]), /invalid item/)
})

test("getValidatedItems rejects out-of-range quantities", () => {
  assert.throws(() => getValidatedItems([{ id: 1, quantity: 0 }]), /invalid item/)
  assert.throws(() => getValidatedItems([{ id: 1, quantity: 11 }]), /invalid item/)
})

test("getValidatedItems rejects empty or oversized carts", () => {
  assert.throws(() => getValidatedItems([]), /empty/)
  assert.throws(
    () => getValidatedItems(Array.from({ length: 21 }, () => ({ id: 1, quantity: 1 }))),
    /too many/,
  )
})

test("buildStripeParams uses the server-side catalog price, not client input", () => {
  const items = getValidatedItems([{ id: 1, quantity: 2, unitAmount: 1, price: 1 }])
  const params = buildStripeParams(items, "https://www.mythicchest.com", "false")

  assert.equal(params.get("line_items[0][price_data][unit_amount]"), "8999")
  assert.equal(params.get("line_items[0][quantity]"), "2")
  assert.equal(params.get("payment_method_types[0]"), "card")
  assert.equal(params.get("shipping_options[0][shipping_rate_data][fixed_amount][amount]"), "1200")
  assert.equal(params.get("automatic_tax[enabled]"), "false")
  assert.equal(
    params.get("success_url"),
    "https://www.mythicchest.com/checkout/success?session_id={CHECKOUT_SESSION_ID}",
  )
  assert.equal(params.get("cancel_url"), "https://www.mythicchest.com/checkout")
})
