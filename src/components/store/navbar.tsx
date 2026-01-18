import Link from "next/link";
import { Menu, Search, ShoppingBag, User } from "lucide-react";

import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/atoms/sheet";

const Navbar = () => {
  const routes = [
    { href: "/", label: "Home" },
    { href: "/catalog", label: "Catalog" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* MOBILE MENU (SHEET) */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <nav className="grid gap-6 text-lg font-medium mt-6">
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                <ShoppingBag className="h-6 w-6" />
                <span>TokoSerena</span>
              </Link>
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="hover:text-foreground/80 text-foreground/60 transition-colors"
                >
                  {route.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* LOGO DESKTOP */}
        <Link href="/" className="mr-6 hidden md:flex items-center gap-2 font-bold text-xl">
          <ShoppingBag className="h-6 w-6" />
          <span>TokoSerena</span>
        </Link>

        {/* NAVIGATION DESKTOP */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {route.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center ml-auto gap-2 md:gap-4">
          <form className="hidden sm:flex-1 sm:flex sm:w-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 sm:w-75 md:w-50 lg:w-75"
              />
            </div>
          </form>

          <Button variant="ghost" size="icon" aria-label="Shopping Cart">
            <ShoppingBag className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>

          <Button variant="ghost" size="icon" aria-label="User Account">
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
