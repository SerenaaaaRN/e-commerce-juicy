import { useEffect } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { HomePage } from "@/features/home/HomePage"
import { CollectionPage } from "@/features/shop/CollectionPage"
import { LoginPage } from "@/features/auth/LoginPage"

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
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>

        {/* Responsive Typographic Footer */}
        <Footer />
        
      </div>
    </BrowserRouter>
  )
}

export default App
