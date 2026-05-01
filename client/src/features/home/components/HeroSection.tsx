import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAMPAIGN_SLIDES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section
      data-section="hero"
      className="relative w-full h-[75vh] min-h-[550px] lg:h-[85vh] overflow-hidden flex items-center bg-black"
    >
      {/* Background slideshow */}
      <div className="absolute inset-0 z-0">
        {CAMPAIGN_SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-[1400ms] ease-out ${index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-[1.03] pointer-events-none"
              }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="size-full object-cover object-center"
            />
          </div>
        ))}
      </div>

      {/* Cinematic gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 z-10 pointer-events-none" />

      {/* Main content */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20 text-left">
        <div className="max-w-xl flex flex-col gap-7 gsap-reveal">

          {/* Campaign tag */}
          <div className="flex items-center gap-4 select-none">
            <span className="size-1 rotate-45 bg-[var(--color-gold)]" />
            <span className="text-[9px] font-bold tracking-[0.4em] text-[var(--color-gold)] uppercase font-mono">
              Campaign Vol. I
            </span>
            <Separator className="w-8 bg-white/[0.08] h-px" />
          </div>

          {/* Editorial title */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight uppercase leading-[0.95] text-white gsap-slide-up">
            {CAMPAIGN_SLIDES[currentSlide].title}
          </h1>

          {/* Narrative */}
          <p className="text-[11px] sm:text-xs text-white/40 uppercase tracking-[0.2em] leading-relaxed max-w-xs">
            Unstructured luxury garments tailored from premium flax fibers for effortless elegance.
          </p>

          {/* CTA suite */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button asChild variant="luxury" className="px-8 py-4.5 h-auto bg-[var(--color-gold)] text-foreground hover:bg-transparent hover:text-[var(--color-gold)]">
              <Link to="/shop">
                Explore Shop

              </Link>
            </Button>
            <Button asChild variant="luxury" className="px-8 py-4.5 h-auto">
              <a href="#featured">View Collection</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom pagination */}
      <div className="absolute bottom-8 right-8 z-20 hidden md:flex items-center gap-6 select-none font-mono">
        <div className="flex items-baseline gap-1">
          <span className="text-xs font-bold text-white">
            {(currentSlide + 1).toString().padStart(2, "0")}
          </span>
          <span className="text-[9px] text-white/30">/</span>
          <span className="text-[9px] text-white/30">
            {CAMPAIGN_SLIDES.length.toString().padStart(2, "0")}
          </span>
        </div>

        <div className="flex gap-1.5">
          {CAMPAIGN_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-[2px] cursor-pointer transition-all duration-700 ${index === currentSlide
                  ? "w-8 bg-[var(--color-gold)]"
                  : "w-3 bg-white/15 hover:bg-white/30"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom gold accent line */}
      <Separator className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent h-px" />
    </section>
  )
}

export default HeroSection
