import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export const CtaSection = () => {
  return (
    <section className="relative py-28 bg-muted/20 overflow-hidden">
      <Separator className="mb-28" />
      {/* Curved background pattern elements */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center">
        <span className="font-['Space_Grotesk'] text-[15vw] font-bold tracking-[0.2em] text-primary select-none uppercase">
          JUICY
        </span>
      </div>

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col gap-6">
        
        <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase block">
          Seasonal Release
        </span>
        
        <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase tracking-wider text-foreground leading-tight">
          Adorn Yourself in <br />
          <span className="text-primary">Artisanal Simplicity</span>
        </h2>
        
        <p className="text-xs text-muted-foreground uppercase tracking-widest leading-relaxed max-w-lg mx-auto">
          Explore our collection of pure, breathable linens handcrafted to endure high-fashion trends. Shop today and experience luxurious slow fashion.
        </p>
        
        <div className="pt-4">
          <Button asChild className="font-medium uppercase tracking-widest text-xs px-10 py-6 h-auto transition-transform hover:scale-[1.02] duration-300">
            <Link to="/shop">Shop the Launch</Link>
          </Button>
        </div>

      </div>
    </section>
  )
}

export default CtaSection
