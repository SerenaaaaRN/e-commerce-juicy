import { Separator } from "@/components/ui/separator"
import { ROUTES } from "@/constants/paths"
import { Facebook01Icon, InstagramIcon, TwitterIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion } from "motion/react"
import { Link } from "react-router-dom"

const footerLinks = {
  shop: [
    { label: "Apparel", href: `${ROUTES.shop}?category=apparel&page=1` },
    { label: "Dresses", href: `${ROUTES.shop}?category=bags&page=1` },
    { label: "Bags", href: `${ROUTES.shop}?category=shoes&page=1` },
    { label: "Shoes", href: `${ROUTES.shop}?category=accessories` },
    { label: "Accessories", href: `${ROUTES.shop}?` },
  ],
  about: [
    { label: "Our Heritage", href: `${ROUTES.heritage}` },
    { label: "Craftsmanship", href: `${ROUTES.heritage}` },
    { label: "Sustainability", href: `${ROUTES.heritage}` },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        {/* Main footer content */}
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-2 lg:gap-8">
          {/* Brand Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <span className="mb-6 block font-heading text-2xl font-bold tracking-[0.25em] text-primary">JUICY</span>
            <p className="mb-6 text-sm leading-relaxed tracking-wider text-background/60 uppercase">
              An editorial pursuit of pure linen and high-fashion silhouettes. Built for the modern nomad.
            </p>
            <div className="flex items-center gap-4">
              <Link to="https://instagram.com" className="transition-opacity hover:opacity-60" aria-label="Instagram">
                <HugeiconsIcon icon={InstagramIcon} className="h-5 w-5 stroke-[1.5]" />
              </Link>
              <Link to="https://facebook.com" className="transition-opacity hover:opacity-60" aria-label="Facebook">
                <HugeiconsIcon icon={Facebook01Icon} className="h-5 w-5 stroke-[1.5]" />
              </Link>
              <Link to="https://twitter.com" className="transition-opacity hover:opacity-60" aria-label="Twitter">
                <HugeiconsIcon icon={TwitterIcon} className="h-5 w-5 stroke-[1.5]" />
              </Link>
            </div>
          </motion.div>

          {/* Shop links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="mb-6 text-xs tracking-[0.2em] text-background/60 uppercase">Collections</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-background/80 transition-colors hover:text-background">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <Separator className="mb-8 bg-background/20" />
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] tracking-widest text-background/50 uppercase">
            <span>© {currentYear} JUICY ATELIER. ALL RIGHTS RESERVED.</span>
            <Link to="/privacy" className="transition-colors hover:text-background/80">
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-background/80">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
