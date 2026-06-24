import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/paths"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion } from "motion/react"
import { Link } from "react-router-dom"

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* hero background */}
      <div className="absolute inset-0 overflow-hidden bg-black">
        <img src="/fallback-hero.png" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-foreground/35" />
      </div>

      <div className="relative z-10 flex h-screen flex-col justify-end p-8 pb-24 lg:p-16 lg:pb-32">
        <div className="max-w-2xl">
          {/* Editorial Text Masking Reveal */}
          <h1 className="mb-6 font-serif text-4xl leading-none text-balance text-background md:text-5xl lg:text-7xl">
            <span className="block">
              {["The", "Art", "of"].map((word, idx) => (
                <span key={idx} className="mr-[0.25em] inline-block overflow-hidden pt-0.5 pb-1 last:mr-0">
                  <motion.span
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 1.2,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.3 + idx * 0.1,
                    }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </span>
            <span className="block">
              {["Quiet", "Luxury"].map((word, idx) => (
                <span key={idx} className="mr-[0.25em] inline-block overflow-hidden pt-0.5 pb-1.5 last:mr-0">
                  <motion.span
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 1.2,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.6 + idx * 0.1,
                    }}
                    className="inline-block text-primary"
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </span>
          </h1>

          {/* Staggered Fade-in-up for Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 max-w-md text-base leading-relaxed tracking-wide text-background/80 lg:text-lg"
          >
            Timeless pieces crafted with intention. Where heritage meets modern refinement.
          </motion.p>

          {/* Staggered Fade-in-up for CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <Button
              asChild
              size="lg"
              className="group rounded-none border border-transparent bg-background px-8 py-6 font-sans text-xs font-semibold tracking-[0.2em] text-foreground uppercase transition-all duration-500 hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Link to={ROUTES.shop}>
                Discover Collection
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
