import { Link } from "react-router-dom"
import allMightImage from "../assets/products/anime-heroes-all-might.webp"

function Spotlight() {
  return (
    <div className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-[2rem] border border-amber-300/25 bg-black/45 p-5 shadow-[0_35px_100px_rgba(37,8,68,0.7)] sm:p-7">
      <div className="absolute inset-x-[12%] top-0 h-px bg-gradient-to-r from-transparent via-amber-200/90 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.07),transparent_24%,transparent_70%,rgba(168,85,247,0.08))]" />
      <p className="relative mb-5 text-center text-sm font-black uppercase tracking-[0.22em] text-amber-200 sm:text-base">
        Inside the Chest · Item Spotlight
      </p>
      <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="flex shrink-0 flex-col items-center gap-3">
          <div className="aspect-square w-44 overflow-hidden rounded-2xl bg-black ring-1 ring-white/10 sm:w-48">
            <img
              src={allMightImage}
              alt="All Might Anime Heroes figure"
              className="h-full w-full object-contain"
            />
          </div>
          <p className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-xl font-extrabold text-amber-300">$29.99</span>
            <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-amber-200">
              Arriving Dec 5
            </span>
          </p>
        </div>
        <div className="min-w-0 text-center sm:text-left">
          <h2 className="text-3xl font-black tracking-tight text-white">
            All Might
          </h2>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-purple-300">
            Anime Heroes · My Hero Academia
          </p>
          <p className="mt-4 text-sm leading-6 text-zinc-300">
            Born Toshinori Yagi, All Might was once Quirkless. Nana Shimura
            passed her Quirk, One For All, to him because she believed in his
            dream of becoming a hero who could inspire hope. The power had been
            passed down through generations, growing stronger with each
            successor—and Toshinori carried it forward to become the Symbol of
            Peace. Plus Ultra!
          </p>
          <Link
            to="/product/anime-heroes-all-might"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-amber-400 px-6 py-2.5 text-sm font-extrabold text-[#12091f] transition hover:bg-amber-300"
          >
            View this figure
          </Link>
        </div>
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

        <Spotlight />
      </div>
    </section>
  )
}
