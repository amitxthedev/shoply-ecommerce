/*
 * Demo catalog — realistic temporary product data for the homepage
 * (frontend-only step: no API, no backend). Shape mirrors the product
 * payload in docs/API_DOCUMENTATION.md so a later fetch swaps in 1:1.
 * Categories come from the approved 5-category structure (DEC-15a).
 * Images are placehold.co URLs for testing only — replaced by real
 * photography before launch (UI spec rule: no empty plates in production).
 */

const ALL_PRODUCTS = [
  /* Outerwear */
  { slug: 'wool-overcoat', name: 'Wool Overcoat — Charcoal', category: 'Outerwear', price: 189, compareAtPrice: 240, alt: 'Charcoal wool overcoat on a hanger', image: 'https://placehold.co/800x800/png?text=Wool+Overcoat+Charcoal' },
  { slug: 'quilted-field-jacket', name: 'Quilted Field Jacket — Olive', category: 'Outerwear', price: 165, alt: 'Olive quilted field jacket', image: 'https://placehold.co/800x800/png?text=Quilted+Field+Jacket+Olive' },
  { slug: 'canvas-chore-jacket', name: 'Canvas Chore Jacket — Sand', category: 'Outerwear', price: 128, compareAtPrice: 150, alt: 'Sand-coloured canvas chore jacket', image: 'https://placehold.co/800x800/png?text=Canvas+Chore+Jacket+Sand' },
  { slug: 'packable-anorak', name: 'Packable Anorak — Navy', category: 'Outerwear', price: 142, compareAtPrice: 175, alt: 'Navy packable anorak', image: 'https://placehold.co/800x800/png?text=Packable+Anorak+Navy' },

  /* Tops */
  { slug: 'oxford-shirt', name: 'Oxford Shirt — White', category: 'Tops', price: 78, alt: 'White oxford shirt folded', availability: 'SOLD_OUT', image: 'https://placehold.co/800x800/png?text=Oxford+Shirt+White' },
  { slug: 'merino-crewneck', name: 'Merino Crewneck — Forest', category: 'Tops', price: 96, alt: 'Forest green merino crewneck', image: 'https://placehold.co/800x800/png?text=Merino+Crewneck+Forest' },
  { slug: 'heavyweight-tee', name: 'Heavyweight Tee — Off White', category: 'Tops', price: 42, compareAtPrice: 55, alt: 'Off-white heavyweight cotton tee', image: 'https://placehold.co/800x800/png?text=Heavyweight+Tee+Off+White' },
  { slug: 'linen-camp-shirt', name: 'Linen Camp Shirt — Sky', category: 'Tops', price: 88, alt: 'Sky blue linen camp shirt', image: 'https://placehold.co/800x800/png?text=Linen+Camp+Shirt+Sky' },
  { slug: 'rollneck-knit', name: 'Rollneck Knit — Charcoal', category: 'Tops', price: 118, compareAtPrice: 145, alt: 'Charcoal rollneck knit sweater', image: 'https://placehold.co/800x800/png?text=Rollneck+Knit+Charcoal' },

  /* Bottoms */
  { slug: 'selvedge-denim', name: 'Selvedge Denim — Indigo', category: 'Bottoms', price: 148, alt: 'Indigo selvedge denim jeans', image: 'https://placehold.co/800x800/png?text=Selvedge+Denim+Indigo' },
  { slug: 'pleated-trouser', name: 'Pleated Trouser — Stone', category: 'Bottoms', price: 132, compareAtPrice: 160, alt: 'Stone pleated trousers', image: 'https://placehold.co/800x800/png?text=Pleated+Trouser+Stone' },
  { slug: 'straight-chino', name: 'Straight Chino — Khaki', category: 'Bottoms', price: 98, alt: 'Khaki straight-fit chinos', image: 'https://placehold.co/800x800/png?text=Straight+Chino+Khaki' },
  { slug: 'loopback-sweatpant', name: 'Loopback Sweatpant — Grey', category: 'Bottoms', price: 84, compareAtPrice: 105, alt: 'Grey loopback sweatpants', availability: 'SOLD_OUT', image: 'https://placehold.co/800x800/png?text=Loopback+Sweatpant+Grey' },

  /* Accessories */
  { slug: 'full-grain-belt', name: 'Full-grain Leather Belt — Black', category: 'Accessories', price: 64, alt: 'Black full-grain leather belt', image: 'https://placehold.co/800x800/png?text=Leather+Belt+Black' },
  { slug: 'merino-watch-cap', name: 'Merino Watch Cap — Mustard', category: 'Accessories', price: 38, alt: 'Mustard merino watch cap', image: 'https://placehold.co/800x800/png?text=Merino+Watch+Cap+Mustard' },
  { slug: 'canvas-tote', name: 'Canvas Tote — Natural', category: 'Accessories', price: 52, compareAtPrice: 65, alt: 'Natural canvas tote bag', image: 'https://placehold.co/800x800/png?text=Canvas+Tote+Natural' },
  { slug: 'ribbed-wool-scarf', name: 'Ribbed Wool Scarf — Camel', category: 'Accessories', price: 48, alt: 'Camel ribbed wool scarf', image: 'https://placehold.co/800x800/png?text=Wool+Scarf+Camel' },

  /* Footwear */
  { slug: 'court-sneaker', name: 'Court Sneaker — White', category: 'Footwear', price: 118, compareAtPrice: 145, alt: 'White leather court sneakers', image: 'https://placehold.co/800x800/png?text=Court+Sneaker+White' },
  { slug: 'service-boot', name: 'Service Boot — Brown', category: 'Footwear', price: 224, alt: 'Brown leather service boots', image: 'https://placehold.co/800x800/png?text=Service+Boot+Brown' },
  { slug: 'suede-derby', name: 'Suede Derby — Taupe', category: 'Footwear', price: 178, alt: 'Taupe suede derby shoes', availability: 'SOLD_OUT', image: 'https://placehold.co/800x800/png?text=Suede+Derby+Taupe' },
]

