# React + Vite

## Stripe Checkout

The storefront creates hosted Stripe Checkout Sessions through the Vercel
Function at `api/create-checkout-session.js`. The browser sends only product IDs
and quantities; names and prices are validated against the server-side catalog.

Add these environment variables in Vercel under **Project Settings → Environment
Variables**, then redeploy:

- `STRIPE_SECRET_KEY`: start with a Stripe test key for validation, then replace
  it with the live secret key when the store is ready to accept real orders.
- `PUBLIC_SITE_URL`: `https://www.mythicchest.com`
- `STRIPE_AUTOMATIC_TAX`: keep `false` until tax registrations are configured in
  Stripe Tax; set it to `true` afterward.

Never add a real Stripe key to `.env.example`, source code, or Git. For local
end-to-end testing of the Vercel Function, use `vercel dev` rather than the Vite
development server by itself.

Before launch, configure a Stripe webhook for `checkout.session.completed` and
`checkout.session.async_payment_succeeded`. Stripe recommends webhooks for
reliable fulfillment because customers may not return to the success page.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
