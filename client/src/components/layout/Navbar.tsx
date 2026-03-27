import { Link, useLocation } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { useCustomerAuthStore } from "@/stores/customerAuthStore";
import { ShoppingBag, User, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const { customer, logout } = useCustomerAuthStore();
  const { pathname } = useLocation();

  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const solid = !isHome || scrolled;
  const textColor = solid ? "text-soil" : "text-chalk";
  const hoverColor = solid ? "hover:text-terracotta" : "hover:text-chalk";
  const iconColor = solid ? "text-dust" : "text-chalk/70";

  return (
    <header
      className={`font-dm-sans fixed top-0 z-50 w-full transition-all duration-500 ${
        solid
          ? "bg-chalk/90 border-sand/30 border-b backdrop-blur-md shadow-xs"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Navigation Menu */}
        <nav className="hidden w-1/3 items-center gap-8 md:flex">
          <Link
            to="/collection"
            className={`${textColor} ${hoverColor} text-[11px] font-semibold tracking-widest uppercase transition-colors duration-300`}
          >
            Catalog
          </Link>
          <Link
            to="/showroom"
            className={`${textColor} ${hoverColor} text-[11px] font-semibold tracking-widest uppercase transition-colors duration-300`}
          >
            Showroom
          </Link>

          <Link
            to="/materials"
            className={`${textColor} ${hoverColor} text-[11px] font-semibold tracking-widest uppercase transition-colors duration-300`}
          >
            Materials
          </Link>
          <Link
            to="/atelier"
            className={`${textColor} ${hoverColor} text-[11px] font-semibold tracking-widest uppercase transition-colors duration-300`}
          >
            Atelier
          </Link>
        </nav>

        {/* Mobile Menu Icon (Left aligned on mobile) */}
        <div className="flex w-1/3 md:hidden">
          <button
            onClick={toggleMobileMenu}
            className={`${textColor} ${hoverColor} transition-colors duration-300 focus:outline-none`}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Center: Brand Typography */}
        <div className="flex w-1/3 justify-center">
          <Link
            to="/"
            className={`font-playfair ${textColor} text-2xl leading-none font-semibold tracking-[0.25em] transition-all duration-500 select-none hover:opacity-90 sm:text-3xl`}
          >
            J U I C Y
          </Link>
        </div>

        {/* Right: Cart & Auth */}
        <div className="flex w-1/3 items-center justify-end gap-3 sm:gap-6">
          {customer ? (
            <div className={`${textColor} hidden items-center gap-4 text-xs font-medium sm:flex`}>
              <Link to="/profile" className={`${hoverColor} flex items-center gap-1.5 transition-colors`}>
                <User className={`${iconColor} size-4`} />
                <span>{customer.full_name.split(" ")[0]}</span>
              </Link>
              <button
                onClick={logout}
                className={`${hoverColor} flex cursor-pointer items-center gap-1.5 transition-colors`}
                title="Logout"
              >
                <LogOut className={`${iconColor} size-4`} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className={`${textColor} ${hoverColor} hidden items-center gap-1.5 text-xs font-semibold tracking-widest uppercase transition-colors sm:flex`}
            >
              <User className="size-4" />
              <span>Login</span>
            </Link>
          )}

          {!customer ? (
            <Link to="/login" className={`${textColor} ${hoverColor} sm:hidden`}>
              <User className="size-5" />
            </Link>
          ) : (
            <Link to="/profile" className={`${textColor} ${hoverColor} sm:hidden`}>
              <User className="size-5" />
            </Link>
          )}

          {/* Cart Icon trigger */}
          <Link
            to="/cart"
            className={`${textColor} ${hoverColor} relative p-1.5 transition-colors duration-300`}
            aria-label="View Cart"
          >
            <ShoppingBag className="size-5 stroke-[1.5]" />
            {totalCartCount > 0 && (
              <span className="bg-terracotta text-chalk absolute -top-1.5 -right-1.5 flex size-5 animate-bounce items-center justify-center rounded-full text-[9px] font-bold">
                {totalCartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="bg-chalk border-sand/40 animate-fade-in font-dm-sans absolute top-20 left-0 z-40 w-full border-b px-4 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            <Link
              to="/collection"
              onClick={toggleMobileMenu}
              className="text-soil border-sand/10 border-b py-2 text-sm font-semibold tracking-widest uppercase"
            >
              Catalog
            </Link>
            <Link
              to="/showroom"
              onClick={toggleMobileMenu}
              className="text-soil border-sand/10 border-b py-2 text-sm font-semibold tracking-widest uppercase"
            >
              Showroom
            </Link>

            <Link
              to="/materials"
              onClick={toggleMobileMenu}
              className="text-soil border-sand/10 border-b py-2 text-sm font-semibold tracking-widest uppercase"
            >
              Materials
            </Link>
            <Link
              to="/atelier"
              onClick={toggleMobileMenu}
              className="text-soil border-sand/10 border-b py-2 text-sm font-semibold tracking-widest uppercase"
            >
              Atelier
            </Link>
            {customer ? (
              <>
                <Link
                  to="/profile"
                  onClick={toggleMobileMenu}
                  className="text-soil border-sand/10 border-b py-2 text-sm font-semibold tracking-widest uppercase"
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    toggleMobileMenu();
                  }}
                  className="text-terracotta py-2 text-left text-sm font-semibold tracking-widest uppercase"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={toggleMobileMenu}
                className="text-soil py-2 text-sm font-semibold tracking-widest uppercase"
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
