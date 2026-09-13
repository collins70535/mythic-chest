import assert from "node:assert/strict"
import test from "node:test"

import handler from "../api/create-hall-of-fame-checkout-session.js"

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

const customer = { name: "Test Buyer", email: "buyer@example.com", phone: "3375550100" }

function withEnv(overrides, fn) {
  const previous = {}
  for (const [key, value] of Object.entries(overrides)) {
    previous[key] = process.env[key]
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
  return Promise.resolve()
    .then(fn)
    .finally(() => {
      for (const [key, value] of Object.entries(previous)) {
        if (value === undefined) delete process.env[key]
        else process.env[key] = value
      }
    })
}

test("rejects unsupported methods", async () => {
  const response = createResponse()
  await handler({ method: "GET", headers: {} }, response)
  assert.equal(response.statusCode, 405)
})

test("rejects Youth without sizeDetail before contacting Stripe", async () => {
  await withEnv({ STRIPE_SECRET_KEY: "sk_test_placeholder", HOF_EMBEDDED_CHECKOUT: undefined }, async () => {
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
        body: {
          cart: [{ color: "Green", size: "Youth", quantity: 1 }],
          customer,
          fulfillment: "Local Pickup",
        },
      },
      response,
    )

    globalThis.fetch = originalFetch
    assert.equal(response.statusCode, 400)
    assert.match(response.body.error, /size detail/i)
    assert.equal(called, false)
  })
})

test("rejects Toddler without sizeDetail before contacting Stripe", async () => {
  await withEnv({ STRIPE_SECRET_KEY: "sk_test_placeholder", HOF_EMBEDDED_CHECKOUT: undefined }, async () => {
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
        body: {
          cart: [{ color: "Black", size: "Toddler", quantity: 2, sizeDetail: "   " }],
          customer,
          fulfillment: "Local Pickup",
        },
      },
      response,
    )

    globalThis.fetch = originalFetch
    assert.equal(response.statusCode, 400)
    assert.match(response.body.error, /size detail/i)
    assert.equal(called, false)
  })
})

