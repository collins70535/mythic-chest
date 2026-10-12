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
    cardImage: "/garments/tee.png",
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
    cardImage: "/garments/hoodie.png",
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
    blurb: "Sport-Tek ST253 quarter-zip",
    cardDescription: "Quarter-zip pullover — soft fleece, clean look",
    cardImage: "/garments/quarter-zip.png",
    available: true,
    minQty: 10,
    itemNoun: "quarter-zip",
    itemNounPlural: "quarter-zips",
    // JiffyShirts black blanks verified 2026-10-12: S–XL $29.93, 2XL $31.68,
    // 3XL $35.21. Retail = blank + $7 print + $0.35 packaging + ~$9 profit.
    sizes: [
      { label: "S", price: 46 },
      { label: "M", price: 46 },
      { label: "L", price: 46 },
      { label: "XL", price: 46 },
      { label: "2XL", price: 48 },
      { label: "3XL", price: 52 },
    ],
    colors: [
      { name: "White", slug: "white", swatch: "#f2f2f2" },
      { name: "Black", slug: "black", swatch: "#151515" },
      { name: "Athletic Heather", slug: "athletic-heather", swatch: "#a7adb5" },
      { name: "Vintage Heather", slug: "vintage-heather", swatch: "#7d8288" },
      { name: "Graphite Heather", slug: "graphite-heather", swatch: "#45484e" },
      { name: "True Red", slug: "true-red", swatch: "#cf2233" },
      { name: "Maroon", slug: "maroon", swatch: "#5e1f24" },
      { name: "Forest Green", slug: "forest-green", swatch: "#14532d" },
      { name: "True Royal", slug: "true-royal", swatch: "#1e4fd8" },
      { name: "True Navy", slug: "true-navy", swatch: "#1a2f5a" },
    ],
    mockup: (colorSlug, side) =>
      `/mockups/custom-quarter-zip-${colorSlug}-${side}.png`,
  },
  "ls-tee": {
    slug: "ls-tee",
    name: "Long-Sleeve Tee",
    label: "Long-Sleeve Tee",
    blurb: "Gildan G540 long-sleeve tee",
    cardDescription: "Long-sleeve tee — lightweight cotton, everyday wear",
    cardImage: "/garments/ls-tee.png",
    available: true,
    minQty: 10,
    itemNoun: "shirt",
    itemNounPlural: "shirts",
    // JiffyShirts black blanks verified 2026-10-12: S $4.98, M–XL $7.53,
    // 2XL $10.01, 3XL $14.01. Retail = blank + $7 + $0.35 + ~$14 profit.
    sizes: [
      { label: "S", price: 26 },
      { label: "M", price: 29 },
      { label: "L", price: 29 },
      { label: "XL", price: 29 },
      { label: "2XL", price: 31 },
      { label: "3XL", price: 35 },
    ],
    colors: COLORS,
    mockup: (colorSlug, side) =>
      `/mockups/custom-ls-tee-${colorSlug}-${side}.png`,
  },
  jersey: {
    slug: "jersey",
    name: "Team Jersey",
    label: "Jersey",
    blurb: "Sport-Tek ST350 performance jersey",
    cardDescription: "Performance jersey — breathable mesh, custom numbers",
    cardImage: "/garments/jersey.png",
    available: true,
    minQty: 10,
    itemNoun: "jersey",
    itemNounPlural: "jerseys",
    // JiffyShirts black blanks verified 2026-10-12: S–XL $7.02, 2XL $8.21,
    // 3XL $12.31. Retail = blank + $7 + $0.35 + ~$14 profit.
    sizes: [
      { label: "S", price: 28 },
      { label: "M", price: 28 },
      { label: "L", price: 28 },
      { label: "XL", price: 28 },
      { label: "2XL", price: 30 },
      { label: "3XL", price: 34 },
    ],
    colors: [
      { name: "Black", slug: "black", swatch: "#151515" },
      { name: "White", slug: "white", swatch: "#f2f2f2" },
      { name: "True Navy", slug: "true-navy", swatch: "#1a2f5a" },
      { name: "True Red", slug: "true-red", swatch: "#cf2233" },
      { name: "True Royal", slug: "true-royal", swatch: "#1e4fd8" },
      { name: "Forest Green", slug: "forest-green", swatch: "#14532d" },
      { name: "Purple", slug: "purple", swatch: "#6b21a8" },
      { name: "Carolina Blue", slug: "carolina-blue", swatch: "#60a5fa" },
      { name: "Gold", slug: "gold", swatch: "#eab308" },
      { name: "Silver", slug: "silver", swatch: "#c4c7cc" },
      { name: "Kelly Green", slug: "kelly-green", swatch: "#009444" },
      { name: "Maroon", slug: "maroon", swatch: "#5e1f24" },
    ],
    mockup: (colorSlug, side) =>
      `/mockups/custom-jersey-${colorSlug}-${side}.png`,
  },
  polo: {
    slug: "polo",
    name: "Polo",
    label: "Polo",
    blurb: "Gildan G880 pique polo",
    cardDescription: "Pique polo — collar, breathable cotton",
    cardImage: "/garments/polo.png",
    available: true,
    minQty: 10,
    itemNoun: "polo",
    itemNounPlural: "polos",
    // JiffyShirts black blanks verified 2026-10-12: S $7.98, M–XL $9.70,
    // 2XL $16.13, 3XL $18.73. Retail = blank + $7 + $0.35 + ~$14 profit.
    sizes: [
      { label: "S", price: 29 },
      { label: "M", price: 31 },
      { label: "L", price: 31 },
      { label: "XL", price: 31 },
      { label: "2XL", price: 37 },
      { label: "3XL", price: 40 },
    ],
    colors: [
      { name: "Black", slug: "black", swatch: "#151515" },
      { name: "White", slug: "white", swatch: "#f2f2f2" },
      { name: "Navy", slug: "navy", swatch: "#1c2a4a" },
      { name: "Red", slug: "red", swatch: "#b91c1c" },
      { name: "Royal", slug: "royal", swatch: "#1e40af" },
      { name: "Forest Green", slug: "forest-green", swatch: "#14532d" },
      { name: "Purple", slug: "purple", swatch: "#6b21a8" },
      { name: "Gold", slug: "gold", swatch: "#eab308" },
      { name: "Carolina Blue", slug: "carolina-blue", swatch: "#60a5fa" },
      { name: "Sport Grey", slug: "sport-grey", swatch: "#9ca3af" },
    ],
    mockup: (colorSlug, side) =>
      `/mockups/custom-polo-${colorSlug}-${side}.png`,
  },
}

export const garmentList = Object.values(GARMENTS)
