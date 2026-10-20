const items = [
  {
    title: "Curated Selection",
    text: "Shelf-worthy finds across every category",
    icon: (
      <>
        <rect x="1.5" y="6" width="13" height="10" rx="1" />
        <path d="M14.5 10h4l3.5 3.5V16h-7.5" />
        <circle cx="6" cy="18.5" r="1.8" />
        <circle cx="17.5" cy="18.5" r="1.8" />
      </>
    ),
  },
  {
    title: "Launch Preview",
    text: "Browse now; ordering opens later",
    icon: (
      <>
        <path d="M4 5.5h16v13H4z" />
        <path d="M8 9h8M8 13h5" />
      </>
    ),
  },
  {
    title: "Collector Focus",
    text: "Models, figures, comics, and display gear",
    icon: (
      <>
        <path d="M3 8.5 12 3l9 5.5v7L12 21l-9-5.5Z" />
        <path d="M3 8.5h18M12 3v18" />
      </>
    ),
  },
  {
    title: "Veteran Owned",
    text: "Built with service, care, and integrity",
    icon: (
      <path d="m12 3.2 2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L3.3 9.6l6-.9Z" />
    ),
  },
]

export default function TrustBar() {
  return (
    <section className="border-y border-white/5 bg-black/20 px-5 md:px-8" aria-label="Why explore Mythic Chest">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 py-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {items.map((item) => (
          <div key={item.title} className="flex items-center gap-4">
            <svg
              viewBox="0 0 24 24"
              className="h-10 w-10 shrink-0 text-amber-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.55)]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {item.icon}
            </svg>
            <div>
              <h2 className="text-base font-bold uppercase tracking-wide">
                {item.title}
              </h2>
              <p className="mt-0.5 text-sm text-zinc-400">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
