import heroChest from "../assets/hero-chest.webp"

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Display-case backdrop: purple glow + faint shelving grid */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 900px 460px at 50% 26%, rgba(147,51,234,0.32), transparent 65%)," +
            "radial-gradient(ellipse 1500px 700px at 50% 125%, rgba(88,28,135,0.28), transparent 60%)," +
            "linear-gradient(180deg, #0d0718 0%, #07040d 100%)",
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

      <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-8 text-center md:px-8">
        <img
          src={heroChest}
          alt="The Mythic Chest, overflowing with legendary loot"
          className="mx-auto w-[min(460px,82vw)] [mask-image:radial-gradient(ellipse_72%_80%_at_50%_46%,black_58%,transparent_98%)]"
        />

        <h1 className="mt-2 text-4xl font-black leading-tight tracking-tight md:text-6xl">
          Model Kits - Legendary Loot, No Grind Required
        </h1>

        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
          Curated model kits, figures, comics, and more — build a collection
          you love at prices that respect your budget.
        </p>
      </div>
    </section>
  )
}
