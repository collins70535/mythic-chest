import { Link } from "react-router-dom"
import { garmentList } from "../config/garments"

export default function CustomApparelPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
      <h1 className="text-4xl font-black tracking-tight md:text-5xl">
        Design Your Own Apparel
      </h1>
      <p className="mt-3 max-w-2xl text-white/70">
        Pick a garment, upload your artwork or describe what you want, and
        we&apos;ll print it with DTF. Custom orders have a 10-item minimum.
      </p>
      <div className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
        <span className="text-blue-400">&#10003;</span> DTF printing
        <span className="text-white/30">&bull;</span> 10-item minimum
        <span className="text-white/30">&bull;</span> Front + optional back print
      </div>

      <h2 className="mt-10 text-xl font-bold uppercase tracking-widest text-white/60">
        Choose your garment
      </h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {garmentList.map((garment) => (
          <div
            key={garment.slug}
            className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 ${
              garment.available ? "" : "opacity-80"
            }`}
          >
            {!garment.available && (
              <span className="absolute right-4 top-4 z-10 rounded-full bg-amber-400/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">
                Coming soon
              </span>
            )}
            <div className="aspect-[4/3] overflow-hidden bg-[#e8e8e8]">
              <img
                src={garment.cardImage}
                alt={garment.name}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold">{garment.name}</h3>
              <p className="mt-1 text-sm text-white/60">
                {garment.cardDescription}
              </p>
              {garment.available ? (
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-black text-blue-300">
                    from ${garment.sizes[0].price}
                  </span>
                  <Link
                    to={`/custom/${garment.slug}`}
                    className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-blue-400"
                  >
                    Start designing
                  </Link>
                </div>
              ) : (
                <div className="mt-4">
                  <span className="inline-block w-full rounded-xl bg-white/10 px-5 py-2.5 text-center text-sm font-bold uppercase tracking-wider text-white/40">
                    Coming soon
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
        <h3 className="font-bold text-white">How custom orders work</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Choose your garment and upload artwork — or just describe it.</li>
          <li>Pick colors, sizes, and quantities (10-item minimum).</li>
          <li>
            We print with DTF, quality-check every piece, and ship your order.
          </li>
        </ol>
      </div>
    </div>
  )
}
