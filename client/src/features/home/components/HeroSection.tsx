import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/constants/routes"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

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
      className="relative flex h-[75vh] min-h-137.5 w-full items-center overflow-hidden bg-black lg:h-[85vh]"
    >
      {/* Background slideshow */}
      <div className="absolute inset-0 z-0">
        {CAMPAIGN_SLIDES.map((slide, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-all duration-1400 ease-out",
              index === currentSlide ? "scale-100 opacity-100" : "pointer-events-none scale-[1.03] opacity-0"
            )}
          >
            <img src={slide.image} alt={slide.title} className="size-full object-cover object-center" />
          </div>
        ))}
      </div>

      {/* Cinematic linear overlays */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-r from-black/60 via-black/20 to-transparent" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-black/50 via-transparent to-black/10" />

      {/* Main content */}
      <div className="relative z-20 container mx-auto max-w-7xl px-4 text-left sm:px-6 lg:px-8">
        <div className="gsap-reveal flex max-w-xl flex-col gap-7">
          {/* Campaign tag */}
          <div className="flex items-center gap-4 select-none">
            <span className="size-1 rotate-45 bg-(--color-gold)" />
            <span className="font-mono text-[9px] font-bold tracking-[0.4em] text-(--color-gold) uppercase">
              Campaign Vol. I
            </span>
            <Separator className="h-px w-8 bg-white/8" />
          </div>

          {/* Editorial title */}
          <h1 className="gsap-slide-up font-heading text-4xl leading-[0.95] font-bold tracking-tight text-white uppercase sm:text-5xl lg:text-7xl">
            {CAMPAIGN_SLIDES[currentSlide].title}
          </h1>

          {/* Narrative */}
          <p className="max-w-xs text-[11px] leading-relaxed tracking-[0.2em] text-white/40 uppercase sm:text-xs">
            Unstructured luxury garments tailored from premium flax fibers for effortless elegance.
          </p>

          {/* CTA suite */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
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
          </div>
        </div>
      </div>

      {/* Bottom pagination */}
      <div className="absolute right-8 bottom-8 z-20 hidden items-center gap-6 font-mono select-none md:flex">
        <div className="flex items-baseline gap-1">
          <span className="text-xs font-bold text-white">{(currentSlide + 1).toString().padStart(2, "0")}</span>
          <span className="text-[9px] text-white/30">/</span>
          <span className="text-[9px] text-white/30">{CAMPAIGN_SLIDES.length.toString().padStart(2, "0")}</span>
        </div>

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
    </section>
  )
}

export default HeroSection
