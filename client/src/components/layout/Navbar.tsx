import { Cancel01Icon, HeartAddIcon, Menu01Icon, SearchIcon, ShoppingBag01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { UserMenu } from "./UserMenu"

import { Input } from "@/components/ui/input"
import ROUTES from "@/constants/paths"
import { useCartQuery } from "@/features/cart/hooks/useCartQueries"
import { useCategoriesQuery } from "@/features/shop/hooks/useProductQueries"
import { useSearchSync } from "@/hooks/useSearchSync"
import { cn } from "@/lib/utils"
import { useCustomerAuthStore } from "@/stores/customer-auth-store"
import { MobileDrawer } from "./MobileDrawer"

export const ICON_STROKE = 1.5

const NAV_LINKS = [
  { to: ROUTES.home, label: "Atelier" },
  { to: ROUTES.shop, label: "Shop" },
  { to: ROUTES.heritage, label: "Heritage" },
] as const

const NavLink = ({
  to,
  label,
  isActive,
  scrolled,
}: {
  to: string
  label: string
  isActive: boolean
  scrolled: boolean
}) => (
  <Link
    to={to}
    className={cn(
      "text-sm tracking-[0.2em] uppercase transition-colors duration-500",
      isActive
        ? "text-foreground"
        : scrolled
          ? "text-foreground/60 hover:text-foreground"
          : "text-foreground/70 hover:text-foreground"
    )}
  >
    {label}
  </Link>
)

// --- Main Component ---

export const Navbar = () => {
  const location = useLocation()
  const { query, setQuery, submitSearch } = useSearchSync()

  // UI State
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const prevPathnameRef = useRef(location.pathname)

  // Data
  const { data: cart } = useCartQuery(useCustomerAuthStore((s) => s.isAuthenticated))
  const { data: categories } = useCategoriesQuery()

  const totalItems = useMemo(() => cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0, [cart])
  const rootCategories = useMemo(() => (categories ?? []).filter((c) => !c.parent_id), [categories])

  // Derived Styles
  const isTransparentPage = ["/", ROUTES.shop, ROUTES.heritage].includes(location.pathname)
  const scrolled = isScrolled || !isTransparentPage

  // Effects
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (prevPathnameRef.current !== location.pathname) {
      prevPathnameRef.current = location.pathname
      setMobileMenuOpen(false)
    }
  }, [location.pathname])

  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus()
  }, [isSearchOpen])

  useEffect(() => {
    if (!isSearchOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false)
      }
    }
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && setIsSearchOpen(false)

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEsc)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEsc)
    }
  }, [isSearchOpen])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 right-0 left-0 z-50 transition-all duration-500",
          scrolled ? "border-b border-border bg-background/80 backdrop-blur-md" : "bg-transparent"
        )}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen((p) => !p)}
              className="-ml-2 p-2 text-foreground transition-colors duration-500 lg:hidden"
              aria-label="Toggle menu"
            >
              <HugeiconsIcon
                icon={mobileMenuOpen ? Cancel01Icon : Menu01Icon}
                className="h-5 w-5"
                strokeWidth={ICON_STROKE}
              />
            </button>

            {/* Desktop Nav */}
            <div className="hidden items-center gap-12 lg:flex">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.to} {...link} isActive={location.pathname === link.to} scrolled={scrolled} />
              ))}
            </div>

            {/* Logo */}
            <Link
              to={ROUTES.home}
              className="absolute left-1/2 -translate-x-1/2 font-serif text-xl tracking-[0.25em] text-foreground uppercase transition-colors duration-500 lg:text-2xl"
            >
              JUICY
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Search */}
              <div ref={searchContainerRef} className="relative flex items-center">
                <AnimatePresence>
                  {isSearchOpen ? (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 200, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <form onSubmit={submitSearch}>
                        <Input
                          ref={searchInputRef}
                          type="text"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Search silhouettes..."
                          className="w-full border-b border-foreground/30 bg-transparent py-1 pr-2 text-sm text-foreground transition-colors duration-500 outline-none placeholder:text-foreground/50"
                        />
                      </form>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                <button
                  onClick={() => setIsSearchOpen((p) => !p)}
                  className="p-2 text-foreground transition-colors duration-500"
                  aria-label="Search"
                >
                  <HugeiconsIcon
                    icon={isSearchOpen ? Cancel01Icon : SearchIcon}
                    className="h-5 w-5"
                    strokeWidth={ICON_STROKE}
                  />
                </button>
              </div>

              {/* Cart */}
              <Link
                to={ROUTES.cart}
                className="relative hidden p-2 text-foreground transition-colors duration-500 lg:block"
              >
                <HugeiconsIcon icon={ShoppingBag01Icon} className="h-5 w-5" strokeWidth={ICON_STROKE} />
                {totalItems > 0 ? (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-foreground text-[10px] text-background transition-colors duration-500">
                    {totalItems}
                  </span>
                ) : null}
              </Link>

              {/* Wishlist */}
              <Link to={ROUTES.wishlist} className="hidden p-2 text-foreground transition-colors duration-500 sm:block">
                <HugeiconsIcon icon={HeartAddIcon} className="h-5 w-5" strokeWidth={ICON_STROKE} />
              </Link>

              {/* User */}
              <UserMenu scrolled={scrolled} />
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Category Ribbon */}
      {rootCategories.length > 0 ? (
        <div
          className={cn(
            "fixed top-16 z-40 w-full border-t border-border/40 bg-muted/30 backdrop-blur-sm transition-all duration-500 lg:top-20",
            scrolled ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          <div className="container mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-max items-center gap-1 py-2">
              {rootCategories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className={cn(
                    "rounded-sm px-3 py-1.5 text-[11px] tracking-wider whitespace-nowrap uppercase transition-colors duration-200",
                    location.pathname === `/category/${cat.slug}`
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        query={query}
        onQueryChange={setQuery}
        categories={rootCategories}
        navLinks={NAV_LINKS}
      />
    </>
  )
}

export default Navbar
