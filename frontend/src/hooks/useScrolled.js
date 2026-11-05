import { useEffect, useState } from 'react'

/**
 * True once the page is scrolled past `threshold` px.
 * Drives the sticky header: 72px at rest → 60px + hairline border (UI spec §11.2).
 */
export function useScrolled(threshold = 80) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}
