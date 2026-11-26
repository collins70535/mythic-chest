import actionBasesImage from "../assets/categories/action-bases.png"
import blokkeesChampionImage from "../assets/categories/blokkees-champion-kits.png"
import comicsImage from "../assets/categories/comics.jpg"
import gundamModelsImage from "../assets/categories/gundam-models.png"
import funkoPopImage from "../assets/products/pop-pokemon-pikachu-waving.webp"

const categories = [
  {
    id: "model-kits",
    name: "Model Kits",
    eyebrow: "Gunpla / snap-build kits",
    description:
      "Gundam HG and RG Gunpla plus Blokees figure kits — snap-build favorites with classic shelf presence.",
    image: gundamModelsImage,
    href: "/collections/model-kits",
  },
  {
    id: "figures",
    name: "Figures",
    eyebrow: "Anime figures / statues / collectibles",
    description:
      "Anime Heroes, Ichibansho, McFarlane, Minix, and more display figures with collector packaging — priced so you can actually build a collection.",
    image: blokkeesChampionImage,
    href: "/collections/figures",
  },
  {
    id: "funko-pops",
    name: "Funko Pop!",
    eyebrow: "Vinyl figures / chases / exclusives",
    description:
      "Funko Pop! vinyl figures in collector window packaging — commons, exclusives, and the occasional Chase, priced for real collections.",
    image: funkoPopImage,
    href: "/collections/funko-pops",
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
