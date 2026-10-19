const items = [
  {
    title: "Fast Shipping",
    text: "Get your gear quickly",
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
    title: "Secure Checkout",
    text: "Shop with confidence",
    icon: (
      <>
        <path d="M12 2.5 20 5.5v5.2c0 5-3.4 8.6-8 10.3C7.4 19.3 4 15.7 4 10.7V5.5Z" />
        <path d="m8.8 11.6 2.3 2.3 4.2-4.6" />
      </>
    ),
  },
  {
    title: "Collectibles & More",
    text: "Figures, model kits & more",
    icon: (
      <>
        <path d="M3 8.5 12 3l9 5.5v7L12 21l-9-5.5Z" />
        <path d="M3 8.5h18M12 3v18" />
      </>
    ),
  },
  {
    title: "Veteran Owned",
    text: "Supporting a Veteran Owned Business",
    icon: (
      <path d="m12 3.2 2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L3.3 9.6l6-.9Z" />
    ),
  },
]

export default function TrustBar() {
  return (
    <section className="px-5 md:px-8" aria-label="Why shop Mythic Chest">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
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
