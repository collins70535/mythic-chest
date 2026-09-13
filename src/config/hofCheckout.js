/** sessionStorage key for HoF embedded checkout payload (TEST spike). */
export const HOF_CHECKOUT_PAYLOAD_KEY = "hof-checkout-payload"

export const HOF_EMBEDDED_CHECKOUT_ENABLED =
  import.meta.env.VITE_HOF_EMBEDDED_CHECKOUT === "true" ||
  import.meta.env.VITE_HOF_EMBEDDED_CHECKOUT === "1"
