# Custom-tee order pipeline — build spec (DRAFT)

Status: draft for Brenton's review. Nothing is built or changed yet.
Covers your 2026-10-12 requirement: no customer preview downloads, previews stay
watermarked on the customer side, and on Stripe-confirmed payment you get emailed
the design package (clean front/back preview PNGs, raw design files, full spec sheet).

## What's already in the repo (verified 2026-10-12)

- `src/pages/CustomTeePage.jsx` — full client builder: upload/drag/resize/position
  art, 4–12" print width, 5 shirt colors, S–3XL sizing ($25 S–XL / $28 2XL / $30 3XL,
  +$4 back print), 10-shirt minimum. Preview has a DOM watermark overlay
  ("Mythic Chest • Preview Only") with a code comment keeping it out of PNG exports.
- `src/context/CartContext.jsx` — cart persists to localStorage; custom-tee lines
  carry `notes` + `designBrief` only. **The uploaded artwork, positions, and print
  sizes are dropped by `handleAddToCart` — no design data reaches the cart.**
- `functions/api/create-checkout-session.js` — `COMING_SOON = true`; only accepts
  the 3-Gunpla catalog and would reject custom-tee line items. No webhook, no order
  email anywhere in `functions/`.

So: the page is done, the pipeline after "Add to Cart" does not exist.

## Proposed pipeline

1. **Capture at add-to-cart.** Build a `designPackage` per tee line:
   `{ color, sizeBreakdown: {S:2, M:3…}, totalQty, notes, designBrief,
     sides: { front: { dataUrl, inches, pos:{x,y} }, back: {…} } }`.
   Keep raw art OUT of localStorage (5 MB quota — one PNG data URL can blow it):
   hold art in a module-level store keyed by cart-line id; the cart line keeps only
   a `designRef`. Art is the customer's own file, so the protection target is the
   *composition* — block right-click on the preview containers
   (`onContextMenu={e => e.preventDefault()}`), keep the DOM watermark overlay,
   keep `draggable={false}`. Note honestly: screenshots can't be blocked; the clean
   PNG is never served to the browser.
2. **Clean previews rendered at checkout, not browsed.** On checkout, render the
   composition to an offscreen canvas at 300 DPI from the `inches` value (e.g.
   10" → 3000 px wide) and upload the PNG bytes with the session-creation POST.
   No watermark in these renders.
3. **Session creation validates tee pricing server-side.** Add a tee price table
   to `create-checkout-session.js` (S–XL $25, 2XL $28, 3XL $30, +$4 back print —
   matches the 2026-10-12 cost research) so prices can't be tampered with client-side.
   Raw art capped at 5 MB/file.
4. **Design package stored, referenced from Stripe.** Store the package (raw art +
   clean PNGs + spec JSON) and put the storage key in the Stripe session metadata.
   Storage: Cloudflare R2 bucket `mythic-chest-designs` (new; your dashboard click).
5. **Stripe webhook → your email.** New `functions/api/stripe-webhook.js`:
   verify the Stripe signature (`STRIPE_WEBHOOK_SECRET`), on
   `checkout.session.completed` pull the package and email you via Resend (same
   from-Functions pattern as the contact form) with:
   - clean front/back PNGs at print size (300 DPI),
   - the raw uploaded art files (so you can fix/adjust in the RIP),
   - a spec sheet: print size per side (inches), placement (% x/y), shirt color,
     size breakdown + quantities, customer notes, design brief, customer
     name/email from the Stripe session, session ID.
   Idempotency guard on the webhook (Stripe retries events); delete the R2 object
   after the email sends, or keep it as your archive — your call.

## Your clicks (nothing irreversible)

1. Cloudflare dashboard: create R2 bucket `mythic-chest-designs`, bind it to the
   Pages project.
2. Pages env vars: `RESEND_API_KEY` (same key as the contact form), and
   `STRIPE_WEBHOOK_SECRET` after you register the webhook endpoint in Stripe.
3. Lift `COMING_SOON` when you're ready to take orders.

## Decisions I need from you

1. **R2 vs. direct email attachments** (R2 recommended: keeps the webhook fast and
   gives you a permanent archive of every design).
2. **Confirm the spec-sheet fields** above (anything to add? e.g. preferred print
   position presets for the RIP).
3. **Keep the R2 object after the email sends** (archive) or delete it (privacy).

Say the word and I'll build it against the real repo with tests, EasyPost-style,
plus a `docs/custom-tee-pipeline.md` like the EasyPost one.
