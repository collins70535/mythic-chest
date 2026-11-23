import { useEffect, useMemo, useState } from "react"

// Admin inventory page — served only behind the Cloudflare Access
// "Mythic Chest Admin" application on /admin. The inventory data itself is
// NOT bundled with the site: it is fetched from /admin/inventory.json, a
// static file under the same Access-protected path, so cost and margin data
// never ship in the public JS bundle.
//
// Editing (added 2026-11-23 at Brenton's request): rows can be edited
// in-page. Saving commits the updated inventory.json back to the
// collins70535/mythic-chest GitHub repo via the GitHub API, using a
// fine-grained personal access token that the owner pastes once and that
// is stored ONLY in this browser's localStorage (never in site code).
// Cloudflare Pages redeploys from that commit, so a save goes live in
// ~1-2 minutes. Every save is a git commit and can be rolled back.

const GH_OWNER = "collins70535"
const GH_REPO = "mythic-chest"
const GH_BRANCH = "main"
const GH_PATH = "public/admin/inventory.json"
const TOKEN_KEY = "mc_admin_gh_token"

const money = (value) =>
  value === null || value === undefined
    ? "—"
    : `$${Number(value).toFixed(2)}`

const round2 = (n) => Math.round(n * 100) / 100

function computeMargin(retailPrice, landedUnitCost) {
  if (
    retailPrice === null ||
    retailPrice === undefined ||
    landedUnitCost === null ||
    landedUnitCost === undefined ||
    Number(retailPrice) <= 0
  )
    return null
  return Math.round(((retailPrice - landedUnitCost) / retailPrice) * 1000) / 10
}

function computeTotals(items) {
  return {
    lines: items.length,
    units: items.reduce((sum, i) => sum + (Number(i.qty) || 0), 0),
    landedCost: round2(
      items.reduce(
        (sum, i) => sum + (Number(i.landedUnitCost) || 0) * (Number(i.qty) || 0),
        0,
      ),
    ),
    retailPricedLines: round2(
      items.reduce(
        (sum, i) =>
          i.retailPrice === null || i.retailPrice === undefined
            ? sum
            : sum + Number(i.retailPrice) * (Number(i.qty) || 0),
        0,
      ),
    ),
  }
}

function toBase64Utf8(text) {
  const bytes = new TextEncoder().encode(text)
  let binary = ""
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}

const PRICE_STATUSES = [
  ["locked_msrp", "Locked (MSRP)"],
  ["locked_custom", "Locked (custom)"],
  ["pending_decision", "Pending decision"],
  ["hold", "Hold"],
]

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

const inputCls =
  "w-full rounded-lg border border-white/15 bg-zinc-900 px-2 py-1 text-sm text-zinc-100 outline-none focus:border-amber-400/60"
const btnCls =
  "rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:border-amber-400/60 hover:text-white"
const btnPrimaryCls =
  "rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-amber-300 disabled:opacity-50"

