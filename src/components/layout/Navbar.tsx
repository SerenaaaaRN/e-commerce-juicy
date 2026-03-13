import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { useCustomerAuthStore } from "@/stores/customerAuthStore";
import { ShoppingBag, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const { customer, logout } = useCustomerAuthStore();

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full bg-chalk/90 backdrop-blur-md border-b border-sand/30 font-dm-sans transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Navigation Menu */}
        <nav className="hidden md:flex items-center gap-8 w-1/3">
          <Link
            to="/collection"
            className="text-xs font-semibold uppercase tracking-widest text-soil hover:text-terracotta transition-colors duration-300"
          >
            Shop All
          </Link>
          <Link
            to="/collection?category=dresses"
            className="text-xs font-semibold uppercase tracking-widest text-soil hover:text-terracotta transition-colors duration-300"
          >
            Dresses
          </Link>
          <Link
            to="/collection?category=accessories"
            className="text-xs font-semibold uppercase tracking-widest text-soil hover:text-terracotta transition-colors duration-300"
          >
            Accessories
          </Link>
        </nav>

        {/* Mobile Menu Icon (Left aligned on mobile) */}
        <div className="flex md:hidden w-1/3">
          <button
            onClick={toggleMobileMenu}
            className="text-soil hover:text-terracotta transition-colors duration-300 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Center: Brand Typography */}
        <div className="w-1/3 flex justify-center">
          <Link
            to="/"
            className="font-playfair text-2xl sm:text-3xl font-semibold tracking-[0.25em] text-soil hover:opacity-90 transition-opacity duration-300 leading-none select-none"
          >
            J U I C Y
          </Link>
        </div>

        {/* Right: Cart & Auth */}
        <div className="w-1/3 flex items-center justify-end gap-3 sm:gap-6">
          {customer ? (
            <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-soil">
              <Link to="/profile" className="flex items-center gap-1.5 hover:text-terracotta transition-colors">
                <User className="size-4 text-dust" />
                <span>{customer.full_name.split(" ")[0]}</span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 hover:text-terracotta transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="size-4 text-dust" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-soil hover:text-terracotta transition-colors"
            >
              <User className="size-4" />
              <span>Login</span>
            </Link>
          )}

          {/* Simple auth trigger icon for mobile screen sizing */}
          {!customer && (
            <Link to="/login" className="sm:hidden text-soil hover:text-terracotta">
              <User className="size-5" />
            </Link>
          )}
          {customer && (
            <Link to="/profile" className="sm:hidden text-soil hover:text-terracotta">
              <User className="size-5" />
            </Link>
          )}

          {/* Cart Icon trigger */}
          <Link
            to="/cart"
            className="relative p-1.5 text-soil hover:text-terracotta transition-colors duration-300"
            aria-label="View Cart"
          >
            <ShoppingBag className="size-5 stroke-[1.5]" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-terracotta text-chalk text-[9px] font-bold size-5 rounded-full flex items-center justify-center animate-bounce">
                {totalCartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-chalk border-b border-sand/40 z-40 py-6 px-4 animate-fade-in font-dm-sans">
          <div className="flex flex-col gap-4">
            <Link
              to="/collection"
              onClick={toggleMobileMenu}
              className="text-sm font-semibold uppercase tracking-widest text-soil py-2 border-b border-sand/10"
            >
              Shop All
            </Link>
            <Link
              to="/collection?category=dresses"
              onClick={toggleMobileMenu}
              className="text-sm font-semibold uppercase tracking-widest text-soil py-2 border-b border-sand/10"
            >
              Dresses
            </Link>
            <Link
              to="/collection?category=accessories"
              onClick={toggleMobileMenu}
              className="text-sm font-semibold uppercase tracking-widest text-soil py-2 border-b border-sand/10"
            >
              Accessories
            </Link>
            {customer ? (
              <>
                <Link
                  to="/profile"
                  onClick={toggleMobileMenu}
                  className="text-sm font-semibold uppercase tracking-widest text-soil py-2 border-b border-sand/10"
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    toggleMobileMenu();
                  }}
                  className="text-left text-sm font-semibold uppercase tracking-widest text-terracotta py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={toggleMobileMenu}
                className="text-sm font-semibold uppercase tracking-widest text-soil py-2"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
