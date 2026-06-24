import { HeartAddIcon, Home01Icon, ShoppingBag01Icon, Store01Icon, UserIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { type MouseEvent, useMemo } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import { ROUTES } from "@/constants/paths"
import { useCartQuery } from "@/features/cart/hooks/useCartQueries"
import { cn } from "@/lib/utils"
import { useCustomerAuthStore } from "@/stores/customer-auth-store"

const ICON_STROKE = 1.5

export const BottomNav = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated)
  const { data: cart } = useCartQuery(isAuthenticated)

  const totalItems = useMemo(() => cart?.items
    .reduce((sum, i) => sum + i.quantity, 0) ?? 0, [cart])

  const handleProfileClick = (e: MouseEvent) => {
    e.preventDefault()
    if (isAuthenticated) {
      navigate(ROUTES.profile)
    } else {
      navigate(ROUTES.login)
    }
  }

  const isShopActive = location.pathname === ROUTES.shop || location.pathname.startsWith("/category/")

  return (
    <div className="pb-safe fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center justify-around border-t border-border bg-background/90 px-2 backdrop-blur-md lg:hidden">
      {/* Home */}
      <Link
        to={ROUTES.home}
        className={cn(
          "flex flex-col items-center justify-center gap-1 p-2 transition-colors",
          location.pathname === ROUTES.home ? "text-primary" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <HugeiconsIcon icon={Home01Icon} className="h-5.5 w-5.5" strokeWidth={ICON_STROKE} />
        <span className="text-[10px] font-medium tracking-wide uppercase">Home</span>
      </Link>

      {/* Shop */}
      <Link
        to={ROUTES.shop}
        className={cn(
          "flex flex-col items-center justify-center gap-1 p-2 transition-colors",
          isShopActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <HugeiconsIcon icon={Store01Icon} className="h-5.5 w-5.5" strokeWidth={ICON_STROKE} />
        <span className="text-[10px] font-medium tracking-wide uppercase">Shop</span>
      </Link>

      {/* Cart */}
      <Link
        to={ROUTES.cart}
        className={cn(
          "relative flex flex-col items-center justify-center gap-1 p-2 transition-colors",
          location.pathname === ROUTES.cart ? "text-primary" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <div className="relative">
          <HugeiconsIcon icon={ShoppingBag01Icon} className="h-5.5 w-5.5" strokeWidth={ICON_STROKE} />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[9px] text-background">
              {totalItems}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium tracking-wide uppercase">Cart</span>
      </Link>

      {/* Wishlist */}
      <Link
        to={ROUTES.wishlist}
        className={cn(
          "flex flex-col items-center justify-center gap-1 p-2 transition-colors",
          location.pathname === ROUTES.wishlist ? "text-primary" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <HugeiconsIcon icon={HeartAddIcon} className="h-5.5 w-5.5" strokeWidth={ICON_STROKE} />
        <span className="text-[10px] font-medium tracking-wide uppercase">Wishlist</span>
      </Link>

      {/* Profile */}
      <button
        onClick={handleProfileClick}
        className={cn(
          "flex flex-col items-center justify-center gap-1 p-2 transition-colors",
          location.pathname === ROUTES.profile || location.pathname === ROUTES.login
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <HugeiconsIcon icon={UserIcon} className="h-5.5 w-5.5" strokeWidth={ICON_STROKE} />
        <span className="text-[10px] font-medium tracking-wide uppercase">Profile</span>
      </button>
    </div>
  )
}
