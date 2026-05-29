import { useCallback, useEffect, useMemo, useState } from "react"
import { CartContext } from "./cart-context"

function getStoredCart() {
  try {
    return JSON.parse(localStorage.getItem("mythic-chest-cart")) ?? []
  } catch {
    return []
  }
}

function getPriceValue(price) {
  return Number(price.replace(/[^0-9.]/g, ""))
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(getStoredCart)
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem("mythic-chest-cart", JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id)

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [
        ...currentItems,
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ]
    })

    setIsCartOpen(true)
  }, [])

  const removeItem = useCallback((productId) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId),
    )
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    setItems((currentItems) =>
      currentItems
        .map((item) => (item.id === productId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0),
    )
  }, [])

  const cartCount = items.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = items.reduce(
    (total, item) => total + getPriceValue(item.price) * item.quantity,
    0,
  )

  const value = useMemo(
    () => ({
      addItem,
      cartCount,
      cartTotal,
      closeCart: () => setIsCartOpen(false),
      isCartOpen,
      items,
      openCart: () => setIsCartOpen(true),
      removeItem,
      updateQuantity,
    }),
    [addItem, cartCount, cartTotal, isCartOpen, items, removeItem, updateQuantity],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
