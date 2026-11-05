import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { products, getProductBySlug } from '../data/products'
import { ProductGallery } from '../components/pdp/ProductGallery'
import { ProductInfo } from '../components/pdp/ProductInfo'
import { ProductVariantSelector } from '../components/pdp/ProductVariantSelector'
import { AddToCartSection } from '../components/pdp/AddToCartSection'
import { ProductSpecs } from '../components/pdp/ProductSpecs'
import { RelatedProducts } from '../components/pdp/RelatedProducts'

/*
 * ProductDetailsPage — Product Details Page (UI spec §14.4).
 * Two-column layout: 55 | 45 gap 48 desktop, stacked mobile.
 * Left: product image gallery (main 4:5 + thumbnail row).
 * Right: category label → H1 → price row → description → color → size →
 * stock → qty + Add to cart → delivery info → accordions.
 * Below: related products (4-up grid).
 * No backend — Add to Cart uses temporary frontend state.
 */
export function ProductDetailsPage() {
  const { slug } = useParams()
  const product = getProductBySlug(slug)

  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.[0] || null
  )
  const [selectedSize, setSelectedSize] = useState(
    product?.sizes?.[0] || null
  )
  const [quantity, setQuantity] = useState(1)
  const [showToast, setShowToast] = useState(false)

  if (!product) {
    return (
      <section className="bg-white">
        <Container className="py-12 sm:py-[72px] md:py-24 text-center">
          <Badge tone="neutral" size="m" className="mb-4">
            Product not found
          </Badge>
          <h1 className="font-display text-h1 font-bold text-ink mb-4">
            Page not found
          </h1>
          <p className="text-body text-body-copy mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button variant="primary" size="m" to="/products">
            Browse all products
          </Button>
        </Container>
      </section>
    )
  }

  const handleAddToCart = () => {
    setShowToast(true)
    setTimeout(() => setShowToast(false), 4000)
  }

  // Related products: same category, excluding current product
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4)

  // Build image array
  const images = product.image ? [product.image] : []

  return (
    <section className="bg-white">
      <Container className="py-12 sm:py-[72px] md:py-24">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap gap-1.5 text-body-sm text-muted mb-8"
        >
          <Link
            to="/"
            className="text-muted hover:text-primary-700 transition-colors"
          >
            Home
          </Link>
          <span className="mx-1" aria-hidden="true">/</span>
          <Link
            to="/products"
            className="text-muted hover:text-primary-700 transition-colors"
          >
            Products
          </Link>
          <span className="mx-1" aria-hidden="true">/</span>
          <span className="text-ink font-medium">{product.name}</span>
        </nav>

        {/* Two-column layout: 55 | 45 */}
        <div className="lg:grid lg:grid-cols-[55fr_45fr] lg:gap-12">
          {/* Left — Product gallery */}
          <div className="mb-8 lg:mb-0">
            <ProductGallery images={images} alt={product.alt ?? product.name} />
          </div>

          {/* Right — Product info + variants + add to cart */}
          <div className="space-y-6">
            <ProductInfo product={product} />

            <div className="border-t border-line pt-6">
              <ProductVariantSelector
                colors={product.colors || []}
                sizes={product.sizes || []}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                onSelectColor={setSelectedColor}
                onSelectSize={setSelectedSize}
              />
            </div>

            <div className="border-t border-line pt-6">
              <AddToCartSection
                product={product}
                quantity={quantity}
                setQuantity={setQuantity}
                onAddToCart={handleAddToCart}
              />
            </div>

            <div className="border-t border-line pt-6">
              <ProductSpecs
                specs={product.specs || []}
                description={product.description}
                materials={product.materials}
              />
            </div>
          </div>
        </div>

        {/* Related products */}
        <div className="mt-12 sm:mt-16 md:mt-24">
          <RelatedProducts products={relatedProducts} />
        </div>
      </Container>

      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-white border border-line shadow-toast rounded-none p-4 flex items-center gap-3">
            <div className="h-5 w-5 bg-primary-100 text-primary-700 rounded-none flex items-center justify-center text-micro font-bold">
              ✓
            </div>
            <span className="text-body-sm text-ink">
              Added {quantity} × {product.name} to cart
            </span>
          </div>
        </div>
      )}
    </section>
  )
}
