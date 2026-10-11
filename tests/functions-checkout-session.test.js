import assert from "node:assert/strict"
import test from "node:test"

import { onRequest } from "../functions/api/checkout-session.js"

const ENV = { STRIPE_SECRET_KEY: "sk_test_placeholder" }

function getRequest(path) {
  return new Request(`https://example.com${path}`)
}

test("rejects non-GET methods with 405 and an Allow header", async () => {
  const response = await onRequest({
    request: new Request("https://example.com/api/checkout-session", { method: "POST" }),
    env: ENV,
  })

  assert.equal(response.status, 405)
  assert.equal(response.headers.get("Allow"), "GET")
})

test("returns 503 when Stripe is not configured", async () => {
  const response = await onRequest({ request: getRequest("/api/checkout-session"), env: {} })

  assert.equal(response.status, 503)
})

test("rejects malformed session ids without calling Stripe", async () => {
  const originalFetch = globalThis.fetch
  let called = false
  globalThis.fetch = async () => {
    called = true
    throw new Error("Stripe should not be called")
  }

  try {
    for (const bad of ["nope", "cs_live_", "cs_test_<script>", ""]) {
      const response = await onRequest({
        request: getRequest(`/api/checkout-session?session_id=${encodeURIComponent(bad)}`),
        env: ENV,
      })
      assert.equal(response.status, 400)
    }
    assert.equal(called, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test("returns the payment status for a valid session lookup", async () => {
  const originalFetch = globalThis.fetch
  let stripeRequest
  globalThis.fetch = async (url, options) => {
    stripeRequest = { url, options }
    return new Response(
      JSON.stringify({ status: "complete", payment_status: "paid" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    )
  }

  try {
    const response = await onRequest({
      request: getRequest("/api/checkout-session?session_id=cs_test_abc123"),
      env: ENV,
    })

    assert.equal(response.status, 200)
    const body = await response.json()
    assert.equal(body.status, "complete")
    assert.equal(body.paymentStatus, "paid")
    assert.ok(stripeRequest.url.includes("cs_test_abc123"))
    assert.match(stripeRequest.options.headers.Authorization, /^Basic /)
  } finally {
    globalThis.fetch = originalFetch
  }
})
