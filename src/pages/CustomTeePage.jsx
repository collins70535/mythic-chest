import { useRef, useState } from "react"
import blackShirt from "../assets/custom-tee-blank.png"
import whiteShirt from "../assets/custom-tee-white.png"
import navyShirt from "../assets/custom-tee-navy.png"
import charcoalShirt from "../assets/custom-tee-charcoal.png"
import { useCart } from "../context/useCart"

// Retail pricing from the 2026-10-12 cost research:
// Gildan 64000 Softstyle + $4 DTF print + $0.35 packaging per shirt.
const SIZES = [
  { label: "S", price: 25 },
  { label: "M", price: 25 },
  { label: "L", price: 25 },
  { label: "XL", price: 25 },
  { label: "2XL", price: 28 },
  { label: "3XL", price: 30 },
]

const COLORS = [
  { name: "Black", image: blackShirt, swatch: "#151515" },
  { name: "White", image: whiteShirt, swatch: "#f2f2f2" },
  { name: "Navy", image: navyShirt, swatch: "#1c2a4a" },
  { name: "Charcoal", image: charcoalShirt, swatch: "#3d3d3d" },
]

const MIN_INCHES = 4
const MAX_INCHES = 12
const DEFAULT_INCHES = 10

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

// Map print width in inches to a % of the preview width.
// The shirt spans roughly two-thirds of the mockup frame.
function inchesToPct(inches) {
  return (inches / 30) * 100
}

