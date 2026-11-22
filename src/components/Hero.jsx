import piccoloImage from "../assets/products/ichibansho-piccolo.jpg"
import muichiroImage from "../assets/products/pop-demon-slayer-muichiro-chase.jpg"
import gojoImage from "../assets/products/pop-jjk-gojo.jpg"
import allMightImage from "../assets/products/anime-heroes-all-might.webp"
import dekuImage from "../assets/products/pop-premium-mha-deku.webp"
import pikachuImage from "../assets/products/pop-pokemon-pikachu-waving.webp"
import lucarioImage from "../assets/products/pop-pokemon-lucario.png"
import aceImage from "../assets/products/abystyle-sfc-one-piece-ace.webp"

const shelves = [
  [
    { src: piccoloImage, alt: "Piccolo Ichibansho figure" },
    { src: muichiroImage, alt: "Muichiro Tokito Chase Funko Pop!" },
  ],
  [
    { src: gojoImage, alt: "Satoru Gojo Funko Pop!" },
    { src: allMightImage, alt: "All Might Anime Heroes figure" },
    { src: dekuImage, alt: "Deku Funko Pop! Premium" },
  ],
  [
    { src: pikachuImage, alt: "Pikachu Funko Pop!" },
    { src: lucarioImage, alt: "Lucario Funko Pop!" },
    { src: aceImage, alt: "Ace ABYstyle figure" },
  ],
]

function DisplayCase() {
  return (
    <div className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-[2rem] border border-amber-300/25 bg-black/45 p-5 shadow-[0_35px_100px_rgba(37,8,68,0.7)] sm:p-7">
      <div className="absolute inset-x-[12%] top-0 h-px bg-gradient-to-r from-transparent via-amber-200/90 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.07),transparent_24%,transparent_70%,rgba(168,85,247,0.08))]" />
      <p className="relative mb-5 text-center text-[10px] font-extrabold uppercase tracking-[0.3em] text-amber-200/90">
        Inside the chest · Arriving Dec 5
      </p>
      <div className="relative grid gap-5">
        {shelves.map((shelf, index) => (
          <div
            key={index}
            className="flex items-end justify-center gap-5 border-b border-amber-200/20 pb-4 last:border-b-0 last:pb-0"
          >
            {shelf.map((item) => (
              <img
                key={item.alt}
                src={item.src}
                alt={item.alt}
                className="h-24 w-auto max-w-[30%] object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.55)] sm:h-28"
                loading="lazy"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-purple-400/10">
      {/* Display-case backdrop: purple glow + faint shelving grid */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 700px 560px at 76% 44%, rgba(147,51,234,0.34), transparent 66%)," +
            "radial-gradient(ellipse 1000px 620px at 24% 80%, rgba(88,28,135,0.22), transparent 64%)," +
            "linear-gradient(135deg, #08040f 0%, #120721 52%, #07030c 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(168,85,247,0.055) 0 2px, transparent 2px 150px)," +
            "repeating-linear-gradient(0deg, rgba(168,85,247,0.045) 0 2px, transparent 2px 170px)",
          maskImage:
            "linear-gradient(90deg, black 0%, transparent 22%, transparent 78%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, black 0%, transparent 22%, transparent 78%, black 100%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 md:px-8 lg:grid-cols-2 lg:py-20">
        <div className="text-left">
          <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.34em] text-amber-300 sm:text-sm">
            Curated for the display case
          </p>
          <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            Your Collection.
            <span className="mt-2 block bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
              Your Legend.
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
            Explore model kits, figures, comics, accessories, and custom apparel
            selected for collectors who want every shelf to tell a story.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#shop"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-amber-400 px-7 py-3 font-extrabold text-[#12091f] transition hover:bg-amber-300"
            >
              Explore the collection
            </a>
            <a
              href="#about-mythic-chest"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-purple-300/30 bg-white/5 px-7 py-3 font-bold text-white transition hover:border-amber-300/70 hover:text-amber-200"
            >
              Meet Mythic Chest
            </a>
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Veteran-owned · Cleveland, Texas
          </p>
        </div>

        <DisplayCase />
      </div>
    </section>
  )
}
