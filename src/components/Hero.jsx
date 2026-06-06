import heroImage from "../assets/hero-workbench.png"

export default function Hero() {
  return (
    <section className="relative min-h-[680px] overflow-hidden">
      <img
        src={heroImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30" />

      <div className="relative mx-auto flex min-h-[680px] max-w-6xl items-center px-5 py-20 md:px-8">
        <div className="max-w-2xl">
          <p className="mb-5 text-sm uppercase tracking-[0.35em] text-blue-300">
            Collector Grade Kits
          </p>
          <h2 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
            Awesome models for legendary builds.
          </h2>

          <p className="max-w-xl text-lg leading-8 text-zinc-300">
            Model Kits and awesome hobby gear for builders who demand
            display-worthy detail.
          </p>

          <a
            href="#shop"
            className="mt-10 inline-flex rounded-xl bg-blue-500 px-8 py-4 font-semibold transition hover:bg-blue-400"
          >
            Explore Collection
          </a>
        </div>
      </div>
    </section>
  )
}
