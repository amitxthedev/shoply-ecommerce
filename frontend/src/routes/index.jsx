import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { HomePage } from '../pages/HomePage'
import { DesignSystemPage } from '../pages/DesignSystemPage'
import { ListingPage } from '../pages/ListingPage'
import { ProductDetailsPage } from '../pages/ProductDetailsPage'
import { CartPage } from '../pages/CartPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage'
import { WishlistPage } from '../pages/WishlistPage'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage'
import { AccountPage } from '../pages/account/AccountPage'
import { AccountOverviewPage } from '../pages/account/AccountOverviewPage'
import { OrdersPage } from '../pages/account/OrdersPage'
import { OrderDetailPage } from '../pages/account/OrderDetailPage'
import { AddressesPage } from '../pages/account/AddressesPage'
import { ProfilePage } from '../pages/account/ProfilePage'
import { NotFoundPage } from '../pages/NotFoundPage'

/**
 * Route tree — storefront shell wraps every page.
 * Additional pages (catalog, PDP, cart, account, auth) join this tree as
 * they are built; `*` keeps every navigation target resolvable meanwhile.
 * `/design-system` is the component gallery (verification only, unlisted).
 */
export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '/products', element: <ListingPage /> },
      { path: '/products/:slug', element: <ProductDetailsPage /> },
      { path: '/cart', element: <CartPage /> },
      { path: '/checkout', element: <CheckoutPage /> },
      { path: '/order-confirmation', element: <OrderConfirmationPage /> },
      { path: '/wishlist', element: <WishlistPage /> },
      { path: '/account', element: <AccountPage />, children: [
        { index: true, element: <AccountOverviewPage /> },
        { path: 'orders', element: <OrdersPage /> },
        { path: 'orders/:id', element: <OrderDetailPage /> },
        { path: 'addresses', element: <AddressesPage /> },
        { path: 'profile', element: <ProfilePage /> },
      ] },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password/:token', element: <ResetPasswordPage /> },
      { path: '/category/:slug', element: <ListingPage /> },
      { path: '/search', element: <ListingPage /> },
      { path: '/design-system', element: <DesignSystemPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
