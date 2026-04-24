import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export const CtaSection = () => {
  return (
    <section className="relative py-28 bg-muted/20 overflow-hidden">
      <Separator className="mb-28" />

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col gap-6">
        
        <span className="text-xs font-semibold tracking-wider text-primary uppercase">
          Seasonal Release
        </span>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight font-heading">
          Adorn Yourself in <br />
          <span className="text-primary">Artisanal Simplicity</span>
        </h2>
        
        <p className="text-base text-muted-foreground leading-relaxed max-w-lg mx-auto">
          Explore our collection of pure, breathable linens handcrafted to endure high-fashion trends. Shop today and experience luxurious slow fashion.
        </p>
        
        <div className="pt-2">
          <Button asChild size="lg">
            <Link to="/shop">Shop the Launch</Link>
          </Button>
        </div>

      </div>
    </section>
  )
}

export default CtaSection
