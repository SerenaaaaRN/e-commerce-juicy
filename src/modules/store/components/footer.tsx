import Link from "next/link";
import { Facebook, Instagram, ShoppingBag, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="px-4 md:px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* BRAND SECTION */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <ShoppingBag className="h-6 w-6" />
              <span>TokoSerena</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Platform belanja modern untuk kebutuhan harianmu. Belanja mudah, cepat, dan terpercaya.
            </p>
          </div>

          {/* HELP LINKS */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Bantuan</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary">
                  Cara Belanja
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Pengiriman
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Pengembalian
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPANY LINKS */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Tentang Kami</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary">
                  Karir
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>

          {/* SOCIALS */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Ikuti Kami</h3>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TokoSerena. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
