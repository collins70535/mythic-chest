import { useEffect, useMemo, useState } from "react"

// Admin inventory page — served only behind the Cloudflare Access
// "Mythic Chest Admin" application on /admin. The inventory data itself is
// NOT bundled with the site: it is fetched from /admin/inventory.json, a
// static file under the same Access-protected path, so cost and margin data
// never ship in the public JS bundle.

const money = (value) =>
  value === null || value === undefined
    ? "—"
    : `$${Number(value).toFixed(2)}`

function priceCell(item) {
  if (item.retailPrice !== null && item.retailPrice !== undefined) {
    return <span className="text-zinc-100">{money(item.retailPrice)}</span>
  }
  if (item.priceStatus === "hold") {
    return <span className="text-zinc-500">Hold</span>
  }
  return (
    <span className="text-amber-300">
      Pending
      {item.proposedPrice ? (
        <span className="block text-xs text-zinc-500">
          proposed {money(item.proposedPrice)}
        </span>
      ) : null}
    </span>
  )
}

export default function AdminPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState("")
  const [query, setQuery] = useState("")
  const [vendor, setVendor] = useState("all")
  const [stockStatus, setStockStatus] = useState("all")

  useEffect(() => {
    let cancelled = false
    fetch("/admin/inventory.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        if (!cancelled) setData(json)
      })
      .catch((err) => {
        if (!cancelled) setError(`Could not load inventory data (${err.message}).`)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const items = useMemo(() => data?.items ?? [], [data])

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        if (vendor !== "all" && item.vendor !== vendor) return false
        if (stockStatus === "transit" && !item.status.startsWith("In transit")) return false
        if (stockStatus === "awaiting" && !item.status.startsWith("Awaiting payment")) return false
        if (
          query &&
          !`${item.item} ${item.category} ${item.order}`
            .toLowerCase()
            .includes(query.toLowerCase())
        )
          return false
        return true
      }),
    [items, vendor, stockStatus, query],
  )

  const pendingCount = items.filter((i) => i.priceStatus === "pending_decision").length
  const holdCount = items.filter((i) => i.priceStatus === "hold").length

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <main className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-amber-400">
          Mythic Chest — Owners Only
        </p>
        <h1 className="mb-2 text-4xl font-black">Inventory Admin</h1>
        <p className="mb-8 max-w-3xl text-zinc-400">
          Stock from billed wholesale orders. Cost and margin columns are
          visible only behind the Cloudflare Access login; this data is not
          part of the public site bundle.
        </p>

        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-5 text-red-200">
            {error}
          </div>
        )}

        {!data && !error && <p className="text-zinc-400">Loading inventory…</p>}

        {data && (
          <>
            <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
              {[
                ["Product lines", data.totals.lines],
                ["Units", data.totals.units],
                ["Landed cost", money(data.totals.landedCost)],
                ["Retail (priced lines)", money(data.totals.retailPricedLines)],
                ["Prices pending / on hold", `${pendingCount} / ${holdCount}`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
                  <p className="mt-1 text-2xl font-bold">{value}</p>
                </div>
              ))}
            </section>

            <section className="mb-6 flex flex-wrap gap-3">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
                className="w-64 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none focus:border-amber-400/60"
              />
              <select
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                aria-label="Filter by vendor"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm"
              >
                <option value="all">All vendors</option>
                <option value="AAA Anime">AAA Anime</option>
                <option value="BBCW">BBCW</option>
              </select>
              <select
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value)}
                aria-label="Filter by stock status"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm"
              >
                <option value="all">All statuses</option>
                <option value="transit">In transit</option>
                <option value="awaiting">Awaiting payment</option>
              </select>
              <p className="self-center text-sm text-zinc-500">
                Showing {filtered.length} of {items.length} lines
              </p>
            </section>

            <section className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="bg-white/5 text-xs uppercase tracking-wider text-zinc-400">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Vendor / Order</th>
                    <th className="px-4 py-3 text-right">Qty</th>
                    <th className="px-4 py-3 text-right">Unit cost</th>
                    <th className="px-4 py-3 text-right">Landed</th>
                    <th className="px-4 py-3 text-right">Retail</th>
                    <th className="px-4 py-3 text-right">Margin</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.item} className="border-t border-white/5 align-top">
                      <td className="px-4 py-3 font-medium text-zinc-100">{item.item}</td>
                      <td className="px-4 py-3 text-zinc-400">{item.category}</td>
                      <td className="px-4 py-3 text-zinc-400">
                        {item.vendor}
                        <span className="block text-xs text-zinc-500">{item.order}</span>
                      </td>
                      <td className="px-4 py-3 text-right">{item.qty}</td>
                      <td className="px-4 py-3 text-right text-zinc-400">{money(item.unitCost)}</td>
                      <td className="px-4 py-3 text-right text-zinc-400">{money(item.landedUnitCost)}</td>
                      <td className="px-4 py-3 text-right">{priceCell(item)}</td>
                      <td className="px-4 py-3 text-right text-zinc-400">
                        {item.marginAtRetailPct === null || item.marginAtRetailPct === undefined
                          ? "—"
                          : `${item.marginAtRetailPct}%`}
                      </td>
                      <td className="px-4 py-3 text-zinc-400">{item.status}</td>
                      <td className="max-w-xs px-4 py-3 text-xs leading-5 text-zinc-500">{item.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <p className="mt-6 text-xs leading-5 text-zinc-600">
              Retail prices follow the pricing lock: lines marked Pending are
              still awaiting a pricing decision and lines on Hold cannot be
              priced until the stock is received and verified. BBCW margins
              are before freight. AAA stock is in transit; BBCW stock has not
              shipped yet — nothing on this page is live store inventory.
            </p>
          </>
        )}
      </main>
    </div>
  )
}
