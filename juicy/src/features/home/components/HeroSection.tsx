import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-muted/30 py-12 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">

          {/* Typography Column */}
          <div className="flex flex-col gap-6 md:col-span-6 z-10 text-left">
            <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase block animate-in fade-in slide-in-from-left-4 duration-500">
              Juicy Atelier — Collection 01
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-wide text-foreground uppercase leading-[1.1] animate-in fade-in slide-in-from-left-4 duration-700">
              The Art of <br />
              <span className="text-primary">Pure Linen</span>
            </h1>
            <p className="text-sm text-muted-foreground uppercase tracking-widest leading-relaxed max-w-md animate-in fade-in slide-in-from-left-4 duration-900">
              A study of modern simplicity, premium silhouettes, and raw materials handcrafted for effortless luxury.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-left-4 duration-1000">
              <Button asChild className="font-medium uppercase tracking-widest text-xs px-8 py-6 h-auto transition-transform hover:scale-[1.02] duration-300">
                <Link to="/shop">Explore Shop</Link>
              </Button>
              <Button asChild variant="outline" className="font-medium uppercase tracking-widest text-xs ">
                <a href="#featured">View Collection</a>
              </Button>
            </div>
          </div>

          {/* Hero Editorial Image Column */}
          <div className="md:col-span-6 relative aspect-square md:aspect-[4/5] w-full overflow-hidden shadow-2xl rounded-none select-none group duration-1000">
            <img
              src="https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=1200&auto=format&fit=crop"
              alt="Editorial Linen Apparel Showcase"
              className="absolute inset-0 size-full object-cover transition-transform duration-[2000ms] ease-out "
            />
            {/* Elegant overlay frame border */}
            <div className="absolute inset-4 border border-white/20 pointer-events-none transition-all duration-500 group-hover:inset-6" />

            {/* Visual subtle details floating */}
            <div className="absolute bottom-6 right-6 bg-background/95 backdrop-blur-sm p-4 hidden lg:block text-left max-w-xs shadow-lg border-l-2 border-primary">
              <p className="text-[10px] font-bold tracking-widest uppercase">Pure Linen Trench</p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-1">100% Biodegradable Flax Fiber, Crafted in Indonesia.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default HeroSection