test("hosted (flag off): returns url and keeps item_N_* metadata", async () => {
  await withEnv({ STRIPE_SECRET_KEY: "sk_test_placeholder", HOF_EMBEDDED_CHECKOUT: "false" }, async () => {
    const originalFetch = globalThis.fetch
    let stripeRequest
    globalThis.fetch = async (url, options) => {
      stripeRequest = { url, options }
      return new Response(JSON.stringify({ url: "https://checkout.stripe.com/test-hof-session" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }
    const response = createResponse()

    await handler(
      {
        method: "POST",
        body: {
          cart: [
            { color: "White", size: "S", quantity: 1 },
            { color: "Green", size: "Youth", quantity: 1, sizeDetail: "YS / 10-12" },
            { color: "Black", size: "Toddler", quantity: 1, sizeDetail: "1T-2T" },
          ],
          customer,
          fulfillment: "Local Pickup",
        },
      },
      response,
    )

    globalThis.fetch = originalFetch
    const params = new URLSearchParams(stripeRequest.options.body)
    assert.equal(response.statusCode, 200)
    assert.equal(response.body.url, "https://checkout.stripe.com/test-hof-session")
    assert.equal(response.body.clientSecret, undefined)
    assert.equal(params.get("ui_mode"), null)
    assert.ok(params.get("success_url"))
    assert.ok(params.get("cancel_url"))
    assert.equal(params.get("return_url"), null)
    assert.equal(params.get("line_items[0][price_data][unit_amount]"), "2000")
    assert.equal(params.get("line_items[0][price_data][product_data][name]"), "Hall of Fame 2026 Tee — White, S")
    assert.equal(params.get("metadata[item_0_color]"), "White")
    assert.equal(params.get("metadata[item_0_size]"), "S")
    assert.equal(params.get("line_items[1][price_data][unit_amount]"), "1200")
    assert.equal(params.get("line_items[1][price_data][product_data][name]"), "Hall of Fame 2026 Tee — Youth, detail: YS / 10-12")
    assert.equal(params.get("metadata[item_1_color]"), "Green")
    assert.equal(params.get("metadata[item_1_size]"), "Youth")
    assert.equal(params.get("metadata[item_1_size_detail]"), "YS / 10-12")
    assert.equal(params.get("line_items[2][price_data][unit_amount]"), "1200")
    assert.equal(params.get("line_items[2][price_data][product_data][name]"), "Hall of Fame 2026 Tee — Toddler, detail: 1T-2T")
    assert.equal(params.get("metadata[item_2_size_detail]"), "1T-2T")
    assert.equal(params.get("metadata[fulfillment]"), "Local Pickup")
    assert.equal(params.get("metadata[customer_name]"), "Test Buyer")
    assert.equal(params.get("metadata[customer_phone]"), "3375550100")
  })
})

test("embedded (flag on): returns client_secret, uses ui_mode=embedded_page, keeps item_N_* metadata", async () => {
  await withEnv({ STRIPE_SECRET_KEY: "sk_test_placeholder", HOF_EMBEDDED_CHECKOUT: "true" }, async () => {
    const originalFetch = globalThis.fetch
    let stripeRequest
    globalThis.fetch = async (url, options) => {
      stripeRequest = { url, options }
      return new Response(
        JSON.stringify({
          id: "cs_test_embedded",
          client_secret: "cs_test_embedded_secret_value",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      )
    }
    const response = createResponse()

    await handler(
      {
        method: "POST",
        body: {
          cart: [
            { color: "Green", size: "L", quantity: 2 },
            { color: "Black", size: "Youth", quantity: 1, sizeDetail: "YS" },
          ],
          customer,
          fulfillment: "Delivery",
        },
      },
      response,
    )

    globalThis.fetch = originalFetch
    const params = new URLSearchParams(stripeRequest.options.body)
    assert.equal(response.statusCode, 200)
    assert.equal(response.body.clientSecret, "cs_test_embedded_secret_value")
    assert.equal(response.body.url, undefined)
    assert.equal(params.get("ui_mode"), "embedded_page")
    assert.equal(
      params.get("return_url"),
      "https://mythic-chest.com/hall-of-fame-2026?payment=success&session_id={CHECKOUT_SESSION_ID}",
    )
    assert.equal(params.get("success_url"), null)
    assert.equal(params.get("cancel_url"), null)
    assert.equal(params.get("metadata[item_0_color]"), "Green")
    assert.equal(params.get("metadata[item_0_size]"), "L")
    assert.equal(params.get("metadata[item_1_color]"), "Black")
    assert.equal(params.get("metadata[item_1_size]"), "Youth")
    assert.equal(params.get("metadata[item_1_size_detail]"), "YS")
    assert.equal(params.get("metadata[fulfillment]"), "Delivery")
    assert.equal(params.get("metadata[checkout_ui]"), "embedded_page")
    assert.equal(params.get("shipping_address_collection[allowed_countries][0]"), "US")
  })
})

test("uses $20 for Small and includes Youth sizeDetail in Stripe line name/metadata", async () => {
  await withEnv({ STRIPE_SECRET_KEY: "sk_test_placeholder", HOF_EMBEDDED_CHECKOUT: undefined }, async () => {
    const originalFetch = globalThis.fetch
    let stripeRequest
    globalThis.fetch = async (url, options) => {
      stripeRequest = { url, options }
      return new Response(JSON.stringify({ url: "https://checkout.stripe.com/test-hof-session" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }
    const response = createResponse()

    await handler(
      {
        method: "POST",
        body: {
          cart: [
            { color: "White", size: "S", quantity: 1 },
            { color: "Green", size: "Youth", quantity: 1, sizeDetail: "YS / 10-12" },
            { color: "Black", size: "Toddler", quantity: 1, sizeDetail: "1T-2T" },
          ],
          customer,
          fulfillment: "Local Pickup",
        },
      },
      response,
    )

    globalThis.fetch = originalFetch
    const params = new URLSearchParams(stripeRequest.options.body)
    assert.equal(response.statusCode, 200)
    assert.equal(response.body.url, "https://checkout.stripe.com/test-hof-session")
    assert.equal(params.get("line_items[0][price_data][unit_amount]"), "2000")
    assert.equal(params.get("line_items[0][price_data][product_data][name]"), "Hall of Fame 2026 Tee — White, S")
    assert.equal(params.get("line_items[1][price_data][unit_amount]"), "1200")
    assert.equal(params.get("line_items[1][price_data][product_data][name]"), "Hall of Fame 2026 Tee — Youth, detail: YS / 10-12")
    assert.equal(params.get("metadata[item_1_size_detail]"), "YS / 10-12")
    assert.equal(params.get("line_items[2][price_data][unit_amount]"), "1200")
    assert.equal(params.get("line_items[2][price_data][product_data][name]"), "Hall of Fame 2026 Tee — Toddler, detail: 1T-2T")
    assert.equal(params.get("metadata[item_2_size_detail]"), "1T-2T")
  })
})

test("sanitizes and truncates sizeDetail to 40 characters", async () => {
  await withEnv({ STRIPE_SECRET_KEY: "sk_test_placeholder", HOF_EMBEDDED_CHECKOUT: undefined }, async () => {
    const originalFetch = globalThis.fetch
    let stripeRequest
    globalThis.fetch = async (url, options) => {
      stripeRequest = { url, options }
      return new Response(JSON.stringify({ url: "https://checkout.stripe.com/test-hof-session" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }
    const response = createResponse()
    const longDetail = `  Onesie ${"x".repeat(50)}  `

    await handler(
      {
        method: "POST",
        body: {
          cart: [{ color: "Green", size: "Toddler", quantity: 1, sizeDetail: longDetail }],
          customer,
          fulfillment: "Local Pickup",
        },
      },
      response,
    )

    globalThis.fetch = originalFetch
    const params = new URLSearchParams(stripeRequest.options.body)
    const detail = params.get("metadata[item_0_size_detail]")
    assert.equal(response.statusCode, 200)
    assert.equal(detail.length, 40)
    assert.equal(params.get("line_items[0][price_data][product_data][name]"), `Hall of Fame 2026 Tee — Toddler, detail: ${detail}`)
  })
})