export default function AdminPage() {
  const [data, setData] = useState(null)
  const [original, setOriginal] = useState(null)
  const [error, setError] = useState("")
  const [query, setQuery] = useState("")
  const [vendor, setVendor] = useState("all")
  const [stockStatus, setStockStatus] = useState("all")
  const [editingIndex, setEditingIndex] = useState(null)
  const [draft, setDraft] = useState(null)
  const [editError, setEditError] = useState("")
  const [dirty, setDirty] = useState(false)
  const [hasToken, setHasToken] = useState(
    () => !!window.localStorage.getItem(TOKEN_KEY),
  )
  const [showTokenPanel, setShowTokenPanel] = useState(false)
  const [tokenInput, setTokenInput] = useState("")
  const [saveState, setSaveState] = useState({ status: "idle", message: "" })

  useEffect(() => {
    let cancelled = false
    fetch("/admin/inventory.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        if (!cancelled) {
          setData(json)
          setOriginal(json)
        }
      })
      .catch((err) => {
        if (!cancelled) setError(`Could not load inventory data (${err.message}).`)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const items = useMemo(() => data?.items ?? [], [data])

  const entries = useMemo(
    () =>
      items
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => {
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

  const vendors = useMemo(
    () => [...new Set(items.map((i) => i.vendor).filter(Boolean))],
    [items],
  )

  function draftFrom(item) {
    return {
      item: item.item ?? "",
      category: item.category ?? "",
      vendor: item.vendor ?? "",
      order: item.order ?? "",
      qty: String(item.qty ?? ""),
      unitCost: item.unitCost === null || item.unitCost === undefined ? "" : String(item.unitCost),
      landedUnitCost:
        item.landedUnitCost === null || item.landedUnitCost === undefined
          ? ""
          : String(item.landedUnitCost),
      retailPrice:
        item.retailPrice === null || item.retailPrice === undefined ? "" : String(item.retailPrice),
      proposedPrice:
        item.proposedPrice === null || item.proposedPrice === undefined
          ? ""
          : String(item.proposedPrice),
      priceStatus: item.priceStatus ?? "pending_decision",
      status: item.status ?? "",
      notes: item.notes ?? "",
    }
  }

  function startEdit(index) {
    setDraft(draftFrom(items[index]))
    setEditError("")
    setEditingIndex(index)
  }

  function parseOptionalNumber(raw, label) {
    if (raw.trim() === "") return null
    const n = Number(raw)
    if (!Number.isFinite(n) || n < 0) throw new Error(`${label} must be a number, 0 or more.`)
    return n
  }

  function applyEdit() {
    try {
      if (!draft.item.trim()) throw new Error("Product name can't be empty.")
      const qty = Number(draft.qty)
      if (!Number.isInteger(qty) || qty < 0)
        throw new Error("Qty must be a whole number, 0 or more.")
      const unitCost = parseOptionalNumber(draft.unitCost, "Unit cost")
      const landedUnitCost = parseOptionalNumber(draft.landedUnitCost, "Landed cost")
      const retailPrice = parseOptionalNumber(draft.retailPrice, "Retail price")
      const proposedPrice = parseOptionalNumber(draft.proposedPrice, "Proposed price")
      const updated = {
        item: draft.item.trim(),
        category: draft.category.trim(),
        vendor: draft.vendor.trim(),
        order: draft.order.trim(),
        qty,
        unitCost,
        landedUnitCost,
        retailPrice,
        proposedPrice,
        priceStatus: draft.priceStatus,
        marginAtRetailPct: computeMargin(retailPrice, landedUnitCost),
        status: draft.status.trim(),
        notes: draft.notes,
      }
      const nextItems = items.map((it, i) => (i === editingIndex ? updated : it))
      setData({ ...data, items: nextItems, totals: computeTotals(nextItems) })
      setEditingIndex(null)
      setDraft(null)
      setDirty(true)
      setSaveState({ status: "idle", message: "" })
    } catch (err) {
      setEditError(err.message)
    }
  }

  function addItem() {
    const blank = {
      item: "",
      category: "",
      vendor: "",
      order: "",
      qty: 0,
      unitCost: null,
      landedUnitCost: null,
      retailPrice: null,
      proposedPrice: null,
      priceStatus: "pending_decision",
      marginAtRetailPct: null,
      status: "",
      notes: "",
    }
    const nextItems = [...items, blank]
    setData({ ...data, items: nextItems, totals: computeTotals(nextItems) })
    setQuery("")
    setVendor("all")
    setStockStatus("all")
    setDraft(draftFrom(blank))
    setEditError("")
    setEditingIndex(nextItems.length - 1)
  }

  function deleteItem(index) {
    if (!window.confirm(`Delete "${items[index].item || "this line"}"? This takes effect when you save to GitHub.`))
      return
    const nextItems = items.filter((_, i) => i !== index)
    setData({ ...data, items: nextItems, totals: computeTotals(nextItems) })
    setEditingIndex(null)
    setDraft(null)
    setDirty(true)
  }

  function discardChanges() {
    setData(original)
    setEditingIndex(null)
    setDraft(null)
    setDirty(false)
    setSaveState({ status: "idle", message: "" })
  }

  function saveToken() {
    const token = tokenInput.trim()
    if (!token) return
    window.localStorage.setItem(TOKEN_KEY, token)
    setHasToken(true)
    setTokenInput("")
    setShowTokenPanel(false)
    setSaveState({ status: "idle", message: "GitHub connected in this browser. You can save now." })
  }

  function clearToken() {
    window.localStorage.removeItem(TOKEN_KEY)
    setHasToken(false)
  }

  async function saveToGitHub() {
    const token = window.localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setShowTokenPanel(true)
      setSaveState({
        status: "error",
        message: "Paste your GitHub token first — saving needs it. The panel is open below.",
      })
      return
    }
    setSaveState({ status: "saving", message: "Saving to GitHub…" })
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    }
    const url = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_PATH}`
    try {
      const getRes = await fetch(`${url}?ref=${GH_BRANCH}`, { headers })
      if (getRes.status === 401 || getRes.status === 403)
        throw new Error(
          "GitHub rejected the token. Make sure it's a fine-grained token for the mythic-chest repo with Contents set to Read and write, then reconnect it below.",
        )
      if (!getRes.ok) throw new Error(`GitHub read failed (HTTP ${getRes.status}).`)
      const { sha } = await getRes.json()

      const payload = { ...data, totals: computeTotals(items) }
      const content = toBase64Utf8(JSON.stringify(payload, null, 2) + "\n")
      const putRes = await fetch(url, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Inventory update from mythic-chest.com/admin editor",
          content,
          sha,
          branch: GH_BRANCH,
        }),
      })
      if (putRes.status === 409 || putRes.status === 422)
        throw new Error(
          "The inventory file changed on GitHub since this page loaded, so your save was stopped to avoid overwriting it. Reload the page, redo the edit, and save again.",
        )
      if (!putRes.ok) throw new Error(`GitHub save failed (HTTP ${putRes.status}).`)
      const result = await putRes.json()
      setOriginal(payload)
      setData(payload)
      setDirty(false)
      setSaveState({
        status: "saved",
        message: `Saved to GitHub (commit ${result.commit.sha.slice(0, 7)}). Cloudflare Pages redeploys automatically — the live page updates in about 1–2 minutes.`,
      })
    } catch (err) {
      setSaveState({ status: "error", message: err.message })
    }
  }

  const draftField = (key, props = {}) => (
    <input
      value={draft[key]}
      onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
      className={inputCls}
      {...props}
    />
  )

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
          part of the public site bundle. You can edit any line here — edits
          are saved to GitHub and go live when Cloudflare Pages redeploys
          (about 1–2 minutes after saving).
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

            <section className="mb-6 flex flex-wrap items-center gap-3">
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
                {vendors.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
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
                Showing {entries.length} of {items.length} lines
              </p>
              <button type="button" onClick={addItem} className={btnPrimaryCls}>
                + Add product
              </button>
              {hasToken ? (
                <span className="flex items-center gap-2 text-sm text-zinc-400">
                  <span className="text-emerald-400">●</span> GitHub saving connected
                  <button type="button" onClick={clearToken} className={btnCls}>
                    Disconnect
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowTokenPanel(!showTokenPanel)}
                  className={btnCls}
                >
                  Connect GitHub to save edits
                </button>
              )}
            </section>

            {showTokenPanel && !hasToken && (
              <section className="mb-6 rounded-2xl border border-amber-400/30 bg-amber-400/5 p-5">
                <h2 className="mb-2 font-bold">Connect GitHub (one time, per browser)</h2>
                <ol className="mb-4 list-decimal space-y-1 pl-5 text-sm leading-6 text-zinc-300">
                  <li>
                    On GitHub: Settings → Developer settings → Personal access
                    tokens → Fine-grained tokens → Generate new token.
                  </li>
                  <li>
                    Repository access: Only select repositories →{" "}
                    <span className="text-zinc-100">collins70535/mythic-chest</span>.
                  </li>
                  <li>
                    Repository permissions → Contents →{" "}
                    <span className="text-zinc-100">Read and write</span>. Leave
                    everything else alone.
                  </li>
                  <li>Generate it, copy it, and paste it here.</li>
                </ol>
                <div className="flex flex-wrap gap-3">
                  <input
                    type="password"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="github_pat_…"
                    aria-label="GitHub fine-grained token"
                    className="w-80 rounded-xl border border-white/15 bg-zinc-900 px-4 py-2 text-sm outline-none focus:border-amber-400/60"
                  />
                  <button type="button" onClick={saveToken} className={btnPrimaryCls}>
                    Save token in this browser
                  </button>
                </div>
                <p className="mt-3 text-xs leading-5 text-zinc-500">
                  The token is stored only in this browser's local storage,
                  behind your Cloudflare Access login. It is never part of the
                  site code. Use Disconnect to remove it.
                </p>
              </section>
            )}

            {dirty && (
              <section className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4">
                <p className="text-sm text-amber-200">
                  You have unsaved changes — they are <strong>not live</strong>{" "}
                  until you save to GitHub.
                </p>
                <button
                  type="button"
                  onClick={saveToGitHub}
                  disabled={saveState.status === "saving"}
                  className={btnPrimaryCls}
                >
                  {saveState.status === "saving" ? "Saving…" : "Save to GitHub"}
                </button>
                <button type="button" onClick={discardChanges} className={btnCls}>
                  Discard changes
                </button>
              </section>
            )}

            {saveState.message && (
              <p
                className={`mb-6 rounded-xl border p-4 text-sm ${
                  saveState.status === "error"
                    ? "border-red-500/40 bg-red-500/10 text-red-200"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                }`}
              >
                {saveState.message}
              </p>
            )}

            <section className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full min-w-[1200px] text-left text-sm">
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
                    <th className="px-4 py-3">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map(({ item, index }) =>
                    editingIndex === index && draft ? (
                      <tr key={`edit-${index}`} className="border-t border-amber-400/30 bg-amber-400/5 align-top">
                        <td className="min-w-48 px-4 py-3">{draftField("item", { "aria-label": "Product name" })}</td>
                        <td className="min-w-32 px-4 py-3">{draftField("category", { "aria-label": "Category" })}</td>
                        <td className="min-w-36 px-4 py-3">
                          {draftField("vendor", { "aria-label": "Vendor" })}
                          <div className="mt-2">{draftField("order", { "aria-label": "Order" })}</div>
                        </td>
                        <td className="w-20 px-4 py-3">{draftField("qty", { type: "number", min: "0", step: "1", "aria-label": "Quantity" })}</td>
                        <td className="w-24 px-4 py-3">{draftField("unitCost", { type: "number", min: "0", step: "0.01", "aria-label": "Unit cost" })}</td>
                        <td className="w-24 px-4 py-3">{draftField("landedUnitCost", { type: "number", min: "0", step: "0.01", "aria-label": "Landed unit cost" })}</td>
                        <td className="min-w-32 px-4 py-3">
                          {draftField("retailPrice", { type: "number", min: "0", step: "0.01", placeholder: "Retail — blank = unpriced", "aria-label": "Retail price" })}
                          <div className="mt-2">{draftField("proposedPrice", { type: "number", min: "0", step: "0.01", placeholder: "Proposed", "aria-label": "Proposed price" })}</div>
                          <select
                            value={draft.priceStatus}
                            onChange={(e) => setDraft({ ...draft, priceStatus: e.target.value })}
                            aria-label="Price status"
                            className={`${inputCls} mt-2`}
                          >
                            {PRICE_STATUSES.map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right text-zinc-500">auto</td>
                        <td className="min-w-40 px-4 py-3">{draftField("status", { "aria-label": "Stock status" })}</td>
                        <td className="min-w-48 px-4 py-3">
                          <textarea
                            value={draft.notes}
                            onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                            aria-label="Notes"
                            rows={3}
                            className={inputCls}
                          />
                        </td>
                        <td className="min-w-32 px-4 py-3">
                          <div className="flex flex-col gap-2">
                            <button type="button" onClick={applyEdit} className={btnPrimaryCls}>
                              Done
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingIndex(null)
                                setDraft(null)
                                setEditError("")
                              }}
                              className={btnCls}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteItem(index)}
                              className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-200 hover:border-red-400"
                            >
                              Delete line
                            </button>
                          </div>
                          {editError && (
                            <p className="mt-2 text-xs leading-5 text-red-300">{editError}</p>
                          )}
                        </td>
                      </tr>
                    ) : (
                      <tr key={`${item.item}-${index}`} className="border-t border-white/5 align-top">
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
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => startEdit(index)}
                            disabled={editingIndex !== null}
                            className={`${btnCls} disabled:opacity-40`}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </section>

            <p className="mt-6 text-xs leading-5 text-zinc-600">
              Saving here commits the inventory file to GitHub and
              Cloudflare Pages redeploys it — the change is a normal git
              commit and can be rolled back. BBCW margins are before freight.
              This page is not live store inventory, and saving here does NOT
              update the Mythic Chest Inventory Space in Muse — flag price
              changes so they can be mirrored there.
            </p>
          </>
        )}
      </main>
    </div>
  )
}
