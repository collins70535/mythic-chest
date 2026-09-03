import { useEffect, useMemo, useState } from "react"
import "./HallOfFamePage.css"
import blackShirts from "../assets/hall-of-fame/black-shirts.png"
import greenWhiteShirts from "../assets/hall-of-fame/green-white-shirts.png"
import mitchellPhoto from "../assets/hall-of-fame/mitchell-number-7.jpg"

const colors = [
  { name: "Black", swatch: "#0a0a0a", image: blackShirts },
  { name: "Green", swatch: "#123d2a", image: greenWhiteShirts },
  { name: "White", swatch: "#f8f7f2", image: greenWhiteShirts },
]
const sizes = ["S", "M", "L", "XL", "2XL", "3XL"]
const prices = { S: 10, M: 20, L: 20, XL: 20, "2XL": 25, "3XL": 25 }

export default function HallOfFamePage() {
  const [shirt, setShirt] = useState({ id: 1, color: "Green", size: "L", quantity: 1 })
  const [cart, setCart] = useState([])
  const [nextId, setNextId] = useState(1)
  const [fulfillment, setFulfillment] = useState("Local Pickup")
  const [added, setAdded] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const previousTitle = document.title
    document.title = "Eunice Hall of Fame 2026 | Mitchell #7"
    let robots = document.querySelector('meta[name="robots"]')
    const created = !robots
    if (!robots) {
      robots = document.createElement("meta")
      robots.name = "robots"
      document.head.appendChild(robots)
    }
    const previousRobots = robots.content
    robots.content = "noindex, nofollow"
    return () => {
      document.title = previousTitle
      if (created) robots.remove()
      else robots.content = previousRobots
    }
  }, [])

  const selectedColor = colors.find((option) => option.name === shirt.color) ?? colors[1]
  const totalQuantity = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart])
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + prices[item.size] * item.quantity, 0), [cart])
  const shipping = fulfillment === "Local Pickup" || totalQuantity === 0 ? 0 : totalQuantity === 1 ? 7 : totalQuantity <= 3 ? 9 : totalQuantity <= 6 ? 12 : totalQuantity <= 10 ? 15 : null
  const total = subtotal + (shipping ?? 0)

  function updateShirt(changes) {
    setShirt((current) => ({ ...current, ...changes }))
    setAdded(false)
    setSubmitted(false)
  }

  function addToCart() {
    setCart((current) => [...current, { ...shirt, id: nextId }])
    setNextId((id) => id + 1)
    setShirt((current) => ({ ...current, color: "Green", size: "L", quantity: 1 }))
    setAdded(true)
    setSubmitted(false)
  }

  function reviewOrder(event) {
    event.preventDefault()
    if (cart.length === 0 || shipping === null) return
    setSubmitted(true)
    requestAnimationFrame(() => document.getElementById("hof-order-summary")?.scrollIntoView({ behavior: "smooth", block: "center" }))
  }

  return (
    <main className="min-h-screen bg-[#f8f7f2] font-sans text-[#111512]">
      <header className="flex h-[78px] items-center justify-between border-b border-white/15 bg-[#0b2e22] px-5 text-white md:px-[5vw]">
        <a className="flex items-center gap-3 text-white no-underline" href="#hof-top" aria-label="Eunice Hall of Fame home">
          <span className="grid size-11 place-items-center rounded-full border-2 border-[#d5a92f] text-2xl font-black">E</span>
          <span><strong className="block text-sm font-bold uppercase tracking-wider md:text-base">Eunice High School</strong><small className="mt-1 block text-[11px] opacity-70">Hall of Fame • Class of 2026</small></span>
        </a>
        <a className="border-b border-[#d5a92f] py-2 text-xs font-bold text-white no-underline" href="#hof-order">Order shirt ↓</a>
      </header>

      <section id="hof-top" className="grid min-h-[680px] items-center gap-12 overflow-hidden bg-[radial-gradient(circle_at_75%_45%,#1a5139_0,#0b2e22_39%,#071d16_75%)] px-5 py-14 text-white md:grid-cols-[.88fr_1.12fr] md:px-[5vw] md:py-[72px]">
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-[.18em] text-[#d5a92f]">Once a Bobcat, always a Bobcat.</p>
          <h1 className="mb-7 text-5xl font-black uppercase leading-[.95] tracking-tight sm:text-6xl lg:text-8xl">Honor the legacy.<br/><em className="not-italic text-[#d5a92f]">Wear the moment.</em></h1>
          <p className="max-w-xl text-base leading-7 text-[#dce4df] md:text-lg">Celebrate the Eunice High School 2026 Hall of Fame with the official Mitchell #7 commemorative tee.</p>
          <a className="mt-9 inline-flex min-h-13 items-center justify-center rounded-sm bg-[#d5a92f] px-6 font-extrabold text-[#10140f] no-underline shadow-xl hover:bg-[#e4bd4f]" href="#hof-order">Start your order</a>
        </div>
        <div className="relative min-w-0 max-md:order-first">
          <p className="relative z-10 mx-auto mb-6 max-w-xl border-l-4 border-[#d5a92f] bg-[#071d16]/85 px-5 py-4 text-sm leading-6 text-[#e9efe9] shadow-2xl">From earning <strong className="text-[#f0c752]">All-State - All District honors</strong>, to throwing for nearly <strong className="text-[#f0c752]">4,800 career yards</strong> and 42 passing TDs, Malcolm Mitchell left a lasting mark on Bobcat football.</p>
          <div className="absolute inset-[8%] rotate-[-12deg] rounded-[50%] border border-[#d5a92f]/40" aria-hidden="true" />
          <div className="relative z-10 mx-auto w-full max-w-[500px] border-8 border-[#f4efe3] shadow-2xl outline-2 outline-[#d5a92f]">
            <img className="aspect-[4/5] w-full object-cover" src={mitchellPhoto} alt="Historic photograph of Mitchell wearing number 7 on the football field" />
          </div>
        </div>
      </section>

      <section className="grid gap-6 bg-[#d5a92f] px-5 py-6 md:grid-cols-3 md:px-[5vw]" aria-label="Shirt details">
        {[['01','Bobcat front','Hall of Fame 2026 crest'],['02','Mitchell back','Name and iconic #7'],['03','Three colors','Black, green, or white']].map(([number,title,detail]) => <div className="grid grid-cols-[36px_1fr] border-b border-[#12251f]/20 pb-4 md:border-b-0 md:border-r md:pb-0" key={number}><span className="row-span-2 text-xl font-black opacity-50">{number}</span><strong className="text-sm uppercase tracking-wide">{title}</strong><small>{detail}</small></div>)}
      </section>

      <section id="hof-order" className="bg-gradient-to-br from-[#f8f7f2] to-[#eee9df] px-5 py-20 md:px-[6vw] md:py-24">
        <div className="mb-12 max-w-2xl"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-[#9b7400]">Reserve yours</p><h2 className="mb-4 text-4xl font-black uppercase leading-none md:text-6xl">Build your shirt order.</h2><p className="leading-7 text-[#667068]">Choose your color, size, and quantity. Payment will be connected after the store migration is complete.</p></div>
        <form className="grid max-w-[1180px] gap-8 lg:grid-cols-[1.3fr_.7fr]" onSubmit={reviewOrder}>
          <section className="border border-[#dcd8ce] bg-white p-5 shadow-xl md:p-10">
            <fieldset className="mb-10 border-0 border-b border-[#e4e0d7] p-0 pb-10">
              <legend className="mb-7 w-full text-2xl font-black uppercase"><span className="mr-3 inline-grid size-8 place-items-center rounded-full bg-[#0d3828] text-sm text-white">1</span>Choose your shirt</legend>
              <div className="border border-[#d8d4ca] bg-[#fcfbf7] p-4 md:p-6">
                <p className="mb-4 text-lg font-black uppercase text-[#0d3828]">Select your shirt</p>
                <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-[#555e57]">Color</p>
                <div className="mb-6 grid grid-cols-3 gap-2">{colors.map((option) => <button key={option.name} type="button" onClick={() => updateShirt({ color: option.name })} className={`flex min-h-12 items-center justify-center gap-2 border font-bold ${shirt.color === option.name ? 'border-2 border-[#0d3828] bg-[#edf4ef] text-[#0d3828]' : 'border-[#d6d5cf] bg-white'}`} aria-pressed={shirt.color === option.name}><span className="size-4 rounded-full border border-black/30" style={{background:option.swatch}} />{option.name}</button>)}</div>
                <div className="mb-7 bg-[#09261c] p-3"><p className="mb-2 text-[11px] uppercase tracking-widest text-[#d8e4dc]"><strong className="text-[#f0c752]">{shirt.color}</strong> • Front &amp; back</p><div className="hof-watermarked hof-shirt-watermark relative aspect-[1370/560] overflow-hidden bg-[#050706]"><img className={`absolute left-0 top-0 h-auto w-full max-w-none ${shirt.color === 'White' ? '-translate-y-1/2' : ''}`} src={selectedColor.image} alt={`${shirt.color} Hall of Fame shirt shown from the front and back`} /></div></div>
                <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-[#555e57]">Size</p>
                <div className="grid grid-cols-3 gap-2 md:grid-cols-6">{sizes.map((size) => <button key={size} type="button" onClick={() => updateShirt({ size })} className={`grid min-h-14 place-items-center border p-1 font-bold ${shirt.size === size ? 'border-2 border-[#0d3828] bg-[#edf4ef] text-[#0d3828]' : 'border-[#d6d5cf] bg-white'}`} aria-pressed={shirt.size === size}><span>{size}</span><small className="text-[10px] text-[#667068]">${prices[size]}</small></button>)}</div>
                <div className="mt-6 flex items-center justify-between font-bold"><span>Quantity</span><div className="flex items-center border border-[#d6d5cf]"><button className="size-11 bg-[#f4f2ec] text-xl" type="button" onClick={() => updateShirt({quantity:Math.max(1,shirt.quantity-1)})} aria-label="Decrease quantity">−</button><output className="w-11 text-center">{shirt.quantity}</output><button className="size-11 bg-[#f4f2ec] text-xl" type="button" onClick={() => updateShirt({quantity:Math.min(12,shirt.quantity+1)})} aria-label="Increase quantity">+</button></div></div>
              </div>
              <button className="mt-3 min-h-14 w-full rounded-sm bg-[#0d3828] font-extrabold text-white shadow-lg hover:bg-[#155039]" type="button" onClick={addToCart}>Add shirt to cart</button>
              {added && <p className="mt-3 border-l-4 border-[#d5a92f] bg-[#edf4ef] p-3 text-xs font-bold text-[#0d3828]" role="status">Added to cart. The shirt selector is ready for another order.</p>}
            </fieldset>
            <fieldset className="mb-10 border-0 border-b border-[#e4e0d7] p-0 pb-10"><legend className="mb-7 w-full text-2xl font-black uppercase"><span className="mr-3 inline-grid size-8 place-items-center rounded-full bg-[#0d3828] text-sm text-white">2</span>Your details</legend><div className="grid gap-4 md:grid-cols-2"><label className="text-[10px] font-extrabold uppercase tracking-widest text-[#555e57]">Full name<input className="mt-2 block min-h-12 w-full border border-[#d3d1ca] px-3 text-base normal-case tracking-normal" name="name" autoComplete="name" required /></label><label className="text-[10px] font-extrabold uppercase tracking-widest text-[#555e57]">Phone<input className="mt-2 block min-h-12 w-full border border-[#d3d1ca] px-3 text-base normal-case tracking-normal" name="phone" autoComplete="tel" type="tel" required /></label><label className="text-[10px] font-extrabold uppercase tracking-widest text-[#555e57] md:col-span-2">Email<input className="mt-2 block min-h-12 w-full border border-[#d3d1ca] px-3 text-base normal-case tracking-normal" name="email" autoComplete="email" type="email" required /></label></div></fieldset>
            <fieldset className="border-0 p-0"><legend className="mb-7 w-full text-2xl font-black uppercase"><span className="mr-3 inline-grid size-8 place-items-center rounded-full bg-[#0d3828] text-sm text-white">3</span>Fulfillment</legend><div className="grid gap-3 md:grid-cols-2">{["Local Pickup","Delivery"].map((option) => <label className={`relative grid cursor-pointer grid-cols-[32px_1fr] p-5 ${fulfillment === option ? 'border-2 border-[#0d3828] bg-[#edf4ef]' : 'border border-[#d5d2c9]'}`} key={option}><input className="absolute opacity-0" type="radio" name="fulfillment" value={option} checked={fulfillment===option} onChange={() => setFulfillment(option)} /><span className="row-span-2 text-xl">{option === 'Local Pickup' ? '⌂' : '◇'}</span><strong className="text-sm">{option}</strong><small className="text-[#667068]">{option === 'Local Pickup' ? 'Customer will be notified when and where to pick up items' : 'Shipping is calculated by the number of shirts'}</small></label>)}</div></fieldset>
          </section>

          <aside id="hof-order-summary" className="h-fit border border-[#dcd8ce] bg-white p-6 shadow-xl lg:sticky lg:top-5">
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-widest text-[#0d3828]">Your cart</p><h3 className="mb-5 text-2xl font-black uppercase">Hall of Fame 2026 Tees</h3>
            <div className="grid gap-3">{cart.length === 0 && <p className="bg-[#f4f2ec] p-4 text-xs leading-5 text-[#667068]">Your cart is empty. Choose your shirt, then add it to the cart.</p>}{cart.map((item,index) => <div className="grid grid-cols-[1fr_auto] gap-1 border-l-4 border-[#d5a92f] bg-[#f4f2ec] p-3 text-xs" key={item.id}><span className="text-[#667068]">Shirt {index+1}</span><strong className="text-[#0d3828]">{item.color} • {item.size}</strong><small>Quantity {item.quantity} × ${prices[item.size]} = ${prices[item.size]*item.quantity}</small><button className="text-right font-extrabold text-[#8b3c2b] underline" type="button" onClick={() => setCart((current) => current.filter((entry) => entry.id !== item.id))}>Remove</button></div>)}</div>
            <div className="my-5 grid gap-2 border-y border-[#e2dfd7] py-4 text-sm"><p className="flex justify-between"><span className="text-[#667068]">Total shirts</span><strong>{totalQuantity}</strong></p><p className="flex justify-between"><span className="text-[#667068]">Fulfillment</span><strong>{fulfillment}</strong></p><p className="flex justify-between"><span className="text-[#667068]">Merchandise subtotal</span><strong>${subtotal}</strong></p><p className="flex justify-between"><span className="text-[#667068]">Shipping</span><strong>{shipping === null ? 'Quote required' : shipping === 0 ? 'Free' : `$${shipping}`}</strong></p></div>
            <div className="mb-5 flex items-center justify-between gap-4"><span className="text-sm">Order total</span><strong className="text-right text-xl font-black uppercase text-[#9b6e00]">{shipping === null ? `$${subtotal} + shipping` : `$${total}`}</strong></div>
            {shipping === null && <p className="mb-4 bg-[#fff4d5] p-3 text-xs text-[#755500]">Delivery orders above 10 shirts require a shipping quote.</p>}
            <button className="min-h-13 w-full rounded-sm bg-[#d5a92f] px-6 font-extrabold text-[#10140f] disabled:cursor-not-allowed disabled:opacity-50" type="submit" disabled={cart.length===0 || shipping===null}>Review order →</button>
            <p className="mt-3 text-center text-[11px] text-[#667068]">No payment will be collected yet.</p>
            {submitted && <div className="mt-4 grid gap-1 border-l-4 border-[#0d3828] bg-[#edf4ef] p-4 text-xs leading-5" role="status"><strong className="text-[#0d3828]">Your selections are ready.</strong><span>Stripe Checkout can be connected after the deadline and Texas tax location are confirmed.</span></div>}
          </aside>
        </form>
      </section>
      <footer className="flex min-h-28 flex-col justify-center gap-2 bg-[#071d16] px-5 py-8 text-white md:flex-row md:items-center md:justify-between md:px-[5vw]"><strong className="text-2xl font-black text-[#d5a92f]">EUNICE BOBCATS</strong><span className="text-xs text-[#99aaa0]">Hall of Fame • 2026 • Mitchell #7</span></footer>
    </main>
  )
}
