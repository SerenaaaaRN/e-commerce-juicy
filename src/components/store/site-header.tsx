import Link from "next/link";
import { ShoppingCart, Search, Menu } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/atoms/sheet";
import { getCart } from "@/lib/cart";
import { Badge } from "../atoms/badge";

export async function SiteHeader() {
  const cart = await getCart();
  const cartCount = cart?.cart_items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center mx-auto px-4">
        {/* MOBILE MENU */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <div className="flex flex-col gap-4 mt-8">
              <Link href="/" className="font-bold">
                Home
              </Link>
              <Link href="/products" className="font-bold">
                All Products
              </Link>
              <Link href="/categories" className="font-bold">
                Categories
              </Link>
            </div>
          </SheetContent>
        </Sheet>

        {/* LOGO */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block text-xl">
              JUICY<span className="text-blue-600">.</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/products" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Products
            </Link>
            <Link href="/categories" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Categories
            </Link>
          </nav>
        </div>

        {/* KANAN: Search & Cart */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="h-9 md:w-[200px] lg:w-[300px] pl-8" />
            </div>
          </div>

          {/* Cart Icon dengan Badge */}
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>

              {/* Render Badge jika ada item */}
              {cartCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-[11px]"
                >
                  {cartCount}
                </Badge>
              )}
            </Link>
          </Button>

          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Admin</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
