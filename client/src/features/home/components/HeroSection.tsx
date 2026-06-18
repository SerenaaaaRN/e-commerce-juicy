import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react"
import { useReducedMotion } from "motion/react"
import { ROUTES } from "@/constants/routes"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { editorialSpring, scrollSpring } from "@/lib/animations"

const CAMPAIGN_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
    title: "The Art of Pure Linen",
  },
  {
    image: "https://images.pexels.com/photos/5480696/pexels-photo-5480696.jpeg?auto=compress&cs=tinysrgb&w=1600",
    title: "Sculpted Silhouettes",
  },
  {
    image: "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1600",
    title: "Modern Minimalist",
  },
  {
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop",
    title: "Origin & Heritage",
  },
  {
    image: "https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=1600",
    title: "Raw Flax Textures",
  },
  {
    image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1600&auto=format&fit=crop",
    title: "Timeless Tailoring",
  },
  {
    image: "https://images.pexels.com/photos/3775168/pexels-photo-3775168.jpeg?auto=compress&cs=tinysrgb&w=1600",
    title: "Effortless Elegance",
  },
]

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAMPAIGN_SLIDES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, scrollSpring)

  const imageScale = useTransform(smoothProgress, [0, 1], [1.05, 0.95])
  const imageY = useTransform(smoothProgress, [0, 1], ["0%", "-28%"])
  const titleOpacity = useTransform(smoothProgress, [0, 0.3, 0.5], [1, 0.5, 0])
  const titleX = useTransform(smoothProgress, [0, 0.3, 0.5], ["0%", "-5%", "-15%"])
  const ghostOpacity = useTransform(smoothProgress, [0.3, 0.7, 1], [0, 0.04, 0.07])
  const ghostScale = useTransform(smoothProgress, [0.3, 0.7, 1], [0.8, 1, 1.1])
  const overlayOpacity = useTransform(smoothProgress, [0, 0.3, 1], [1, 0.8, 0.6])

  const titleWords = CAMPAIGN_SLIDES[currentSlide].title.split(" ")

  return (
    <section ref={sectionRef} data-section="hero" className="relative h-[200dvh]">
      {/* Sticky container — stays in viewport while scrolling through the section */}
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden bg-black">
        {/* Giant ghost "JUICY" text */}
        <motion.span
          className="pointer-events-none absolute inset-0 z-5 flex items-center justify-center select-none"
          style={{
            opacity: prefersReduced ? 0 : ghostOpacity,
            scale: prefersReduced ? 1 : ghostScale,
          }}
        >
          <span className="font-heading text-[20dvw] leading-none font-extrabold tracking-tighter text-white/10">
            JUICY
          </span>
        </motion.span>

        {/* Background image — taller than viewport for real parallax pan */}
        <motion.div
          style={{
            scale: prefersReduced ? 1 : imageScale,
            y: prefersReduced ? 0 : imageY,
          }}
          className="absolute top-0 left-0 z-0 h-[130%] w-full overflow-hidden"
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <img
                src={CAMPAIGN_SLIDES[currentSlide].image}
                alt={CAMPAIGN_SLIDES[currentSlide].title}
                className="size-full object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Cinematic overlays */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          style={{ opacity: prefersReduced ? 1 : overlayOpacity }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-black/10" />
        </motion.div>

        {/* Main content */}
        <div className="relative z-20 container mx-auto max-w-7xl px-4 text-left sm:px-6 lg:px-8">
          <motion.div
            className="flex max-w-xl flex-col gap-7"
            style={{ opacity: prefersReduced ? 1 : titleOpacity, x: prefersReduced ? 0 : titleX }}
          >
            {/* Campaign tag */}
            <motion.div
              key={`tag-${currentSlide}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 select-none"
            >
              <span className="size-1 rotate-45 bg-(--color-gold)" />
              <span className="font-mono text-[9px] font-bold tracking-[0.4em] text-(--color-gold) uppercase">
                Campaign Vol. I
              </span>
              <Separator className="h-px w-8 bg-white/8" />
            </motion.div>

            {/* Editorial title — split word reveal */}
            <h1 className="font-heading text-4xl leading-[0.95] font-bold tracking-tight text-white uppercase sm:text-5xl lg:text-7xl">
              {titleWords.map((word, i) => (
                <span key={`${currentSlide}-${i}`} className="inline-block overflow-hidden">
                  <motion.span
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{
                      ...editorialSpring,
                      delay: 0.3 + i * 0.08,
                    }}
                    className="inline-block"
                  >
                    {word}
                    {i < titleWords.length - 1 ? "\u00A0" : ""}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Narrative */}
            <motion.p
              key={`desc-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xs text-[11px] leading-relaxed tracking-[0.2em] text-white/40 uppercase sm:text-xs"
            >
              Unstructured luxury garments tailored from premium flax fibers for effortless elegance.
            </motion.p>

            {/* CTA suite */}
            <motion.div
              key={`cta-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-3 pt-2 sm:flex-row"
            >
              <Button
                asChild
                variant="luxury"
                className="h-auto bg-(--color-gold) px-8 py-4.5 text-foreground hover:bg-transparent hover:text-(--color-gold)"
              >
                <Link to={ROUTES.shop}>Explore Shop</Link>
              </Button>
              <Button asChild variant="luxury" className="h-auto px-8 py-4.5">
                <a href="#featured">View Collection</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom pagination */}
        <div className="absolute right-8 bottom-8 z-20 hidden items-center gap-6 font-mono select-none md:flex">
          <motion.div
            key={`counter-${currentSlide}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-baseline gap-1"
          >
            <span className="text-xs font-bold text-white">{(currentSlide + 1).toString().padStart(2, "0")}</span>
            <span className="text-[9px] text-white/30">/</span>
            <span className="text-[9px] text-white/30">{CAMPAIGN_SLIDES.length.toString().padStart(2, "0")}</span>
          </motion.div>

          <div className="flex gap-1.5">
            {CAMPAIGN_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  "h-0.5 cursor-pointer transition-all duration-700",
                  index === currentSlide ? "w-8 bg-(--color-gold)" : "w-3 bg-white/15 hover:bg-white/30"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom gold accent line */}
        <Separator className="absolute right-0 bottom-0 left-0 z-20 h-px bg-linear-to-r from-transparent via-(--color-gold) to-transparent" />
      </div>
    </section>
  )
}

export default HeroSection
