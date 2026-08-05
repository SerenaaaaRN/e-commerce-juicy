import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useCartQuery } from "@/features/cart/hooks/useCartQueries"
import { useWishlistQuery } from "@/features/wishlist/hooks/useWishlistQueries"
import { customerApi } from "@/lib/api"
import { useCustomerAuthStore } from "@/stores/customer-auth-store"
import { createRootRoute, Outlet, useRouterState } from "@tanstack/react-router"
import { useEffect } from "react"

const ScrollToTop = () => {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

const RootContent = () => {
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
      <Outlet />
      <Toaster />
    </div>
  )
}

export const Route = createRootRoute({
  component: () => (
    <TooltipProvider>
      <ScrollToTop />
      <RootContent />
    </TooltipProvider>
  ),
})