import actionBasesImage from "../assets/categories/action-bases.png"
import blokkeesChampionImage from "../assets/categories/blokkees-champion-kits.png"
import gundamModelsImage from "../assets/categories/gundam-models.png"

const categories = [
  {
    id: "gundam-models",
    name: "Gundam Models",
    eyebrow: "Master Grade / High Grade / Real Grade",
    description:
      "Premium Gunpla kits for builders who want centerpiece models and classic shelf presence.",
    image: gundamModelsImage,
    href: "/#gundam-models",
  },
  {
    id: "blokkees-champion",
    name: "Blokkees Champion Class",
    eyebrow: "Snap-build collectible kits",
    description:
      "Champion Class Blokkees kits with display-ready figures, accessories, and collector packaging.",
    image: blokkeesChampionImage,
    href: "/#blokkees-champion",
  },
  {
    id: "action-bases",
    name: "3D Printed Action Bases",
    eyebrow: "Flight stands / adapters / display parts",
    description:
      "Modular action bases, support arms, and posing adapters made for cleaner display setups.",
    image: actionBasesImage,
    href: "/#action-bases",
  },
]

export default categories
