import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useCartStore } from "@/stores/cartStore"
import { useCustomerAuthStore } from "@/stores/customerAuthStore"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { HugeiconsIcon } from "@hugeicons/react"
import { ShoppingBag01Icon, UserIcon, Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"

export const Navbar = () => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const totalItems = useCartStore((state) => state.totalItems)()
  const { isAuthenticated, customer, logout } = useCustomerAuthStore()

  const navLinks = [
    { name: "Atelier", path: "/" },
    { name: "Shop", path: "/shop" },
  ]

  const activeLinkClass = "text-primary font-medium"
  const inactiveLinkClass = "text-muted-foreground hover:text-foreground transition-colors duration-200"

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Navigation Trigger */}
        <button
          onClick={toggleMobileMenu}
          className="flex p-2 text-foreground md:hidden"
          aria-label="Toggle Menu"
        >
          <HugeiconsIcon icon={mobileMenuOpen ? Cancel01Icon : Menu01Icon} strokeWidth={2} />
        </button>

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-heading text-2xl font-bold tracking-[0.25em] text-foreground hover:text-primary transition-colors duration-300">
            JUICY
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "relative py-2 text-xs transition-colors duration-200",
                location.pathname === link.path ? activeLinkClass : inactiveLinkClass
              )}
            >
              {link.name}
              {location.pathname === link.path && (
                <span className="absolute bottom-0 left-0 h-[2px] w-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* Cart Badge */}
          <Link to="/cart" className="relative p-2 text-foreground hover:text-primary transition-colors duration-200">
            <HugeiconsIcon icon={ShoppingBag01Icon} strokeWidth={1.8} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User Account Controls */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted p-2">
                  <HugeiconsIcon icon={UserIcon} strokeWidth={1.8} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <div className="flex flex-col px-3 py-2 text-xs">
                  <span className="font-semibold text-foreground truncate">{customer?.full_name}</span>
                  <span className="text-muted-foreground truncate">{customer?.email}</span>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="w-full cursor-pointer">Account Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders" className="w-full cursor-pointer">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted p-2">
                  <HugeiconsIcon icon={UserIcon} strokeWidth={1.8} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 mt-2">
                <DropdownMenuItem asChild>
                  <Link to="/login" className="w-full cursor-pointer">Log In</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/register" className="w-full cursor-pointer">Register</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background px-4 py-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <Separator className="mb-4" />
          <nav className="flex flex-col gap-4 uppercase tracking-widest text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={toggleMobileMenu}
                className={cn(
                  "py-2 px-1 text-xs rounded-md block transition-colors",
                  location.pathname === link.path 
                    ? "text-primary font-semibold bg-accent/20" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar
