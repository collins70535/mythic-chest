import barbatosLupusImage from "../assets/products/barbatos-lupus.png"
import rx78GundamImage from "../assets/products/rx-78-gundam.png"
import wingZeroCustomImage from "../assets/products/wing-zero-custom.png"

const products = [
  {
    id: 1,
    slug: "rx-78-gundam",
    categoryId: "gundam-models",
    category: "Universal Century",
    series: "Mobile Suit Gundam",
    grade: "Master Grade",
    name: "RX-78 Gundam",
    price: "$89.99",
    stock: "In Stock",
    description:
      "The legendary RX-78 Gundam featuring awesome articulation, iconic panel detail, and a display-ready silhouette for Universal Century collectors.",
    features: [
      "Precision-molded armor with sharp panel definition",
      "Flexible inner frame for dynamic posing",
      "Includes beam rifle, shield, and display accessories",
    ],
    image: rx78GundamImage,
  },

  {
    id: 2,
    slug: "wing-zero-custom",
    categoryId: "gundam-models",
    category: "Gundam Wing",
    series: "Endless Waltz",
    grade: "Master Grade Ver. Ka",
    name: "Wing Zero Custom",
    price: "$119.99",
    stock: "Low Stock",
    description:
      "High-detail Endless Waltz variant with an angel-wing configuration, dramatic proportions, and shelf presence built for centerpiece displays.",
    features: [
      "Layered wing binders with wide display range",
      "Twin buster rifle loadout",
      "Awesome decal sheet for Ver. Ka styling",
    ],
    image: wingZeroCustomImage,
  },

  {
    id: 3,
    slug: "barbatos-lupus",
    categoryId: "gundam-models",
    category: "Iron-Blooded Orphans",
    series: "Post Disaster",
    grade: "Full Mechanics",
    name: "Barbatos Lupus",
    price: "$99.99",
    stock: "In Stock",
    description:
      "Aggressive close-combat mobile suit with enhanced armor, heavy melee presence, and the raw mechanical character of Iron-Blooded Orphans.",
    features: [
      "Extended limb proportions for action-heavy posing",
      "Large mace weapon system included",
      "Mechanical frame details visible through armor breaks",
    ],
    image: barbatosLupusImage,
  },
]

export default products
