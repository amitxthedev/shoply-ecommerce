import { createContext, useContext, useState, useEffect, useCallback } from 'react'

/*
 * CartContext — global cart state with localStorage persistence.
 * Cart items: { slug, name, price, image, color, size, quantity }
 * Operations: addToCart, removeFromCart, updateQuantity, clearCart
 * Computed: cartCount, subtotal, shipping, total
 */

const CartContext = createContext(null)

const CART_STORAGE_KEY = 'shoply_cart'

function loadCart() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // Ignore parse errors
  }
  return []
}

function saveCart(items) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Ignore storage errors
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)

  // Persist to localStorage on every change
  useEffect(() => {
    saveCart(items)
  }, [items])

  const addToCart = useCallback((product, quantity = 1, color = null, size = null) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.slug === product.slug &&
          item.color === color &&
          item.size === size
      )

      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(updated[existingIndex].quantity + quantity, 10),
        }
        return updated
      }

      return [
        ...prev,
        {
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
          alt: product.alt,
          color,
          size,
          quantity: Math.min(quantity, 10),
        },
      ]
    })
  }, [])

  const removeFromCart = useCallback((slug, color = null, size = null) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(item.slug === slug && item.color === color && item.size === size)
      )
    )
  }, [])

  const updateQuantity = useCallback((slug, color = null, size = null, quantity) => {
    const qty = Math.max(1, Math.min(quantity, 10))
    setItems((prev) =>
      prev.map((item) =>
        item.slug === slug && item.color === color && item.size === size
          ? { ...item, quantity: qty }
          : item
      )
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const FREE_SHIPPING_THRESHOLD = 180
  const SHIPPING_COST = 5.95

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : SHIPPING_COST

  const total = subtotal + shipping

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    subtotal,
    shipping,
    total,
    FREE_SHIPPING_THRESHOLD,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
