import { useState } from "react"
import { motion } from "motion/react"
import { Link } from "react-router-dom"
import { HugeiconsIcon } from "@hugeicons/react"
import { InstagramIcon, Facebook01Icon, TwitterIcon } from "@hugeicons/core-free-icons"
import { useSubscribeNewsletter } from "@/hooks/useSettingsQueries"
import { useToast } from "@/hooks/useToast"

const footerLinks = {
  shop: [
    { label: "New Arrivals", href: "/shop/new" },
    { label: "Women", href: "/shop/women" },
    { label: "Men", href: "/shop/men" },
    { label: "Accessories", href: "/shop/accessories" },
    { label: "Timepieces", href: "/shop/timepieces" },
  ],
  about: [
    { label: "Our Heritage", href: "/heritage" },
    { label: "Craftsmanship", href: "/craftsmanship" },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Careers", href: "/careers" },
  ],
  support: [
    { label: "Contact Us", href: "/contact" },
    { label: "Shipping & Returns", href: "/shipping" },
    { label: "Size Guide", href: "/size-guide" },
    { label: "Care Instructions", href: "/care" },
  ],
}

export function PremiumFooter() {
  const [email, setEmail] = useState("")
  const subscribeMutation = useSubscribeNewsletter()
  const { toast } = useToast()

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    try {
      await subscribeMutation.mutateAsync(email)
      toast({
        title: "Successfully Subscribed",
        description: "Thank you for subscribing to our newsletter.",
      })
      setEmail("")
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        {/* Main footer content */}
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <h3 className="mb-4 font-serif text-xl">Stay Connected</h3>
            <p className="mb-6 text-sm leading-relaxed text-background/60">
              Subscribe for exclusive access to new collections and private events.
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full border-0 border-b border-background/30 bg-transparent py-3 text-sm transition-colors placeholder:text-background/40 focus:border-background focus:outline-none"
              />
              <button
                type="submit"
                disabled={subscribeMutation.isPending}
                className="absolute top-1/2 right-0 -translate-y-1/2 text-xs tracking-[0.15em] uppercase transition-opacity hover:opacity-60 disabled:opacity-50"
              >
                {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </motion.div>

          {/* Shop links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="mb-6 text-xs tracking-[0.2em] text-background/60 uppercase">Shop</h4>
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

          {/* About links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="mb-6 text-xs tracking-[0.2em] text-background/60 uppercase">About</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
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
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="mb-6 text-xs tracking-[0.2em] text-background/60 uppercase">Support</h4>
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
        <div className="flex flex-col items-center justify-between gap-6 border-t border-background/20 pt-8 md:flex-row">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-serif text-lg tracking-[0.3em] uppercase">
              JUICY
            </Link>
            <div className="flex items-center gap-4">
              <a href="https://instagram.com" className="transition-opacity hover:opacity-60" aria-label="Instagram">
                <HugeiconsIcon icon={InstagramIcon} className="h-4 w-4 stroke-[1.5]" />
              </a>
              <a href="https://facebook.com" className="transition-opacity hover:opacity-60" aria-label="Facebook">
                <HugeiconsIcon icon={Facebook01Icon} className="h-4 w-4 stroke-[1.5]" />
              </a>
              <a href="https://twitter.com" className="transition-opacity hover:opacity-60" aria-label="Twitter">
                <HugeiconsIcon icon={TwitterIcon} className="h-4 w-4 stroke-[1.5]" />
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-background/50">
            <Link to="/privacy" className="transition-colors hover:text-background/80">
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-background/80">
              Terms of Service
            </Link>
            <span>© 2026 JUICY. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
