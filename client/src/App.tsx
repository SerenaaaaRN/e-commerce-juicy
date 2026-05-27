import { useEffect } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { ROUTES } from "@/constants/routes"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { HomePage } from "@/features/home/HomePage"
import { CollectionPage } from "@/features/shop/CollectionPage"
import { ProductPage } from "@/features/shop/ProductPage"
import { LoginPageCust } from "@/features/auth/LoginPageCust"
import { RegisterPage } from "@/features/auth/RegisterPage"
import { ProfilePage } from "@/features/profile/ProfilePage"
import { CartPage } from "@/features/cart/CartPage"
import { CheckoutPage } from "@/features/checkout/CheckoutPage"
import { OrderTrackingPage } from "@/features/orders/OrderTrackingPage"
import { OrderHistoryPage } from "@/features/orders/OrderHistoryPage"
import { WishlistPage } from "@/features/wishlist/WishlistPage"
import { CategoryLandingPage } from "@/features/category/CategoryLandingPage"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

// Admin Routes & Guards
import { LoginPageAdmin } from "@/features/auth/LoginPageAdmin"
import { AdminRoute } from "@/features/admin/components/AdminRoute"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { DashboardPage } from "@/features/admin/DashboardPage"
import { ProductsPage } from "@/features/admin/ProductsPage"
import { OrdersPage } from "@/features/admin/OrdersPage"
import { CustomersPage } from "@/features/admin/CustomersPage"
import { ReviewsPage } from "@/features/admin/ReviewsPage"

import { useCustomerAuthStore } from "@/stores/customerAuthStore"
import { useCartStore } from "@/stores/cartStore"
import { useWishlistStore } from "@/stores/wishlistStore"
import { customerApi } from "@/lib/api"

// ScrollToTop component to reset viewport on route transition
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

const AppContent = () => {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith("/admin")
  const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated)
  const logout = useCustomerAuthStore((s) => s.logout)
  const fetchCart = useCartStore((s) => s.fetchCart)
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist)

  // Auto-rehydrate profile and load cart/wishlist from database
  useEffect(() => {
    const initializeAuthAndCart = async () => {
      if (isAuthenticated) {
        try {
          const profileRes = await customerApi.getProfile()
          if (profileRes.success) {
            fetchCart()
            fetchWishlist()
          } else {
            logout()
          }
        } catch {
          // If profile fails, dynamic response interceptor handles 401 logouts
        }
      }
    }
    initializeAuthAndCart()
  }, [isAuthenticated, fetchCart, fetchWishlist, logout])

  return (
    <div className="relative flex min-h-screen flex-col bg-background font-sans text-foreground antialiased selection:bg-primary/10 selection:text-primary">
      {/* Responsive Public Header */}
      {!isAdmin && location.pathname !== ROUTES.login && location.pathname !== ROUTES.register && <Navbar />}

      {/* Primary Page Canvas */}
      <main className="flex-1">
        <Routes>
          {/* Public Storefront Routes */}
          <Route path={ROUTES.home} element={<HomePage />} />
          <Route path={ROUTES.shop} element={<CollectionPage />} />
          <Route path={ROUTES.product} element={<ProductPage />} />
          <Route path={ROUTES.category} element={<CategoryLandingPage />} />
          <Route path={ROUTES.cart} element={<CartPage />} />
          <Route path={ROUTES.checkout} element={<CheckoutPage />} />
          <Route path={ROUTES.orders} element={<OrderHistoryPage />} />
          <Route path={ROUTES.orderTracking} element={<OrderTrackingPage />} />
          <Route path={ROUTES.wishlist} element={<WishlistPage />} />
          <Route path={ROUTES.profile} element={<ProfilePage />} />
          <Route path={ROUTES.login} element={<LoginPageCust />} />
          <Route path={ROUTES.register} element={<RegisterPage />} />

          {/* Admin Unprotected Routes */}
          <Route path={ROUTES.adminLogin} element={<LoginPageAdmin />} />

          {/* Protected Console Suite */}
          <Route
            path={ROUTES.admin}
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
          </Route>
        </Routes>
      </main>

      {/* Responsive Typographic Footer */}
      {!isAdmin && location.pathname !== ROUTES.login && location.pathname !== ROUTES.register && <Footer />}

      {/* Toast Notifications */}
      <Toaster />
    </div>
  )
}

export const App = () => {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <ScrollToTop />
        <AppContent />
      </TooltipProvider>
    </BrowserRouter>
  )
}

export default App
