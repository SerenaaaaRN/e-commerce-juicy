import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { ROUTES } from "@/constants/routes"
import { Separator } from "@/components/ui/separator"
import { HugeiconsIcon } from "@hugeicons/react"
import { InstagramIcon, Facebook01Icon, TwitterIcon } from "@hugeicons/core-free-icons"

const footerLinks = {
  shop: [
    { label: "Tops", href: `${ROUTES.shop}?category=tops` },
    { label: "Dresses", href: `${ROUTES.shop}?category=dresses` },
    { label: "Sets", href: `${ROUTES.shop}?category=sets` },
    { label: "Accessories", href: `${ROUTES.shop}?category=accessories` },
  ],
  about: [
    { label: "Our Heritage", href: "/heritage" },
    { label: "Craftsmanship", href: "/craftsmanship" },
    { label: "Sustainability", href: "/sustainability" },
  ],
  support: [
    { label: "Shipping & Returns", href: "/shipping" },
    { label: "Sizing Guide", href: "/size-guide" },
    { label: "Care Guidelines", href: "/care" },
    { label: "Contact Atelier", href: "/contact" },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        {/* Main footer content */}
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
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
              <a href="https://instagram.com" className="transition-opacity hover:opacity-60" aria-label="Instagram">
                <HugeiconsIcon icon={InstagramIcon} className="h-5 w-5 stroke-[1.5]" />
              </a>
              <a href="https://facebook.com" className="transition-opacity hover:opacity-60" aria-label="Facebook">
                <HugeiconsIcon icon={Facebook01Icon} className="h-5 w-5 stroke-[1.5]" />
              </a>
              <a href="https://twitter.com" className="transition-opacity hover:opacity-60" aria-label="Twitter">
                <HugeiconsIcon icon={TwitterIcon} className="h-5 w-5 stroke-[1.5]" />
              </a>
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

          {/* Support links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="mb-6 text-xs tracking-[0.2em] text-background/60 uppercase">Atelier Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
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
