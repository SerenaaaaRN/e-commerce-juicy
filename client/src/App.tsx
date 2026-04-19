import { useEffect } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { HomePage } from "@/features/home/HomePage"
import { CollectionPage } from "@/features/shop/CollectionPage"
import { ProductPage } from "@/features/shop/ProductPage"
import { LoginPage } from "@/features/auth/LoginPage"
import { RegisterPage } from "@/features/auth/RegisterPage"
import { ProfilePage } from "@/features/profile/ProfilePage"
import { CartPage } from "@/features/cart/CartPage"
import { CheckoutPage } from "@/features/checkout/CheckoutPage"
import { OrderTrackingPage } from "@/features/orders/OrderTrackingPage"
import { OrderHistoryPage } from "@/features/orders/OrderHistoryPage"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

// Admin Routes & Guards
import { LoginPage as AdminLoginPage } from "@/features/admin/LoginPage"
import { AdminRoute } from "@/features/admin/components/AdminRoute"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { DashboardPage } from "@/features/admin/DashboardPage"
import { ProductsPage } from "@/features/admin/ProductsPage"
import { OrdersPage } from "@/features/admin/OrdersPage"
import { CustomersPage } from "@/features/admin/CustomersPage"
import { ReviewsPage } from "@/features/admin/ReviewsPage"

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

  return (
    <div className="relative flex min-h-screen flex-col bg-background font-sans text-foreground antialiased selection:bg-primary/10 selection:text-primary">
      
      {/* Responsive Public Header */}
      {!isAdmin && <Navbar />}

      {/* Primary Page Canvas */}
      <main className="flex-1">
        <Routes>
          {/* Public Storefront Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<CollectionPage />} />
          <Route path="/shop/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/orders/:orderNumber" element={<OrderTrackingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin Unprotected Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Console Suite */}
          <Route
            path="/admin"
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
      {!isAdmin && <Footer />}

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
