import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { ProductCard } from '../components/common/ProductCard'

/*
 * WishlistPage — dedicated wishlist page.
 * Grid of saved products with remove + move to cart actions.
 * Empty state: heart icon + "Your wishlist is empty" + "Browse products".
 */
export function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleMoveToCart = (item) => {
    const product = { slug: item.slug, name: item.name, price: item.price, image: item.image, alt: item.alt, category: item.category, availability: item.availability }
    addToCart(product, 1, null, null)
    removeFromWishlist(item.slug)
  }

  if (items.length === 0) {
    return (
      <section className="bg-white">
        <Container className="py-12 sm:py-[72px] md:py-24">
          <div className="max-w-[520px] mx-auto text-center">
            <div className="h-16 w-16 mx-auto bg-surface-light rounded-none flex items-center justify-center mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h1 className="font-display text-h1 font-bold text-ink mb-4">
              Your wishlist is empty
            </h1>
            <p className="text-body text-body-copy mb-8">
              Save items you love for later. Tap the heart icon on any product.
            </p>
            <Button variant="primary" size="l" to="/products">
              Browse products
            </Button>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="bg-white">
      <Container className="py-12 sm:py-[72px] md:py-24">
        <div className="mb-8">
          <h1 className="font-display text-h1 font-bold text-ink mb-2">
            Wishlist
          </h1>
          <p className="text-body-sm text-muted">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {items.map((item) => (
            <WishlistItem
              key={item.slug}
              item={item}
              onRemove={() => removeFromWishlist(item.slug)}
              onMoveToCart={() => handleMoveToCart(item)}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={clearWishlist}
            className="text-body-sm text-muted hover:text-error-700 transition-colors"
          >
            Clear wishlist
          </button>
        </div>
      </Container>
    </section>
  )
}

/*
 * WishlistItem — single wishlist item with remove + move to cart.
 * Wraps ProductCard with additional actions.
 */
function WishlistItem({ item, onRemove, onMoveToCart }) {
  const product = {
    slug: item.slug,
    name: item.name,
    category: item.category,
    price: item.price,
    image: item.image,
    alt: item.alt,
    availability: item.availability,
  }

  return (
    <div className="relative">
      <ProductCard product={product} />
      <div className="mt-3 flex flex-col gap-2">
        <Button variant="primary" size="s" className="w-full" onClick={onMoveToCart}>
          Move to cart
        </Button>
        <button
          type="button"
          onClick={onRemove}
          className="text-body-sm text-muted hover:text-error-700 transition-colors text-center"
        >
          Remove
        </button>
      </div>
    </div>
  )
}
