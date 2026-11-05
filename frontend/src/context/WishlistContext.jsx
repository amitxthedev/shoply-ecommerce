import { createContext, useContext, useState, useEffect, useCallback } from 'react'

/*
 * WishlistContext — global wishlist state with localStorage persistence.
 * Wishlist items: { slug, name, price, image, alt, category, availability }
 * Operations: addToWishlist, removeFromWishlist, clearWishlist, isInWishlist
 * Computed: wishlistCount
 */

const WishlistContext = createContext(null)

const WISHLIST_STORAGE_KEY = 'shoply_wishlist'

function loadWishlist() {
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // Ignore parse errors
  }
  return []
}

function saveWishlist(items) {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Ignore storage errors
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(loadWishlist)

  // Persist to localStorage on every change
  useEffect(() => {
    saveWishlist(items)
  }, [items])

  const addToWishlist = useCallback((product) => {
    setItems((prev) => {
      // Prevent duplicates
      if (prev.some((item) => item.slug === product.slug)) {
        return prev
      }
      return [
        ...prev,
        {
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
          alt: product.alt,
          category: product.category,
          availability: product.availability,
        },
      ]
    })
  }, [])

  const removeFromWishlist = useCallback((slug) => {
    setItems((prev) => prev.filter((item) => item.slug !== slug))
  }, [])

  const clearWishlist = useCallback(() => {
    setItems([])
  }, [])

  const isInWishlist = useCallback(
    (slug) => items.some((item) => item.slug === slug),
    [items]
  )

  const wishlistCount = items.length

  const value = {
    items,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    wishlistCount,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
