import { Separator } from "@/components/ui/separator"

export const EditorialSection = () => {
  return (
    <section className="py-24 bg-background">
      <Separator className="mb-24" />
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Asymmetrical layout row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Main Visual Campaign Image */}
          <div className="lg:col-span-7 relative aspect-[4/3] md:aspect-[16/10] w-full overflow-hidden bg-muted shadow-2xl rounded-none select-none group">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop"
              alt="Editorial Brand Lookbook Showcase"
              className="absolute inset-0 size-full object-cover transition-transform duration-[2500ms] ease-out group-hover:scale-105"
            />
            {/* Outer editorial frame */}
            <div className="absolute inset-4 border border-white/20 pointer-events-none transition-all duration-500 group-hover:inset-6" />
          </div>

          {/* Text/Editorial Copy column */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left">
            <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase block">
              Atelier Philosophy
            </span>

            <h2 className="font-heading text-3xl font-semibold uppercase tracking-wider text-foreground leading-[1.2]">
              Handcrafted for the Modern Nomad
            </h2>

            <Separator className="w-16" />

            <div className="flex flex-col gap-4 text-xs text-muted-foreground uppercase tracking-widest leading-relaxed">
              <p>
                Every garment begins in the fertile flax fields of Belgium and Northern France. We source only the highest grade long-staple flax fibers, woven by master weavers into breathable, high-density raw textures.
              </p>
              <p>
                Our designs reject mass trends, celebrating pure form, clean geometric cuts, and sharp edges. Handcrafted in low batches, we minimize manufacturing impact and nurture enduring pieces destined for lifetimes of narrative.
              </p>
            </div>

            {/* Interactive metadata details */}
            <div className="pt-4 grid grid-cols-2 gap-4 border-t uppercase tracking-wider">
              <div>
                <span className="block text-[11px] font-bold text-primary">100% RAW FLAX</span>
                <span className="text-[9px] text-muted-foreground">Certified European Fiber</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-primary">SLOW BATCHES</span>
                <span className="text-[9px] text-muted-foreground">Limited Curated Release</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}

export default EditorialSection
