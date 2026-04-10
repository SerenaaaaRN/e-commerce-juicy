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

// ScrollToTop component to reset viewport on route transition
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="relative flex min-h-screen flex-col bg-background font-sans text-foreground antialiased selection:bg-primary/10 selection:text-primary">
        
        {/* Responsive Public Header */}
        <Navbar />

        {/* Primary Page Canvas */}
        <main className="flex-1">
          <Routes>
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
          </Routes>
        </main>

        {/* Responsive Typographic Footer */}
        <Footer />

        {/* Toast Notifications */}
        <Toaster />
        
      </div>
    </BrowserRouter>
  )
}

export default App
