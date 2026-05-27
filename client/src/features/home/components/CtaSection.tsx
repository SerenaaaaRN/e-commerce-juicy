import { Link } from "react-router-dom"
import { ROUTES } from "@/constants/routes"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export const CtaSection = () => {
  return (
    <section
      data-section="cta"
      className="relative py-28 md:py-40 bg-foreground overflow-hidden"
    >
      {/* Grain overlay */}
      <div className="absolute inset-0 bg-grain" />

      {/* Top gold accent */}
      <Separator className="absolute top-0 left-0 right-0 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent h-px" />

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 gsap-reveal">
        {/* Decorative diamond */}
        <span className="inline-block size-1.5 rotate-45 bg-[var(--color-gold)] mb-8" />

        <span className="text-[9px] font-bold tracking-[0.4em] text-[var(--color-gold)] uppercase block font-mono mb-6">
          Seasonal Release
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading tracking-tight text-background leading-[0.95] gsap-slide-up">
          <span className="font-extralight">Adorn Yourself in</span><br />
          <span className="font-bold text-[var(--color-gold)] italic mt-2 block">
            Artisanal Simplicity
          </span>
        </h2>

        <p className="text-sm md:text-base text-background/35 leading-relaxed max-w-lg mx-auto mt-8 tracking-wide">
          Explore our collection of pure, breathable linens handcrafted to endure high-fashion trends. Shop today and experience luxurious slow fashion.
        </p>

        <div className="mt-12">
          <Button
            asChild
            variant="luxury"
            size="lg"
            className="px-10 py-6"
          >
            <Link to={ROUTES.shop}>Shop the Launch</Link>
          </Button>
        </div>

        {/* Tagline micro-text */}
        <p className="text-[9px] tracking-[0.3em] text-background/15 uppercase mt-10 font-mono">
          Handcrafted · Premium · Timeless
        </p>
      </div>

      {/* Bottom gold accent */}
      <Separator className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent h-px" />
    </section>
  )
}

export default CtaSection
