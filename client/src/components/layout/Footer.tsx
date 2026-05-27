import { Link } from "react-router-dom"
import { ROUTES } from "@/constants/routes"
import { Separator } from "@/components/ui/separator"

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background text-foreground py-16">
      <Separator className="mb-16" />
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 pb-12">
          
          {/* Brand Intro Column */}
          <div className="flex flex-col gap-4 md:col-span-1">
            <span className="font-heading text-2xl font-bold tracking-[0.25em] text-primary">
              JUICY
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs uppercase tracking-wider">
              An editorial pursuit of pure linen, high-fashion silhouettes, and sustainable artisan apparel. Built for the modern nomad.
            </p>
          </div>

          {/* Collections Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-primary">
              Collections
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-muted-foreground uppercase tracking-widest">
              <li>
                <Link to={`${ROUTES.shop}?category=tops`} className="hover:text-foreground transition-colors duration-200">Tops</Link>
              </li>
              <li>
                <Link to={`${ROUTES.shop}?category=dresses`} className="hover:text-foreground transition-colors duration-200">Dresses</Link>
              </li>
              <li>
                <Link to={`${ROUTES.shop}?category=sets`} className="hover:text-foreground transition-colors duration-200">Sets</Link>
              </li>
              <li>
                <Link to={`${ROUTES.shop}?category=accessories`} className="hover:text-foreground transition-colors duration-200">Accessories</Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-primary">
              Atelier Support
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-muted-foreground uppercase tracking-widest">
              <li>
                <span className="hover:text-foreground cursor-pointer transition-colors duration-200">Shipping & Returns</span>
              </li>
              <li>
                <span className="hover:text-foreground cursor-pointer transition-colors duration-200">Sizing Guide</span>
              </li>
              <li>
                <span className="hover:text-foreground cursor-pointer transition-colors duration-200">Care Guidelines</span>
              </li>
              <li>
                <span className="hover:text-foreground cursor-pointer transition-colors duration-200">Contact Atelier</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Journal Subscription
            </h4>
            <p className="text-xs text-muted-foreground uppercase tracking-wider leading-relaxed">
              Sign up to receive early editorial launch invites, seasonal lookbooks, and exclusive atelier restock alerts.
            </p>
            <div className="flex max-w-sm items-center gap-2 border-b border-foreground/20 pb-1">
              <input
                type="email"
                placeholder="ENTER YOUR EMAIL"
                className="w-full bg-transparent border-none text-xs tracking-widest placeholder:text-muted-foreground focus:outline-none"
              />
              <button className="text-xs font-semibold tracking-widest text-primary hover:text-foreground transition-colors duration-200">
                JOIN
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Rights Bar */}
        <Separator className="my-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest gap-4">
          <p>© {currentYear} JUICY ATELIER. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <span className="hover:text-foreground cursor-pointer">PRIVACY POLICY</span>
            <span className="hover:text-foreground cursor-pointer">TERMS OF SERVICE</span>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
