// Central catalog for the custom apparel studio.
// The gallery (/custom-apparel) renders a card per entry; the designer
// (/custom/:garmentSlug) renders entirely from the matching entry.
// To launch a new garment: set available: true, fill in sizes/colors/mockup,
// and add its tinted mockups under public/mockups/.

export const BACK_PRINT_PRICE = 7

// Orderable colors (JiffyShirts stock, verified 2026-10-12).
// Mockups live in public/mockups as custom-{tee|hoodie}-{slug}-{front|back}.png
export const COLORS = [
  { name: "Black", slug: "black", swatch: "#151515" },
  { name: "White", slug: "white", swatch: "#f2f2f2" },
  { name: "Navy", slug: "navy", swatch: "#1c2a4a" },
  { name: "Charcoal", slug: "charcoal", swatch: "#3d3d3d" },
  { name: "Red", slug: "red", swatch: "#b91c1c" },
  { name: "Royal", slug: "royal", swatch: "#1e40af" },
  { name: "Forest Green", slug: "forest-green", swatch: "#14532d" },
  { name: "Purple", slug: "purple", swatch: "#6b21a8" },
  { name: "Orange", slug: "orange", swatch: "#ea580c" },
  { name: "Gold", slug: "gold", swatch: "#eab308" },
  { name: "Carolina Blue", slug: "carolina-blue", swatch: "#60a5fa" },
  { name: "Sport Grey", slug: "sport-grey", swatch: "#9ca3af" },
]

const teeSizes = [
  { label: "S", price: 25 },
  { label: "M", price: 25 },
  { label: "L", price: 25 },
  { label: "XL", price: 25 },
  { label: "2XL", price: 28 },
  { label: "3XL", price: 30 },
]

const hoodieSizes = [
  { label: "S", price: 30 },
  { label: "M", price: 30 },
  { label: "L", price: 30 },
  { label: "XL", price: 30 },
  { label: "2XL", price: 35 },
  { label: "3XL", price: 38 },
]

export const GARMENTS = {
  tee: {
    slug: "tee",
    name: "Custom Tee",
    label: "Tee",
    blurb: "Gildan Softstyle tee",
    cardDescription: "Softstyle cotton tee — lightweight, classic fit",
    cardImage: "/mockups/custom-tee-black-front.png",
    available: true,
    minQty: 10,
    itemNoun: "shirt",
    itemNounPlural: "shirts",
    sizes: teeSizes,
    colors: COLORS,
    mockup: (colorSlug, side) =>
      `/mockups/custom-tee-${colorSlug}-${side}.png`,
  },
  hoodie: {
    slug: "hoodie",
    name: "Custom Hoodie",
    label: "Hoodie",
    blurb: "Gildan Heavy Blend hoodie",
    cardDescription: "Heavy Blend fleece hoodie — warm, relaxed fit",
    cardImage: "/mockups/custom-hoodie-black-front.png",
    available: true,
    minQty: 10,
    itemNoun: "hoodie",
    itemNounPlural: "hoodies",
    sizes: hoodieSizes,
    colors: COLORS,
    mockup: (colorSlug, side) =>
      `/mockups/custom-hoodie-${colorSlug}-${side}.png`,
  },
  "quarter-zip": {
    slug: "quarter-zip",
    name: "Quarter Zip",
    label: "Quarter Zip",
    blurb: "Quarter-zip pullover",
    cardDescription: "Quarter-zip pullover — soft fleece, clean look",
    cardImage: "/garments/quarter-zip.png",
    available: false,
  },
  "ls-tee": {
    slug: "ls-tee",
    name: "Long-Sleeve Tee",
    label: "Long-Sleeve Tee",
    blurb: "Long-sleeve tee",
    cardDescription: "Long-sleeve tee — lightweight cotton, everyday wear",
    cardImage: "/garments/ls-tee.png",
    available: false,
  },
  jersey: {
    slug: "jersey",
    name: "Team Jersey",
    label: "Jersey",
    blurb: "Performance team jersey",
    cardDescription: "Performance jersey — breathable mesh, custom numbers",
    cardImage: "/garments/jersey.png",
    available: false,
  },
  polo: {
    slug: "polo",
    name: "Polo",
    label: "Polo",
    blurb: "Pique polo",
    cardDescription: "Pique polo — collar, breathable cotton",
    cardImage: "/garments/polo.png",
    available: false,
  },
}

export const garmentList = Object.values(GARMENTS)
