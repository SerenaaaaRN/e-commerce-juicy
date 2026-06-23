import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { ROUTES } from "@/constants/routes"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"

export function HeroSection() {
  return (
    <section className="relative min-h-screen">
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/luxury-minimalist-fashion-model-in-elegant-dark-cl.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/hero-misty-mountains.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-foreground/30" />
      </div>

      <div className="relative z-10 flex h-screen flex-col justify-end p-8 pb-24 lg:p-16 lg:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <h1 className="mb-6 font-serif text-4xl leading-[1.1] text-balance text-background md:text-5xl lg:text-7xl">
            The Art of
            <br />
            Quiet Luxury
          </h1>
          <p className="mb-10 max-w-md text-base leading-relaxed tracking-wide text-background/80 lg:text-lg">
            Timeless pieces crafted with intention. Where heritage meets modern refinement.
          </p>

          <Button asChild size="lg" className="group bg-background text-foreground uppercase">
            <Link to={ROUTES.shop}>
              Discover Collection
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator - Style dari hero-section.tsx (kebab) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="h-12 w-px bg-background/50"
        />
      </motion.div>
    </section>
  )
}

export default HeroSection
