import { useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useCart } from "../context/useCart"
import { BACK_PRINT_PRICE, GARMENTS } from "../config/garments"
import { COMING_SOON } from "../config/comingSoon"

const SIDES = ["front", "back"]

const MIN_INCHES = 4
const MAX_INCHES = 12
const DEFAULT_INCHES = 10

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

// Map print width in inches to a % of the preview width.
// The garment spans roughly two-thirds of the mockup frame.
function inchesToPct(inches) {
  return (inches / 30) * 100
}

function emptySideArt() {
  return { url: null, name: "", pos: { x: 50, y: 40 }, inches: DEFAULT_INCHES }
}

export default function GarmentDesignerPage() {
  const { garmentSlug } = useParams()
  const { addItem } = useCart()
  const [art, setArt] = useState({ front: emptySideArt(), back: emptySideArt() })
  const [dragOver, setDragOver] = useState(null)
  const [designDescription, setDesignDescription] = useState("")
  const [colorSlug, setColorSlug] = useState("black")
  const [quantities, setQuantities] = useState({})
  const [notes, setNotes] = useState("")

  const previewRefs = useRef({})
  const dragState = useRef(null)
  const fileInputRefs = useRef({})

  const garment = GARMENTS[garmentSlug]

  if (!garment || !garment.available) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center md:px-8">
        <h1 className="text-4xl font-black tracking-tight">
          Coming soon
        </h1>
        <p className="mt-3 text-white/70">
          We&apos;re still lining up blanks for this one. Check back shortly —
          or start with a garment that&apos;s ready today.
        </p>
        <Link
          to="/custom-apparel"
          className="mt-6 inline-block rounded-xl bg-blue-500 px-6 py-3 font-bold uppercase tracking-wider text-white transition hover:bg-blue-400"
        >
          Browse garments
        </Link>
      </div>
    )
  }

  const sizes = garment.sizes
  const minQty = garment.minQty
  const colors = garment.colors
  const mockup = garment.mockup
  const selectedColor = colors.find((c) => c.slug === colorSlug) ?? colors[0]
  const hasBackArt = art.back.url !== null
  const hasFrontArt = art.front.url !== null

  const unitPrice = (base) => base + (hasBackArt ? BACK_PRINT_PRICE : 0)

  const included = [
    `${garment.blurb} — ${selectedColor.name.toLowerCase()}`,
    "Front DTF print of your design",
    ...(hasBackArt ? ["Back DTF print"] : []),
    "Packaging included",
  ]

  const totalQty = sizes.reduce((sum, s) => sum + (quantities[s.label] ?? 0), 0)
  const totalPrice = sizes.reduce(
    (sum, s) => sum + (quantities[s.label] ?? 0) * unitPrice(s.price),
    0,
  )
  const hasArtwork =
    hasFrontArt || hasBackArt || designDescription.trim().length > 0
  const canAdd = !COMING_SOON && hasArtwork && totalQty >= minQty

  const updateSide = (side, patch) =>
    setArt((current) => ({
      ...current,
      [side]: { ...current[side], ...patch },
    }))

  const handleFile = (file, side) => {
    if (!file || !file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = () => {
      updateSide(side, { url: reader.result, name: file.name })
    }
    reader.readAsDataURL(file)
  }

  const clearSide = (side) => updateSide(side, emptySideArt())

  const setQty = (label, delta) =>
    setQuantities((current) => ({
      ...current,
      [label]: Math.max(0, (current[label] ?? 0) + delta),
    }))

  const onDesignPointerDown = (event) => {
    const side = event.currentTarget.dataset.side
    const panel = previewRefs.current[side]
    if (!panel) return
    event.preventDefault()
    const rect = panel.getBoundingClientRect()
    dragState.current = {
      rect,
      side,
      startX: event.clientX,
      startY: event.clientY,
      origX: art[side].pos.x,
      origY: art[side].pos.y,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onDesignPointerMove = (event) => {
    const drag = dragState.current
    if (!drag) return
    const dx = ((event.clientX - drag.startX) / drag.rect.width) * 100
    const dy = ((event.clientY - drag.startY) / drag.rect.height) * 100
    const pos = {
      x: clamp(drag.origX + dx, 8, 92),
      y: clamp(drag.origY + dy, 12, 88),
    }
    updateSide(drag.side, { pos })
  }

  const onDesignPointerUp = () => {
    dragState.current = null
  }

  const handleAddToCart = () => {
    if (!canAdd) return
    const frontSlug = art.front.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    const sidesLabel =
      hasFrontArt && hasBackArt ? "front-back" : hasBackArt ? "back" : "front"
    const sidesName =
      hasFrontArt && hasBackArt
        ? "front + back"
        : hasBackArt
          ? "back print"
          : "front print"
    const brief = designDescription.trim()
    sizes.forEach((s) => {
      const qty = quantities[s.label] ?? 0
      if (qty === 0) return
      addItem(
        {
          id: `custom-${garment.slug}-${selectedColor.slug}-${s.label.toLowerCase()}-${sidesLabel}-${frontSlug || "design"}`,
          slug: `custom-${garment.slug}`,
          name: `${garment.name} (${selectedColor.name}, ${s.label}, ${sidesName})`,
          price: `$${unitPrice(s.price).toFixed(2)}`,
          image: mockup(selectedColor.slug, "front"),
          notes: notes.trim() || undefined,
          designBrief: brief || undefined,
        },
        qty,
      )
    })
  }

  const remaining = minQty - totalQty
  const addLabel = !hasArtwork
    ? "Upload art or describe your design"
    : totalQty < minQty
      ? `Add ${remaining} more ${garment.itemNoun}${remaining === 1 ? "" : "s"} (${minQty} minimum)`
      : `Add ${totalQty} ${garment.itemNounPlural} — $${totalPrice.toFixed(2)}`

  const renderUpload = (side, title, hint) => (
    <div className="mt-3">
      <p className="text-sm font-semibold">
        {title}{" "}
        {side === "back" && (
          <span className="font-normal text-white/50">
            (optional, +${BACK_PRINT_PRICE}/item)
          </span>
        )}
      </p>
      {art[side].url ? (
        <div className="mt-2 flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-3 py-2">
          <span className="truncate text-sm text-white/80">{art[side].name}</span>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => clearSide(side)}
              className="rounded-lg border border-white/10 px-2 py-1 text-xs hover:border-red-400 hover:text-red-300"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRefs.current[side]?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(side)
          }}
          onDragLeave={() => setDragOver(null)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(null)
            handleFile(e.dataTransfer.files?.[0], side)
          }}
          className={`mt-2 flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition ${
            dragOver === side
              ? "border-blue-400 bg-blue-500/10"
              : "border-white/20 hover:border-blue-400/60"
          }`}
        >
          <span className="text-sm font-semibold">
            Drop an image here or click to browse
          </span>
          <span className="mt-1 text-xs text-white/50">{hint}</span>
        </button>
      )}
      <input
        ref={(el) => {
          fileInputRefs.current[side] = el
        }}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0], side)}
      />
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
      <Link
        to="/custom-apparel"
        className="text-sm font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300"
      >
        &larr; All garments
      </Link>
      <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
        {garment.name}
      </h1>
      <p className="mt-3 max-w-2xl text-white/70">
        Upload your artwork or describe what you want — we&apos;ll work with
        you to create the perfect design. Printed with DTF on a {garment.blurb},
        front and optional back print. Custom orders have a {minQty}-item
        minimum.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        {/* Preview */}
        <div className="lg:col-span-3">
          <div className="grid gap-6">
            {SIDES.map((side) => {
              const sideArt = art[side]
              return (
                <div key={side}>
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-white/60">
                    {side} preview
                  </h3>
                  <div
                    ref={(el) => {
                      previewRefs.current[side] = el
                    }}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                  >
                    <img
                      src={mockup(selectedColor.slug, side)}
                      alt={`${selectedColor.name} ${garment.blurb} ${side} preview`}
                      className="block w-full select-none"
                      draggable={false}
                    />
                    {sideArt.url ? (
                      <img
                        src={sideArt.url}
                        alt={`Your ${side} design preview`}
                        data-side={side}
                        draggable={false}
                        onPointerDown={onDesignPointerDown}
                        onPointerMove={onDesignPointerMove}
                        onPointerUp={onDesignPointerUp}
                        onPointerCancel={onDesignPointerUp}
                        className="absolute cursor-grab touch-none select-none active:cursor-grabbing"
                        style={{
                          left: `${sideArt.pos.x}%`,
                          top: `${sideArt.pos.y}%`,
                          width: `${inchesToPct(sideArt.inches)}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center p-6">
                        <p className="rounded-lg bg-black/60 px-4 py-2 text-center text-sm text-white/80">
                          {designDescription.trim()
                            ? "Thanks — we'll create your design together after you order."
                            : `Upload a ${side} design to see it here`}
                        </p>
                      </div>
                    )}
                    {/* Watermark: DOM overlay only — never rendered into the
                        PNG exports used for order emails. */}
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-10 overflow-hidden">
                      {[0, 1, 2].map((row) => (
                        <span
                          key={row}
                          className="rotate-[-18deg] whitespace-nowrap text-xl font-black uppercase tracking-[0.3em] text-white/15 md:text-2xl"
                        >
                          Mythic Chest &bull; Preview Only &bull; Mythic Chest
                          &bull; Preview Only
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="mt-2 text-xs text-white/50">
            Preview is approximate — drag the design to reposition it. Final
            print placement may vary slightly.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Step 1: Artwork */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-bold">
              <span className="mr-2 text-blue-400">1</span> Your artwork
            </h2>
            {renderUpload(
              "front",
              "Front design",
              "PNG, JPG, or WebP — transparent PNG works best",
            )}
            {renderUpload(
              "back",
              "Back design",
              "PNG, JPG, or WebP — transparent PNG works best",
            )}

            <div className="my-4 flex items-center gap-3 text-xs uppercase tracking-widest text-white/40">
              <span className="h-px flex-1 bg-white/10" />
              or describe it
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <label
              className="block text-sm text-white/70"
              htmlFor="design-description"
            >
              No artwork? Tell us what you want — we&apos;ll work with you to
              create it.
            </label>
            <textarea
              id="design-description"
              rows={3}
              value={designDescription}
              onChange={(e) => setDesignDescription(e.target.value)}
              placeholder="e.g. a roaring dragon wrapped around a basketball, neon colors"
              maxLength={500}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-blue-400 focus:outline-none"
            />
          </section>

          {/* Step 3: Adjust */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-bold">
              <span className="mr-2 text-blue-400">2</span> Size your prints
            </h2>
            {SIDES.filter((side) => art[side].url).map((side) => (
              <div key={side} className="mt-3">
                <label className="block text-sm capitalize text-white/70">
                  {side} print width:{" "}
                  <span className="font-bold text-white">
                    {art[side].inches}&Prime;
                  </span>
                  <span className="text-white/50">
                    {" "}
                    (typical full print is 10&ndash;12&Prime;)
                  </span>
                </label>
                <input
                  type="range"
                  min={MIN_INCHES}
                  max={MAX_INCHES}
                  step={0.5}
                  value={art[side].inches}
                  onChange={(e) =>
                    updateSide(side, { inches: Number(e.target.value) })
                  }
                  className="mt-2 w-full accent-blue-500"
                />
                <button
                  type="button"
                  onClick={() => updateSide(side, { pos: { x: 50, y: 40 } })}
                  className="mt-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:border-blue-400 hover:text-blue-300"
                >
                  Reset {side} position
                </button>
              </div>
            ))}
            {!hasFrontArt && !hasBackArt && (
              <p className="mt-3 text-sm text-white/50">
                Upload a design above to adjust its size and placement.
              </p>
            )}
          </section>

          {/* Step 4: Color, sizes, quantity */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-bold">
              <span className="mr-2 text-blue-400">3</span> Color, sizes, and
              quantity
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {colors.map((option) => (
                <button
                  key={option.slug}
                  type="button"
                  title={option.name}
                  aria-label={`${garment.label} color ${option.name}`}
                  aria-pressed={colorSlug === option.slug}
                  onClick={() => setColorSlug(option.slug)}
                  className={`h-10 w-10 rounded-full border-2 transition ${
                    colorSlug === option.slug
                      ? "border-blue-400 ring-2 ring-blue-400/40"
                      : "border-white/20 hover:border-white/50"
                  }`}
                  style={{ backgroundColor: option.swatch }}
                />
              ))}
              <span className="text-sm text-white/70">{selectedColor.name}</span>
            </div>

            <div className="mt-4 grid gap-2">
              {sizes.map((option) => (
                <div
                  key={option.label}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 py-2.5"
                >
                  <div>
                    <span className="font-bold">{option.label}</span>{" "}
                    <span className="text-sm text-white/60">
                      ${unitPrice(option.price).toFixed(2)}
                      {hasBackArt && (
                        <span className="text-white/40"> incl. back</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label={`Remove one ${option.label}`}
                      onClick={() => setQty(option.label, -1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-lg hover:bg-white/10"
                    >
                      &minus;
                    </button>
                    <span className="w-8 text-center font-bold">
                      {quantities[option.label] ?? 0}
                    </span>
                    <button
                      type="button"
                      aria-label={`Add one ${option.label}`}
                      onClick={() => setQty(option.label, 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-lg hover:bg-white/10"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-white/10 pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-white/70">
                  Total ({totalQty} {garment.itemNoun}
                  {totalQty === 1 ? "" : "s"})
                </span>
                <span className="text-3xl font-black text-blue-400">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              {totalQty < minQty && (
                <p className="mt-1 text-sm text-amber-300">
                  {minQty - totalQty} more to reach the {minQty}-item minimum.
                </p>
              )}
              <ul className="mt-3 space-y-1 text-sm text-white/70">
                {included.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-blue-400">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-white/50">
                {COMING_SOON
                  ? "Preview pricing only. Ordering and shipping quotes open at launch."
                  : "Shipping calculated at checkout."}
              </p>
              <label
                className="mt-4 block text-sm text-white/70"
                htmlFor="order-notes"
              >
                Notes for us <span className="text-white/40">(optional)</span>
              </label>
              <textarea
                id="order-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything we should know about your design or order?"
                maxLength={500}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-blue-400 focus:outline-none"
              />
              <button
                type="button"
                disabled={!canAdd}
                onClick={handleAddToCart}
                className="mt-4 w-full rounded-xl bg-blue-500 px-6 py-3 font-bold uppercase tracking-wider text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {COMING_SOON ? "Ordering opens at launch" : addLabel}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