export default function CustomTeePage() {
  const { addItem } = useCart()
  const [designUrl, setDesignUrl] = useState(null)
  const [fileName, setFileName] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const [printInches, setPrintInches] = useState(DEFAULT_INCHES)
  const [pos, setPos] = useState({ x: 50, y: 40 })
  const [size, setSize] = useState("L")
  const [colorName, setColorName] = useState("Black")

  const previewRef = useRef(null)
  const dragState = useRef(null)
  const fileInputRef = useRef(null)

  const selectedSize = SIZES.find((s) => s.label === size)
  const selectedColor = COLORS.find((c) => c.name === colorName) ?? COLORS[0]
  const included = [
    `Gildan 64000 Softstyle tee — ${selectedColor.name.toLowerCase()}`,
    "Full-front DTF print of your design",
    "Packaging included",
  ]

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = () => {
      setDesignUrl(reader.result)
      setFileName(file.name)
    }
    reader.readAsDataURL(file)
  }

  const onDesignPointerDown = (event) => {
    if (!previewRef.current) return
    event.preventDefault()
    const rect = previewRef.current.getBoundingClientRect()
    dragState.current = {
      rect,
      startX: event.clientX,
      startY: event.clientY,
      origX: pos.x,
      origY: pos.y,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onDesignPointerMove = (event) => {
    const drag = dragState.current
    if (!drag) return
    const dx = ((event.clientX - drag.startX) / drag.rect.width) * 100
    const dy = ((event.clientY - drag.startY) / drag.rect.height) * 100
    setPos({
      x: clamp(drag.origX + dx, 8, 92),
      y: clamp(drag.origY + dy, 12, 88),
    })
  }

  const onDesignPointerUp = () => {
    dragState.current = null
  }

  const handleAddToCart = () => {
    if (!designUrl || !selectedSize) return
    const slug = fileName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    addItem({
      id: `custom-tee-${selectedColor.name.toLowerCase()}-${size.toLowerCase()}-${slug || "design"}`,
      slug: "custom-tee",
      name: `Custom Tee (${selectedColor.name}, ${size})`,
      price: `$${selectedSize.price.toFixed(2)}`,
      image: selectedColor.image,
    })
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
      <h1 className="text-4xl font-black tracking-tight md:text-5xl">
        Design Your Own Tee
      </h1>
      <p className="mt-3 max-w-2xl text-white/70">
        Upload your artwork, see it on the shirt, dial in the size and
        placement, then pick your color and size. Printed on a Gildan 64000
        Softstyle tee.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Preview */}
        <div>
          <div
            ref={previewRef}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5"
          >
            <img
              src={selectedColor.image}
              alt={`${selectedColor.name} Gildan 64000 Softstyle t-shirt preview`}
              className="block w-full select-none"
              draggable={false}
            />
            {designUrl ? (
              <img
                src={designUrl}
                alt="Your design preview"
                draggable={false}
                onPointerDown={onDesignPointerDown}
                onPointerMove={onDesignPointerMove}
                onPointerUp={onDesignPointerUp}
                onPointerCancel={onDesignPointerUp}
                className="absolute cursor-grab touch-none select-none active:cursor-grabbing"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  width: `${inchesToPct(printInches)}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="rounded-lg bg-black/60 px-4 py-2 text-sm text-white/80">
                  Upload your design to see it here
                </p>
              </div>
            )}
          </div>
          <p className="mt-2 text-xs text-white/50">
            Preview is approximate — drag the design to reposition it. Final
            print placement may vary slightly.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-6">
          {/* Step 1: Upload */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-bold">
              <span className="mr-2 text-blue-400">1</span> Upload your design
            </h2>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(false)
                handleFile(e.dataTransfer.files?.[0])
              }}
              className={`mt-3 flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
                dragOver
                  ? "border-blue-400 bg-blue-500/10"
                  : "border-white/20 hover:border-blue-400/60"
              }`}
            >
              <span className="text-sm font-semibold">
                {fileName || "Drop an image here or click to browse"}
              </span>
              <span className="mt-1 text-xs text-white/50">
                PNG, JPG, or WebP — transparent PNG works best
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </section>

          {/* Step 2: Adjust */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-bold">
              <span className="mr-2 text-blue-400">2</span> Size your print
            </h2>
            <label className="mt-3 block text-sm text-white/70">
              Print width:{" "}
              <span className="font-bold text-white">{printInches}&Prime;</span>
              <span className="text-white/50">
                {" "}
                (typical full front is 10&ndash;12&Prime;)
              </span>
            </label>
            <input
              type="range"
              min={MIN_INCHES}
              max={MAX_INCHES}
              step={0.5}
              value={printInches}
              disabled={!designUrl}
              onChange={(e) => setPrintInches(Number(e.target.value))}
              className="mt-2 w-full accent-blue-500 disabled:opacity-40"
            />
            <button
              type="button"
              disabled={!designUrl}
              onClick={() => setPos({ x: 50, y: 40 })}
              className="mt-2 rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:border-blue-400 hover:text-blue-300 disabled:opacity-40"
            >
              Reset position
            </button>
          </section>

          {/* Step 3: Color + size + price */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-bold">
              <span className="mr-2 text-blue-400">3</span> Pick your color and
              size
            </h2>
            <div className="mt-3 flex items-center gap-3">
              {COLORS.map((option) => (
                <button
                  key={option.name}
                  type="button"
                  title={option.name}
                  aria-label={`Shirt color ${option.name}`}
                  aria-pressed={colorName === option.name}
                  onClick={() => setColorName(option.name)}
                  className={`h-10 w-10 rounded-full border-2 transition ${
                    colorName === option.name
                      ? "border-blue-400 ring-2 ring-blue-400/40"
                      : "border-white/20 hover:border-white/50"
                  }`}
                  style={{ backgroundColor: option.swatch }}
                />
              ))}
              <span className="text-sm text-white/70">{selectedColor.name}</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {SIZES.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setSize(option.label)}
                  className={`rounded-xl border px-3 py-3 text-center transition ${
                    size === option.label
                      ? "border-blue-400 bg-blue-500/20"
                      : "border-white/10 bg-black/40 hover:border-blue-400/60"
                  }`}
                >
                  <span className="block font-bold">{option.label}</span>
                  <span className="block text-sm text-white/70">
                    ${option.price}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-5 border-t border-white/10 pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-white/70">Your price</span>
                <span className="text-3xl font-black text-blue-400">
                  ${selectedSize.price.toFixed(2)}
                </span>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-white/70">
                {included.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-blue-400">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-white/50">
                Shipping calculated at checkout.
              </p>
              <button
                type="button"
                disabled={!designUrl}
                onClick={handleAddToCart}
                className="mt-4 w-full rounded-xl bg-blue-500 px-6 py-3 font-bold uppercase tracking-wider text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {designUrl ? "Add to Cart" : "Upload a design first"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
