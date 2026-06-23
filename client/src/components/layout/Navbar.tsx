import {
  Cancel01Icon,
  HeartAddIcon,
  Menu01Icon,
  SearchIcon,
  ShoppingBag01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatePresence, motion } from "motion/react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import ROUTES from "@/constants/paths"
import { useCartQuery } from "@/features/cart/hooks/useCartQueries"
import { useCategoriesQuery } from "@/features/shop/hooks/useProductQueries"
import { useDebounce } from "@/hooks/useDebounce"
import { cn } from "@/lib/utils"
import { useCustomerAuthStore } from "@/stores/customer-auth-store"

const NAV_LINKS = [
  { to: ROUTES.home, label: "Atelier" },
  { to: ROUTES.shop, label: "Shop" },
  { to: ROUTES.heritage, label: "Heritage" },
] as const

const ICON_STROKE = 1.5
const DEBOUNCE_MS = 300

/**
 * Mengelola seluruh logika pencarian & sinkronisasi URL
 */
const useSearchSync = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const urlQuery = searchParams.get("search") || ""
  const [query, setQuery] = useState(urlQuery)
  const debouncedQuery = useDebounce(query, DEBOUNCE_MS)

  useEffect(() => {
    setQuery(urlQuery)
  }, [urlQuery])

  useEffect(() => {
    const trimmed = debouncedQuery.trim()
    const current = searchParams.get("search") || ""

    if (trimmed === current) return

    const params = new URLSearchParams(searchParams)
    if (!trimmed) {
      params.delete("search")
    } else {
      params.set("search", trimmed)
      params.set("page", "1")
    }

    const targetPath =
      location.pathname === ROUTES.shop
        ? `${ROUTES.shop}?${params.toString()}`
        : `${ROUTES.shop}?search=${encodeURIComponent(trimmed)}`

    navigate(targetPath, { replace: true })
  }, [debouncedQuery, navigate, location.pathname, searchParams])

  const submitSearch = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault()
      if (query.trim()) {
        navigate(`/shop?search=${encodeURIComponent(query.trim())}`)
      }
    },
    [query, navigate]
  )

  return { query, setQuery, submitSearch }
}

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

const UserMenu = ({ scrolled }: { scrolled: boolean }) => {
  const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated)
  const customer = useCustomerAuthStore((s) => s.customer)
  const logout = useCustomerAuthStore((s) => s.logout)

  const triggerClass = cn(
    "hidden rounded-full p-2 transition-colors duration-500 hover:bg-muted sm:block",
    scrolled ? "text-foreground" : "text-foreground"
  )

  if (isAuthenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={triggerClass}>
            <HugeiconsIcon icon={UserIcon} className="h-5 w-5" strokeWidth={ICON_STROKE} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="mt-2 w-56">
          <div className="flex flex-col px-3 py-2 text-xs">
            <span className="truncate font-semibold">{customer?.full_name}</span>
            <span className="truncate text-muted-foreground">{customer?.email}</span>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={ROUTES.profile} className="w-full cursor-pointer">
              Account Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={ROUTES.orders} className="w-full cursor-pointer">
              My Orders
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={logout}
            className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={triggerClass}>
          <HugeiconsIcon icon={UserIcon} className="h-5 w-5" strokeWidth={ICON_STROKE} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-2 w-48">
        <DropdownMenuItem asChild>
          <Link to={ROUTES.login} className="w-full cursor-pointer">
            Log In
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={ROUTES.register} className="w-full cursor-pointer">
            Register
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// --- Main Component ---

export const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
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
              <Link to={ROUTES.cart} className="relative p-2 text-foreground transition-colors duration-500">
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

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen ? (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer Panel - Menggunakan Flex Column agar konten bisa scroll */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[85%] max-w-[320px] flex-col border-r border-border bg-background shadow-xl lg:hidden"
            >
              {/* header drawer */}
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6">
                <span className="font-serif text-lg font-bold tracking-[0.2em] uppercase">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="-mr-2 p-2 text-muted-foreground hover:text-foreground"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="h-6 w-6" strokeWidth={ICON_STROKE} />
                </button>
              </div>

              {/* scrollable content area */}
              <div className="flex-1 overflow-y-auto overscroll-contain pb-10">
                {/* searchbar mobile */}
                <div className="border-b border-border bg-muted/20 p-6">
                  <div className="relative w-full">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                      <HugeiconsIcon icon={SearchIcon} className="size-4" />
                    </span>
                    <Input
                      type="text"
                      placeholder="Search silhouettes..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="h-10 w-full rounded-md border border-input bg-background px-9 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-1 px-4 py-6">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "px-4 py-3 text-sm font-medium tracking-wide uppercase transition-all",
                        location.pathname === link.to
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/70 hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Categories Section */}
                <div className="border-t border-border px-4 py-6">
                  <p className="mb-4 px-4 text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                    Categories
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {rootCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-md border border-transparent px-4 py-2.5 text-sm text-foreground/80 transition-colors hover:border-border hover:bg-muted hover:text-foreground"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Account Section */}
                <div className="mt-auto border-t border-border px-4 py-6">
                  <p className="mb-4 px-4 text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                    Account
                  </p>
                  {useCustomerAuthStore.getState().isAuthenticated ? (
                    <div className="flex flex-col gap-2">
                      <Link
                        to={ROUTES.profile}
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-lg px-4 py-3 text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground"
                      >
                        Profile
                      </Link>
                      <Link
                        to={ROUTES.orders}
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-lg px-4 py-3 text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground"
                      >
                        Orders
                      </Link>
                      <button
                        onClick={() => {
                          useCustomerAuthStore.getState().logout()
                          navigate("/")
                          setMobileMenuOpen(false)
                        }}
                        className="rounded-lg px-4 py-3 text-left text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link
                      to={ROUTES.login}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-lg px-4 py-3 text-sm font-medium text-primary hover:bg-primary/5"
                    >
                      Sign In / Register
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default Navbar
