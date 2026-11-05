/*
 * Navigation content — structure per docs/UI_UX_DESIGN_SPEC.md §11 (header)
 * and §12 (footer). Category names come from the approved catalog structure
 * (PROJECT_PLANNING §2.4, USER_FLOWS §9 route inventory). Links resolve to the
 * router's catch-all until the corresponding pages are built.
 */

export const mainNav = [
  { label: 'Home', to: '/' },
  { label: 'Outerwear', to: '/category/outerwear' },
  { label: 'Tops', to: '/category/tops' },
  { label: 'Bottoms', to: '/category/bottoms' },
  { label: 'Accessories', to: '/category/accessories' },
  { label: 'Footwear', to: '/category/footwear' },
  { label: 'Support', to: '/support' },
]

export const categoryNav = mainNav.filter((item) => item.to.startsWith('/category/'))

export const footerColumns = [
  {
    title: 'Shop',
    links: [
      ...categoryNav,
      { label: 'New Arrivals', to: '/products?sort=newest' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Support', to: '/support' },
      { label: 'Shipping policy', to: '/shipping-policy' },
      { label: 'Returns policy', to: '/returns-policy' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', to: '/privacy' },
      { label: 'Terms', to: '/terms' },
    ],
  },
]
