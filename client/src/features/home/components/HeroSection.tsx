import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/paths"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion } from "motion/react"
import { Link } from "react-router-dom"

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen">
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/fallback-hero.png"
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
    </section>
  )
}

export default HeroSection