// PDP detail data — merged into products below
const PRODUCT_DETAILS = {
  'wool-overcoat': { description: 'Cut from dense, traceable wool with a full canvas interlining. Two welt pockets, single vent, horn buttons.', materials: '100% traceable wool, 45% recycled wool', colors: ['Charcoal', 'Navy', 'Camel'], sizes: ['S', 'M', 'L', 'XL'], stock: 12, specs: [{ label: 'Fit', value: 'Regular — true to size' }, { label: 'Length', value: 'Mid-thigh (74 cm)' }, { label: 'Material', value: '100% traceable wool' }, { label: 'Care', value: 'Dry clean only' }, { label: 'Origin', value: 'Portugal' }] },
  'quilted-field-jacket': { description: 'A lightweight quilted jacket built for transitional weather. Recycled polyester fill, water-resistant shell, and a drawcord hem. Packs into its own pocket.', materials: '100% recycled polyester, 80% recycled fill', colors: ['Olive', 'Black', 'Navy'], sizes: ['S', 'M', 'L', 'XL'], stock: 8, specs: [{ label: 'Fit', value: 'Regular — true to size' }, { label: 'Material', value: '100% recycled polyester' }, { label: 'Care', value: 'Machine wash cold' }, { label: 'Origin', value: 'Vietnam' }] },
  'canvas-chore-jacket': { description: 'A sturdy canvas chore jacket with triple-stitched seams and copper rivets. The cut is boxy and relaxed, designed to layer over a knit or a shirt.', materials: '100% organic cotton canvas', colors: ['Sand', 'Indigo', 'Black'], sizes: ['S', 'M', 'L', 'XL'], stock: 15, specs: [{ label: 'Fit', value: 'Relaxed — size down for slim fit' }, { label: 'Material', value: '100% organic cotton canvas' }, { label: 'Weight', value: '12 oz' }, { label: 'Care', value: 'Machine wash cold' }, { label: 'Origin', value: 'Portugal' }] },
  'packable-anorak': { description: 'A packable anorak with a DWR finish and taped seams. Folds into a small stuff sack. Half-zip placket, adjustable hood, and elastic cuffs.', materials: '100% recycled nylon', colors: ['Navy', 'Black', 'Olive'], sizes: ['S', 'M', 'L', 'XL'], stock: 20, specs: [{ label: 'Fit', value: 'Regular — true to size' }, { label: 'Material', value: '100% recycled nylon' }, { label: 'Weight', value: '280 g' }, { label: 'Care', value: 'Machine wash cold' }, { label: 'Origin', value: 'Vietnam' }] },
  'oxford-shirt': { description: 'A classic Oxford shirt in heavyweight Oxford cloth. Button-down collar, single chest pocket, box pleat at the back. The fabric softens with every wash.', materials: '100% organic cotton Oxford cloth', colors: ['White', 'Blue', 'Pink'], sizes: ['S', 'M', 'L', 'XL'], stock: 0, specs: [{ label: 'Fit', value: 'Regular — true to size' }, { label: 'Material', value: '100% organic cotton' }, { label: 'Weight', value: '180 gsm' }, { label: 'Care', value: 'Machine wash cold' }, { label: 'Origin', value: 'Portugal' }] },
  'merino-crewneck': { description: 'A mid-weight merino crewneck knit from fine gauge merino wool. Ribbed collar, cuffs, and hem. The fabric is naturally temperature-regulating.', materials: '100% extra-fine merino wool', colors: ['Forest', 'Charcoal', 'Cream'], sizes: ['S', 'M', 'L', 'XL'], stock: 18, specs: [{ label: 'Fit', value: 'Regular — true to size' }, { label: 'Material', value: '100% extra-fine merino' }, { label: 'Care', value: 'Hand wash cold' }, { label: 'Origin', value: 'Italy' }] },
  'heavyweight-tee': { description: 'A heavyweight cotton tee with a dense, structured hand. Ribbed collar, double-stitched hem. The fabric holds its shape through repeated washes.', materials: '100% organic cotton, 220 gsm', colors: ['Off White', 'Black', 'Navy'], sizes: ['S', 'M', 'L', 'XL'], stock: 30, specs: [{ label: 'Fit', value: 'Regular — true to size' }, { label: 'Material', value: '100% organic cotton' }, { label: 'Weight', value: '220 gsm' }, { label: 'Care', value: 'Machine wash cold' }, { label: 'Origin', value: 'Portugal' }] },
  'linen-camp-shirt': { description: 'A relaxed linen camp shirt with a boxy cut and single chest pocket. The fabric is pre-washed for softness. Wear open over a tee or buttoned up.', materials: '100% European linen', colors: ['Sky', 'White', 'Sage'], sizes: ['S', 'M', 'L', 'XL'], stock: 14, specs: [{ label: 'Fit', value: 'Relaxed — size down for slim fit' }, { label: 'Material', value: '100% European linen' }, { label: 'Weight', value: '160 gsm' }, { label: 'Care', value: 'Machine wash cold' }, { label: 'Origin', value: 'Portugal' }] },
  'rollneck-knit': { description: 'A rollneck knit in a mid-gauge merino blend. The collar is tall enough to fold over. Ribbed cuffs and hem. A cold-weather staple.', materials: '70% merino wool, 30% nylon', colors: ['Charcoal', 'Cream', 'Navy'], sizes: ['S', 'M', 'L', 'XL'], stock: 10, specs: [{ label: 'Fit', value: 'Regular — true to size' }, { label: 'Material', value: '70% merino, 30% nylon' }, { label: 'Care', value: 'Hand wash cold' }, { label: 'Origin', value: 'Italy' }] },
  'selvedge-denim': { description: 'A classic selvedge jean in 13.5 oz Japanese denim. Straight leg, mid-rise, copper rivets.', materials: '100% cotton selvedge denim', colors: ['Indigo', 'Black', 'Raw'], sizes: ['28', '30', '32', '34', '36'], stock: 22, specs: [{ label: 'Fit', value: 'Straight — true to size' }, { label: 'Material', value: '100% cotton selvedge' }, { label: 'Weight', value: '13.5 oz' }, { label: 'Care', value: 'Machine wash cold' }, { label: 'Origin', value: 'Japan' }] },
  'pleated-trouser': { description: 'A single-pleated trouser in a lightweight wool-blend. Tapered leg, side adjusters at the waist, and a buttoned back pocket. Dress it up or down.', materials: '70% wool, 30% polyester', colors: ['Stone', 'Navy', 'Charcoal'], sizes: ['28', '30', '32', '34', '36'], stock: 16, specs: [{ label: 'Fit', value: 'Tapered — true to size' }, { label: 'Material', value: '70% wool, 30% polyester' }, { label: 'Care', value: 'Dry clean only' }, { label: 'Origin', value: 'Portugal' }] },
  'straight-chino': { description: 'A straight-fit chino in a 9 oz cotton twill. Flat front, side pockets, and a buttoned back pocket. The fabric is garment-dyed for a soft, broken-in feel.', materials: '100% organic cotton twill', colors: ['Khaki', 'Navy', 'Olive'], sizes: ['28', '30', '32', '34', '36'], stock: 25, specs: [{ label: 'Fit', value: 'Straight — true to size' }, { label: 'Material', value: '100% organic cotton' }, { label: 'Weight', value: '9 oz' }, { label: 'Care', value: 'Machine wash cold' }, { label: 'Origin', value: 'Portugal' }] },
  'loopback-sweatpant': { description: 'A loopback sweatpant with a relaxed fit and tapered leg. Elastic waistband with drawcord, side pockets, and a back pocket. The fabric is brushed inside for warmth.', materials: '100% organic cotton loopback', colors: ['Grey', 'Black', 'Navy'], sizes: ['S', 'M', 'L', 'XL'], stock: 0, specs: [{ label: 'Fit', value: 'Relaxed — true to size' }, { label: 'Material', value: '100% organic cotton' }, { label: 'Weight', value: '320 gsm' }, { label: 'Care', value: 'Machine wash cold' }, { label: 'Origin', value: 'Portugal' }] },
  'full-grain-belt': { description: 'A full-grain leather belt with a solid brass buckle. The belt is 35 mm wide and tapers to a point. The leather develops a patina with wear.', materials: 'Full-grain vegetable-tanned leather', colors: ['Black', 'Brown', 'Tan'], sizes: ['S', 'M', 'L', 'XL'], stock: 40, specs: [{ label: 'Width', value: '35 mm' }, { label: 'Material', value: 'Full-grain vegetable-tanned leather' }, { label: 'Buckle', value: 'Solid brass' }, { label: 'Care', value: 'Wipe clean' }, { label: 'Origin', value: 'Italy' }] },
  'merino-watch-cap': { description: 'A classic watch cap in fine-gauge merino. Ribbed brim, foldable to adjust height. The fabric is naturally temperature-regulating and non-itchy.', materials: '100% extra-fine merino wool', colors: ['Mustard', 'Navy', 'Charcoal'], sizes: ['One Size'], stock: 35, specs: [{ label: 'Fit', value: 'One size fits all' }, { label: 'Material', value: '100% extra-fine merino' }, { label: 'Gauge', value: '12 gg' }, { label: 'Care', value: 'Hand wash cold' }, { label: 'Origin', value: 'Italy' }] },
  'canvas-tote': { description: 'A sturdy canvas tote with reinforced handles and a flat base. The bag is garment-dyed for a soft, broken-in feel. Internal pocket for keys and phone.', materials: '100% organic cotton canvas', colors: ['Natural', 'Black', 'Navy'], sizes: ['One Size'], stock: 28, specs: [{ label: 'Dimensions', value: '40 × 35 × 12 cm' }, { label: 'Material', value: '100% organic cotton canvas' }, { label: 'Weight', value: '380 g' }, { label: 'Care', value: 'Machine wash cold' }, { label: 'Origin', value: 'Portugal' }] },
  'ribbed-wool-scarf': { description: 'A ribbed wool scarf in a mid-gauge merino blend. The scarf is long enough to wrap twice. Ribbed texture adds visual interest without bulk.', materials: '70% merino wool, 30% nylon', colors: ['Camel', 'Charcoal', 'Cream'], sizes: ['One Size'], stock: 20, specs: [{ label: 'Dimensions', value: '180 × 30 cm' }, { label: 'Material', value: '70% merino, 30% nylon' }, { label: 'Gauge', value: '8 gg' }, { label: 'Care', value: 'Hand wash cold' }, { label: 'Origin', value: 'Italy' }] },
  'court-sneaker': { description: 'A classic court sneaker in full-grain leather. Vulcanized sole, reinforced toe, and padded collar. The leather softens and creases naturally with wear.', materials: 'Full-grain leather, rubber sole', colors: ['White', 'Black', 'Navy'], sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11'], stock: 15, specs: [{ label: 'Fit', value: 'True to size' }, { label: 'Material', value: 'Full-grain leather' }, { label: 'Sole', value: 'Vulcanized rubber' }, { label: 'Care', value: 'Wipe clean' }, { label: 'Origin', value: 'Portugal' }] },
  'service-boot': { description: 'A service boot in full-grain leather with a Goodyear welt. The boot is unlined for breathability and has a Vibram lug sole. The leather develops a rich patina with wear.', materials: 'Full-grain leather, Vibram sole', colors: ['Brown', 'Black', 'Tan'], sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11'], stock: 8, specs: [{ label: 'Fit', value: 'True to size' }, { label: 'Material', value: 'Full-grain leather' }, { label: 'Sole', value: 'Vibram lug' }, { label: 'Care', value: 'Leather conditioner' }, { label: 'Origin', value: 'Portugal' }] },
  'suede-derby': { description: 'A suede derby in a mid-weight suede. The shoe has a Blake stitch construction and a leather sole. The suede is water-resistant treated.', materials: 'Suede, Blake stitch, leather sole', colors: ['Taupe', 'Brown', 'Navy'], sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11'], stock: 0, specs: [{ label: 'Fit', value: 'True to size' }, { label: 'Material', value: 'Suede' }, { label: 'Construction', value: 'Blake stitch' }, { label: 'Sole', value: 'Leather' }, { label: 'Care', value: 'Suede brush' }, { label: 'Origin', value: 'Italy' }] },
}

// Merge PDP details into products
Object.keys(PRODUCT_DETAILS).forEach((slug) => {
  const product = ALL_PRODUCTS.find((p) => p.slug === slug)
  if (product) {
    Object.assign(product, PRODUCT_DETAILS[slug])
  }
})

const bySlug = Object.fromEntries(ALL_PRODUCTS.map((product) => [product.slug, product]))

/** Every product in catalog order. */
export const products = ALL_PRODUCTS

/** Resolve a list of slugs to product objects (homepage module selections). */
export function productsBySlug(slugs) {
  return slugs.map((slug) => bySlug[slug]).filter(Boolean)
}

/* Homepage module selections — distinct sets per tab/section so the page
   reads like a real storefront, not the same four tiles repeated. */
export const newArrivalProducts = productsBySlug([
  'linen-camp-shirt',
  'canvas-chore-jacket',
  'merino-watch-cap',
  'pleated-trouser',
])

export const featuredProducts = productsBySlug([
  'wool-overcoat',
  'oxford-shirt',
  'selvedge-denim',
  'court-sneaker',
])

export const bestSellerProducts = productsBySlug([
  'merino-crewneck',
  'straight-chino',
  'service-boot',
  'heavyweight-tee',
])

export const trendingProducts = productsBySlug([
  'packable-anorak',
  'rollneck-knit',
  'canvas-tote',
  'full-grain-belt',
])

/** Find a single product by slug. */
export function getProductBySlug(slug) {
  return bySlug[slug] ?? null
}