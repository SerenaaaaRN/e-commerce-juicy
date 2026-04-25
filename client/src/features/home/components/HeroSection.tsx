import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
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
    <section className="relative w-full h-[75vh] min-h-[550px] lg:h-[82vh] overflow-hidden flex items-center border-b border-foreground/5 bg-zinc-50">
      {/* Background Slideshow - Unfiltered, organic and bright from multiple CDNs */}
      <div className="absolute inset-0 z-0">
        {CAMPAIGN_SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out transform ${
              index === currentSlide 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-105 pointer-events-none"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center filter brightness-[0.98]"
            />
          </div>
        ))}
      </div>

      {/* Subtle, soft light gradient mask on the left for maximum text contrast without blocking the image */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/45 via-white/10 to-transparent z-10 pointer-events-none" />

      {/* Clean, Minimalist Typography overlay */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20 text-left">
        <div className="max-w-xl flex flex-col gap-6 text-foreground">
          
          {/* Campaign Tag */}
          <div className="flex items-center gap-3 select-none">
            <span className="h-px w-6 bg-foreground/60" />
            <span className="text-[9px] font-bold tracking-[0.4em] text-foreground/80 uppercase animate-pulse">
              Campaign Vol. I
            </span>
          </div>

          {/* Clean, Large Editorial Title */}
          <div className="flex flex-col gap-2">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wide uppercase leading-[1.08] text-foreground transition-all duration-700">
              {CAMPAIGN_SLIDES[currentSlide].title}
            </h1>
          </div>

          {/* Narrative */}
          <p className="text-[11px] sm:text-xs text-muted-foreground uppercase tracking-widest leading-relaxed max-w-xs">
            Unstructured luxury garments tailored from premium flax fibers for effortless elegance.
          </p>

          {/* Premium Sharp-Edge Action Suite */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button asChild className="font-bold uppercase tracking-widest text-[9px] px-8 py-4.5 h-auto rounded-none border border-foreground bg-foreground text-background hover:bg-transparent hover:text-foreground transition-all duration-300 cursor-pointer">
              <Link to="/shop" className="flex items-center gap-1.5">
                Explore Shop
                <HugeiconsIcon icon={ArrowUpRight01Icon} strokeWidth={2.2} className="size-3" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="font-bold uppercase tracking-widest text-[9px] px-8 py-4.5 h-auto rounded-none border border-foreground/20 text-foreground hover:bg-foreground hover:text-background transition-all duration-300 cursor-pointer bg-transparent">
              <a href="#featured">View Collection</a>
            </Button>
          </div>

        </div>
      </div>

      {/* Minimalist Bottom Right Pagination */}
      <div className="absolute bottom-8 right-8 z-20 flex items-center gap-6 select-none text-foreground hidden md:flex font-mono">
        <div className="flex items-baseline gap-1">
          <span className="text-xs font-bold text-foreground">
            {(currentSlide + 1).toString().padStart(2, "0")}
          </span>
          <span className="text-[9px] text-muted-foreground">/</span>
          <span className="text-[9px] text-muted-foreground">
            {CAMPAIGN_SLIDES.length.toString().padStart(2, "0")}
          </span>
        </div>

        <div className="flex gap-1.5">
          {CAMPAIGN_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-0.5 cursor-pointer transition-all duration-500 rounded-none ${
                index === currentSlide ? "w-6 bg-foreground" : "w-2 bg-foreground/20 hover:bg-foreground/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
