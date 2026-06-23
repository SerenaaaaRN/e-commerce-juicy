import { useState, useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Search, ShoppingBag, Menu, X, User, LogOut } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { MiniCart } from "./mini-cart"
import { useCartStore } from "@/stores/cartStore"
import { useCustomerAuthStore } from "@/stores/customerAuthStore"
import { cn } from "@/lib/utils"

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const { pathname } = useLocation()
  const navigate = useNavigate()

  const itemCount = useCartStore((s) => s.getItemCount())
  const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated)
  const logout = useCustomerAuthStore((s) => s.logout)

  const isHome = pathname === "/"
  const scrolled = isScrolled || !isHome

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const prevPathnameRef = useRef(pathname)
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname
      setIsMenuOpen(false)
    }
  }, [pathname])

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false)
      }
    }
    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isSearchOpen])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/heritage", label: "Heritage" },
  ]

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
        <nav className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "-ml-2 p-2 transition-colors duration-500 lg:hidden",
                scrolled ? "text-foreground" : "text-foreground"
              )}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5 stroke-[1.5]" /> : <Menu className="h-5 w-5 stroke-[1.5]" />}
            </button>

            {/* Desktop navigation */}
            <div className="hidden items-center gap-12 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-sm tracking-[0.2em] uppercase transition-colors duration-500",
                    pathname === link.href
                      ? scrolled
                        ? "text-foreground"
                        : "text-foreground"
                      : scrolled
                        ? "text-foreground/60 hover:text-foreground"
                        : "text-foreground/70 hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Logo */}
            <Link
              to="/"
              className={cn(
                "absolute left-1/2 -translate-x-1/2 font-serif text-xl tracking-[0.3em] uppercase transition-colors duration-500 lg:text-2xl",
                scrolled ? "text-foreground" : "text-foreground"
              )}
            >
              Maison
            </Link>

            {/* Right icons */}
            <div className="flex items-center gap-2 lg:gap-4">
              <div ref={searchContainerRef} className="relative flex items-center">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 200, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <form onSubmit={handleSearchSubmit}>
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search..."
                          className={cn(
                            "w-full border-b bg-transparent py-1 pr-2 text-sm transition-colors duration-500 outline-none",
                            scrolled || !isHome
                              ? "border-foreground/30 text-foreground placeholder:text-foreground/50"
                              : "border-foreground/30 text-foreground placeholder:text-foreground/50"
                          )}
                        />
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  aria-label="Search"
                  className={cn("p-2 transition-colors duration-500", scrolled ? "text-foreground" : "text-foreground")}
                >
                  {isSearchOpen ? <X className="h-5 w-5 stroke-[1.5]" /> : <Search className="h-5 w-5 stroke-[1.5]" />}
                </button>
              </div>

              <Link
                to={isAuthenticated ? "/account/profile" : "/login"}
                aria-label="Account"
                className={cn(
                  "hidden p-2 transition-colors duration-500 sm:block",
                  scrolled ? "text-foreground" : "text-foreground"
                )}
              >
                <User className="h-5 w-5 stroke-[1.5]" />
              </Link>

              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout()
                    navigate("/")
                  }}
                  aria-label="Logout"
                  className={cn(
                    "hidden p-2 transition-colors duration-500 sm:block",
                    scrolled ? "text-foreground" : "text-foreground"
                  )}
                >
                  <LogOut className="h-5 w-5 stroke-[1.5]" />
                </button>
              )}

              <button
                onClick={() => setIsCartOpen(true)}
                aria-label="Shopping cart"
                className={cn(
                  "relative -mr-2 p-2 transition-colors duration-500",
                  scrolled ? "text-foreground" : "text-foreground"
                )}
              >
                <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
                <span
                  className={cn(
                    "absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center text-[10px] transition-colors duration-500",
                    scrolled ? "bg-foreground text-background" : "bg-foreground text-background"
                  )}
                >
                  {itemCount}
                </span>
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-foreground/20 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-border bg-background lg:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-border px-6">
                <span className="font-serif text-lg tracking-[0.2em] uppercase">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="-mr-2 p-2" aria-label="Close menu">
                  <X className="h-5 w-5 stroke-[1.5]" />
                </button>
              </div>
              <nav className="flex flex-col gap-6 px-6 py-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      "text-lg tracking-[0.15em] uppercase transition-colors",
                      pathname === link.href ? "text-foreground" : "text-foreground/60 hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-2 border-t border-border pt-6">
                  <p className="mb-4 text-xs tracking-[0.15em] text-muted-foreground uppercase">Account</p>
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/account/profile"
                        className="mb-4 block text-lg tracking-[0.15em] text-foreground/60 uppercase transition-colors hover:text-foreground"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/account/orders"
                        className="mb-4 block text-lg tracking-[0.15em] text-foreground/60 uppercase transition-colors hover:text-foreground"
                      >
                        Orders
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          navigate("/")
                        }}
                        className="block w-full text-left text-lg tracking-[0.15em] text-red-600/70 uppercase transition-colors hover:text-red-600"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="block text-lg tracking-[0.15em] text-foreground/60 uppercase transition-colors hover:text-foreground"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mini cart */}
      <MiniCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
