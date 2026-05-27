import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { ROUTES } from "@/constants/routes"
import { useCartStore } from "@/stores/cartStore"
import { useCustomerAuthStore } from "@/stores/customerAuthStore"
import { useProductStore } from "@/stores/productStore"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ShoppingBag01Icon,
  UserIcon,
  Menu01Icon,
  Cancel01Icon,
  SearchIcon,
  HeartAddIcon,
} from "@hugeicons/core-free-icons"
import { useDebounce } from "@/hooks/useDebounce"

const activeLinkClass = "text-primary font-medium"
const inactiveLinkClass = "text-muted-foreground hover:text-foreground transition-colors duration-200"

export const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const totalItems = useCartStore((state) => state.totalItems)()
  const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated)
  const customer = useCustomerAuthStore((s) => s.customer)
  const logout = useCustomerAuthStore((s) => s.logout)
  const categories = useProductStore((s) => s.categories)
  const fetchCategories = useProductStore((s) => s.fetchCategories)

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories()
    }
  }, [fetchCategories, categories.length])

  const rootCategories = categories.filter((c) => !c.parent_id)

  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")

  const urlQuery = searchParams.get("search") || ""

  useEffect(() => {
    setSearchQuery(urlQuery)
  }, [urlQuery])

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    const currentQuery = searchParams.get("search") || ""
    const trimmedQuery = debouncedSearchQuery.trim()

    if (trimmedQuery === "") {
      if (currentQuery !== "" && location.pathname === ROUTES.shop) {
        const updated = new URLSearchParams(searchParams)
        updated.delete("search")
        navigate(`${ROUTES.shop}?${updated.toString()}`, { replace: true })
      }
      return
    }

    if (trimmedQuery === currentQuery) {
      return
    }
    if (location.pathname === ROUTES.shop) {
      const updated = new URLSearchParams(searchParams)
      updated.set("search", trimmedQuery)
      updated.set("page", "1")
      navigate(`${ROUTES.shop}?${updated.toString()}`, { replace: true })
      return
    }

    navigate(`${ROUTES.shop}?search=${encodeURIComponent(trimmedQuery)}`)
  }, [debouncedSearchQuery, navigate, location.pathname, searchParams])

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile Navigation Trigger */}
        <button onClick={toggleMobileMenu} className="flex p-2 text-foreground md:hidden" aria-label="Toggle Menu">
          <HugeiconsIcon icon={mobileMenuOpen ? Cancel01Icon : Menu01Icon} strokeWidth={2} />
        </button>

        {/* Brand Logo */}
        <Link to={ROUTES.home} className="flex items-center gap-2">
          <span className="font-heading text-2xl font-bold tracking-[0.25em] text-foreground transition-colors duration-300 hover:text-primary">
            JUICY
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-8 text-sm tracking-widest uppercase md:flex">
          <Link
            to={ROUTES.home}
            className={cn(
              "relative py-2 text-xs transition-colors duration-200",
              location.pathname === ROUTES.home ? activeLinkClass : inactiveLinkClass
            )}
          >
            Atelier
            {location.pathname === ROUTES.home && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />}
          </Link>
          <Link
            to={ROUTES.shop}
            className={cn(
              "relative py-2 text-xs transition-colors duration-200",
              location.pathname === ROUTES.shop ? activeLinkClass : inactiveLinkClass
            )}
          >
            Shop
            {location.pathname === ROUTES.shop && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />}
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Desktop Search Bar */}
          <div className="relative hidden w-full max-w-50 md:flex lg:max-w-60">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
              <HugeiconsIcon icon={SearchIcon} className="size-4" />
            </span>
            <Input
              type="text"
              placeholder="Search silhouettes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-full rounded-none border border-input bg-muted/40 py-1 pr-4 pl-9 text-xs transition-all duration-200"
            />
          </div>

          {/* Cart Badge */}
          <Link
            to={ROUTES.cart}
            className="relative p-2 text-foreground transition-colors duration-200 hover:text-primary"
          >
            <HugeiconsIcon icon={ShoppingBag01Icon} strokeWidth={1.8} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 flex size-5 animate-pulse items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Wishlist */}
          <Link to={ROUTES.wishlist} className="p-2 text-foreground transition-colors duration-200 hover:text-primary">
            <HugeiconsIcon icon={HeartAddIcon} strokeWidth={1.8} />
          </Link>

          {/* User Account Controls */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full p-2 hover:bg-muted">
                  <HugeiconsIcon icon={UserIcon} strokeWidth={1.8} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mt-2 w-56">
                <div className="flex flex-col px-3 py-2 text-xs">
                  <span className="truncate font-semibold text-foreground">{customer?.full_name}</span>
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
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full p-2 hover:bg-muted">
                  <HugeiconsIcon icon={UserIcon} strokeWidth={1.8} />
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
          )}
        </div>
      </div>

      {/* Category Ribbon */}
      {rootCategories.length > 0 ? (
        <div className="hidden border-t border-border/40 bg-muted/30 md:block">
          <div className="container mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-max items-center gap-1 py-2">
              {rootCategories.map((cat) => {
                const isActive = location.pathname === `/category/${cat.slug}`
                return (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className={cn(
                      "rounded-sm px-3 py-1.5 text-[11px] tracking-wider whitespace-nowrap uppercase transition-colors duration-200",
                      isActive
                        ? "bg-primary/10 font-semibold text-primary"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    {cat.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      ) : null}

      {/* Mobile Drawer menu */}
      {mobileMenuOpen ? (
        <div className="flex animate-in flex-col gap-4 bg-background px-4 py-4 duration-300 fade-in slide-in-from-top-4 md:hidden">
          {/* Mobile Search Bar */}
          <div className="relative w-full">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
              <HugeiconsIcon icon={SearchIcon} className="size-4" />
            </span>
            <Input
              type="text"
              placeholder="Search silhouettes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-none border border-input bg-muted/40 py-2 pr-4 pl-9 text-xs transition-all duration-200"
            />
          </div>

          <Separator />
          <nav className="flex flex-col gap-4 text-sm tracking-widest uppercase">
            <Link
              to={ROUTES.home}
              onClick={toggleMobileMenu}
              className={cn(
                "block rounded-md px-1 py-2 text-xs transition-colors",
                location.pathname === ROUTES.home
                  ? "bg-accent/20 font-semibold text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Atelier
            </Link>
            <Link
              to={ROUTES.shop}
              onClick={toggleMobileMenu}
              className={cn(
                "block rounded-md px-1 py-2 text-xs transition-colors",
                location.pathname === ROUTES.shop
                  ? "bg-accent/20 font-semibold text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Shop
            </Link>
            <Separator className="my-1" />
            <span className="px-1 text-[10px] tracking-widest text-muted-foreground">Kategori</span>
            {rootCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                onClick={toggleMobileMenu}
                className={cn(
                  "block rounded-md px-1 py-2 text-xs transition-colors",
                  location.pathname === `/category/${cat.slug}`
                    ? "bg-accent/20 font-semibold text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  )
}

export default Navbar
