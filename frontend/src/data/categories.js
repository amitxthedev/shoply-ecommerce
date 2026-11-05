/*
 * Demo category data — the approved single-level category structure
 * (DEC-15a, PROJECT_PLANNING §2.4). Counts are realistic placeholders.
 * No subcategory lists on cards (UI spec C6 / DS-DEC-09): count chip +
 * arrow carry the affordance instead.
 * Images are placehold.co URLs for testing only.
 */

export const categories = [
  { name: 'Outerwear', slug: 'outerwear', count: 128, image: 'https://placehold.co/600x600/png?text=Outerwear' },
  { name: 'Tops', slug: 'tops', count: 214, image: 'https://placehold.co/600x600/png?text=Tops' },
  { name: 'Bottoms', slug: 'bottoms', count: 96, image: 'https://placehold.co/600x600/png?text=Bottoms' },
  { name: 'Accessories', slug: 'accessories', count: 72, image: 'https://placehold.co/600x600/png?text=Accessories' },
  { name: 'Footwear', slug: 'footwear', count: 54, image: 'https://placehold.co/600x600/png?text=Footwear' },
]
