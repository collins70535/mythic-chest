import actionBasesImage from "../assets/categories/action-bases.png"
import blokkeesChampionImage from "../assets/categories/blokkees-champion-kits.png"
import comicsImage from "../assets/categories/comics.jpg"
import gundamModelsImage from "../assets/categories/gundam-models.png"

const categories = [
  {
    id: "model-kits",
    name: "Model Kits",
    eyebrow: "Gunpla / High Grade / Master Grade",
    description:
      "Awesome Gunpla and snap-build kits for builders who want centerpiece models and classic shelf presence.",
    image: gundamModelsImage,
    href: "/collections/model-kits",
  },
  {
    id: "figures",
    name: "Figures",
    eyebrow: "Funko Pop! / anime figures / collectibles",
    description:
      "Funko Pop! vinyl, anime figures, and display collectibles with collector packaging — the fun stuff, priced so you can actually build a collection.",
    image: blokkeesChampionImage,
    href: "/collections/figures",
  },
  {
    id: "comics",
    name: "Comics",
    eyebrow: "Graphic novels / manga / collected editions",
    description:
      "Graphic novels, manga, and collected editions worth making shelf space for.",
    image: comicsImage,
    href: "/collections/comics",
  },
  {
    id: "accessories",
    name: "Accessories",
    eyebrow: "Pins / playing cards / display gear",
    description:
      "Enamel pins, playing cards, action bases, and display gear — the small stuff that finishes a shelf.",
    image: actionBasesImage,
    href: "/collections/accessories",
  },
]

export default categories
