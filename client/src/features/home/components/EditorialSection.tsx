import { Separator } from "@/components/ui/separator"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export const EditorialSection = () => {
  return (
    <section
      data-section="editorial"
      className="py-24 md:py-32 bg-background"
    >
      <Separator className="bg-gradient-to-r from-transparent via-border to-transparent h-px mb-24 md:mb-28" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Asymmetrical editorial layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Main campaign image */}
          <div className="lg:col-span-7 w-full select-none group gsap-reveal">
            <AspectRatio ratio={16 / 10} className="overflow-hidden bg-muted relative">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop"
                alt="Editorial Brand Lookbook Showcase"
                className="absolute inset-0 size-full object-cover transition-transform duration-[2500ms] ease-out group-hover:scale-[1.04]"
              />
              {/* Editorial frame — gold tinted on hover */}
              <div className="absolute inset-4 border border-white/15 pointer-events-none transition-all duration-700 group-hover:inset-6 group-hover:border-[var(--color-gold-muted)]" />
              {/* Cinematic vignette */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.2)_100%)] pointer-events-none" />
            </AspectRatio>
          </div>

          {/* Editorial copy */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left gsap-stagger-item">
            <div className="flex items-center gap-3">
              <span className="size-1 rotate-45 bg-[var(--color-gold)]" />
              <span className="text-[9px] font-bold tracking-[0.4em] text-[var(--color-gold)] uppercase font-mono">
                Atelier Philosophy
              </span>
            </div>

            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-[1.05]">
              Handcrafted for the<br />
              <span className="italic text-[var(--color-gold)]">Modern Nomad</span>
            </h2>

            <Separator className="w-12 bg-[var(--color-gold)] h-px" />

            <div className="flex flex-col gap-4 text-xs text-muted-foreground leading-relaxed tracking-wide">
              <p>
                Every garment begins in the fertile flax fields of Belgium and Northern France. We source only the highest grade long-staple flax fibers, woven by master weavers into breathable, high-density raw textures.
              </p>
              <p>
                Our designs reject mass trends, celebrating pure form, clean geometric cuts, and sharp edges. Handcrafted in low batches, we minimize manufacturing impact and nurture enduring pieces destined for lifetimes of narrative.
              </p>
            </div>

            {/* Metadata stats */}
            <div className="pt-5 grid grid-cols-2 gap-6">
              <Separator className="col-span-2 bg-border/30 h-px" />
              <div>
                <span className="block text-[10px] font-heading font-bold text-[var(--color-gold)] tracking-wider uppercase">
                  100% Raw Flax
                </span>
                <span className="text-[9px] text-muted-foreground/60 tracking-wide">
                  Certified European Fiber
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-heading font-bold text-[var(--color-gold)] tracking-wider uppercase">
                  Slow Batches
                </span>
                <span className="text-[9px] text-muted-foreground/60 tracking-wide">
                  Limited Curated Release
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default EditorialSection
