/*
 * Demo account data — temporary customer and order data for the account dashboard.
 * Frontend-only step: no API, no backend. Clearly labeled as demo data.
 * Shape mirrors the expected API payload for future Spring Boot integration.
 */

export const DEMO_CUSTOMER = {
  id: 1,
  name: 'Jane Doe',
  email: 'jane@example.com',
  memberSince: '2025-09-15',
  defaultAddressId: 1,
}

export const DEMO_ADDRESSES = [
  {
    id: 1,
    label: 'Home',
    fullName: 'Jane Doe',
    address1: '123 Main Street',
    address2: 'Apt 4B',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    country: 'US',
    isDefault: true,
  },
  {
    id: 2,
    label: 'Work',
    fullName: 'Jane Doe',
    address1: '456 Market Street',
    address2: 'Suite 200',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'US',
    isDefault: false,
  },
]

export const DEMO_ORDERS = [
  {
    id: 'SHOP-20260115-ABCD',
    date: '2026-01-15',
    status: 'DELIVERED',
    total: 287.00,
    items: [
      { slug: 'wool-overcoat', name: 'Wool Overcoat — Charcoal', price: 189, quantity: 1, image: 'https://placehold.co/80x80/png?text=WO' },
      { slug: 'merino-watch-cap', name: 'Merino Watch Cap — Mustard', price: 38, quantity: 1, image: 'https://placehold.co/80x80/png?text=WC' },
      { slug: 'canvas-tote', name: 'Canvas Tote — Natural', price: 52, quantity: 1, image: 'https://placehold.co/80x80/png?text=CT' },
    ],
    address: {
      fullName: 'Jane Doe',
      address1: '123 Main Street',
      address2: 'Apt 4B',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'US',
    },
    shippingMethod: 'standard',
    paymentMethod: 'Visa ending in 4242',
    timeline: [
      { status: 'Order placed', timestamp: '2026-01-15T10:30:00Z' },
      { status: 'Payment confirmed', timestamp: '2026-01-15T10:32:00Z' },
      { status: 'Shipped', timestamp: '2026-01-16T08:00:00Z' },
      { status: 'Delivered', timestamp: '2026-01-18T14:22:00Z' },
    ],
  },
  {
    id: 'SHOP-20260102-EFGH',
    date: '2026-01-02',
    status: 'SHIPPED',
    total: 148.00,
    items: [
      { slug: 'selvedge-denim', name: 'Selvedge Denim — Indigo', price: 148, quantity: 1, image: 'https://placehold.co/80x80/png?text=SD' },
    ],
    address: {
      fullName: 'Jane Doe',
      address1: '123 Main Street',
      address2: 'Apt 4B',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'US',
    },
    shippingMethod: 'express',
    paymentMethod: 'Visa ending in 4242',
    timeline: [
      { status: 'Order placed', timestamp: '2026-01-02T09:15:00Z' },
      { status: 'Payment confirmed', timestamp: '2026-01-02T09:17:00Z' },
      { status: 'Shipped', timestamp: '2026-01-02T16:30:00Z' },
    ],
  },
  {
    id: 'SHOP-20251220-IJKL',
    date: '2025-12-20',
    status: 'PENDING',
    total: 96.00,
    items: [
      { slug: 'merino-crewneck', name: 'Merino Crewneck — Forest', price: 96, quantity: 1, image: 'https://placehold.co/80x80/png?text=MC' },
    ],
    address: {
      fullName: 'Jane Doe',
      address1: '123 Main Street',
      address2: 'Apt 4B',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'US',
    },
    shippingMethod: 'standard',
    paymentMethod: 'Visa ending in 4242',
    timeline: [
      { status: 'Order placed', timestamp: '2025-12-20T14:00:00Z' },
    ],
  },
]

export const ORDER_STATUS_LABELS = {
  PENDING: { label: 'Pending', tone: 'neutral' },
  PAID: { label: 'Paid', tone: 'success' },
  SHIPPED: { label: 'Shipped', tone: 'primary' },
  DELIVERED: { label: 'Delivered', tone: 'success' },
  CANCELLED: { label: 'Cancelled', tone: 'error' },
}

export const getDemoOrderById = (id) => DEMO_ORDERS.find((o) => o.id === id) ?? null
export const getDemoOrders = () => DEMO_ORDERS
export const getDemoCustomer = () => DEMO_CUSTOMER
export const getDemoAddresses = () => DEMO_ADDRESSES
