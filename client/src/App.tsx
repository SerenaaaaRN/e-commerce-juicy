import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { routes, type RouteConfig } from "@/constants/routes"
import { useCartQuery } from "@/features/cart/hooks/useCartQueries"
import { useWishlistQuery } from "@/features/wishlist/hooks/useWishlistQueries"
import { customerApi } from "@/lib/api"
import { useCustomerAuthStore } from "@/stores/customer-auth-store"
import { useEffect, type ReactNode } from "react"
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

const renderRoutes = (routeList: RouteConfig[]): ReactNode =>
  routeList.map((route, i) => {
    if (route.index) {
      return <Route key={`index-${i}`} index element={route.element} />
    }
    return (
      <Route key={route.path ?? `group-${i}`} path={route.path} element={route.element}>
        {route.children && renderRoutes(route.children)}
      </Route>
    )
  })

const AppContent = () => {
  const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated)
  const logout = useCustomerAuthStore((s) => s.logout)

  useCartQuery(isAuthenticated)
  useWishlistQuery(isAuthenticated)

  useEffect(() => {
    const initializeAuth = async () => {
      if (isAuthenticated) {
        try {
          const profileRes = await customerApi.getProfile()
          if (!profileRes.success) {
            logout()
          }
        } catch {
          // kalo profile gagal, dynamic response interceptor akan handle logout 401
        }
      }
    }
    initializeAuth()
  }, [isAuthenticated, logout])

  return (
    <div className="relative flex min-h-screen flex-col bg-background font-sans text-foreground antialiased selection:bg-primary/10 selection:text-primary">
      <Routes>{renderRoutes(routes)}</Routes>

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
