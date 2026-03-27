import { useEffect } from "react";
import { initLenis } from "@/lib/lenis";
import { Sparkles, Scissors, Sun, Compass } from "lucide-react";
import { TextRoll } from "@/components/ui/TextRoll";
import { AsymmetricParallaxSection } from "@/components/animations/AsymmetricParallaxSection";

export const AtelierPage = () => {
  useEffect(() => {
    const lenis = initLenis();
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  }, []);

  return (
    <div className="bg-background min-h-screen py-16 sm:py-24 font-dm-sans text-soil transition-all duration-300">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-terracotta block mb-3">
            Our Origin Story
          </span>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-normal text-soil leading-tight select-none">
            <TextRoll text="The Atelier" />
          </h1>
          <p className="text-xs sm:text-sm text-dust font-normal leading-relaxed mt-4">
            Born between the sun-drenched coast of southern France and the tactile architectural archives of Paris, Juicy crafts clothing as wearable sculpture.
          </p>
        </div>

        {/* ======================================================== */}
        {/* TOP 2 SECTIONS (Asymmetric Parallax Style) */}
        {/* ======================================================== */}

        {/* Section 1: Sourcing */}
        <AsymmetricParallaxSection
          imgSrc="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
          imgAlt="Linen yarn weaving"
          badgeText="Linen Textile Sourcing"
          label="Sourcing"
          title="Honest Textiles, Tactile Finishes."
          paragraphs={[
            "We work exclusively with certified European flax, woven on heritage looms to ensure an unmatched tactile drape. Our raw linen is treated with traditional clay wash baths and soil-dyed with organic earth pigments to achieve our signature warm terracotta and soft chalk palettes.",
            "Each garment retains its natural irregularities—celebrating the subtle slubs, textures, and histories of the raw fibers."
          ]}
        />

        {/* Section 2: Design Studio (Alternating side) */}
        <AsymmetricParallaxSection
          imgSrc="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
          imgAlt="Architectural draping patterns"
          badgeText="Parisian Design Studio"
          label="Couture Drafting"
          title="Sculpting Silhouette on the Body."
          paragraphs={[
            "In our design studio in Paris, we reject standard commercial templates. Every block pattern is sculpted by hand on standard wooden forms, slicing fabric pieces asymmetrically to examine exactly how the weight of the weave responds to motion.",
            "This architectural focus yields cuts that drape and flow completely weightlessly, adapting seamlessly to the natural contours of the body."
          ]}
          reverse={true}
        />

        {/* ======================================================== */}
        {/* BRAND PILLARS GRID (Restyled to 2 Columns - "2 Atas & 2 Bawah") */}
        {/* ======================================================== */}
        <div className="bg-cream/40 border border-sand/20 rounded-[2px] p-8 sm:p-12 mb-24 sm:mb-32">
          <div className="text-center max-w-lg mx-auto mb-10">
            <h3 className="font-playfair text-2xl sm:text-3xl font-normal">
              Atelier Craftsmanship
            </h3>
            <p className="text-[11px] text-dust uppercase tracking-widest mt-1">
              The four pillars of our creation methodology
            </p>
          </div>

          {/* Forced 2-column layout on md and lg screen sizes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 max-w-4xl mx-auto">
            {/* Pillar 1 */}
            <div className="flex flex-col gap-3">
              <div className="size-10 bg-chalk rounded-full border border-sand/40 flex items-center justify-center text-terracotta shadow-xs">
                <Compass className="size-4" />
              </div>
              <h4 className="font-playfair text-lg font-normal text-soil mt-1">
                1. Architectural Drape
              </h4>
              <p className="text-xs text-dust leading-relaxed">
                Garments designed around drapes and asymmetry inspired by Mediterranean architecture.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="flex flex-col gap-3">
              <div className="size-10 bg-chalk rounded-full border border-sand/40 flex items-center justify-center text-terracotta shadow-xs">
                <Scissors className="size-4" />
              </div>
              <h4 className="font-playfair text-lg font-normal text-soil mt-1">
                2. Pattern Slicing
              </h4>
              <p className="text-xs text-dust leading-relaxed">
                Oversized patterns hand-sliced in Paris to ensure silhouettes respond beautifully to body motion.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="flex flex-col gap-3">
              <div className="size-10 bg-chalk rounded-full border border-sand/40 flex items-center justify-center text-terracotta shadow-xs">
                <Sparkles className="size-4" />
              </div>
              <h4 className="font-playfair text-lg font-normal text-soil mt-1">
                3. Clay-Wash Baths
              </h4>
              <p className="text-xs text-dust leading-relaxed">
                Linen undergoes clay washes, delivering an extraordinarily soft, heritage feel on first wear.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="flex flex-col gap-3">
              <div className="size-10 bg-chalk rounded-full border border-sand/40 flex items-center justify-center text-terracotta shadow-xs">
                <Sun className="size-4" />
              </div>
              <h4 className="font-playfair text-lg font-normal text-soil mt-1">
                4. Sun-Drenched Palette
              </h4>
              <p className="text-xs text-dust leading-relaxed">
                Colors organically dyed to capture rich soil, burnt terracotta brick, and Mediterranean sun.
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BOTTOM 2 SECTIONS (Asymmetric Parallax Style) */}
        {/* ======================================================== */}

        {/* Section 3: Slow Fashion */}
        <AsymmetricParallaxSection
          imgSrc="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80"
          imgAlt="Designer at work table"
          badgeText="Pattern Draping Room"
          label="Slow Fashion Paradigm"
          title="An Atelier Committed to the Future."
          paragraphs={[
            "We reject the breakneck speed of typical modern fashion cycles. Juicy manufactures in limited batches—often on a pre-order basis—to minimize textile waste and ensure that each seam is given the focus it deserves.",
            "Our partners are small, ethical, family-owned stitching houses across France and Portugal who pay fair wages and maintain high-grade craft working environments."
          ]}
          ctaText="Explore The Silhouettes"
          ctaHref="/collection"
        />

        {/* Section 4: Earth Dyeing */}
        <AsymmetricParallaxSection
          imgSrc="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
          imgAlt="Natural mineral dyes"
          badgeText="Heritage Dyeing Room"
          label="Organic Pigment Baths"
          title="Soil, Sand, & Earth Pigments."
          paragraphs={[
            "Our colors bond organically with flax fibers. Instead of synthetic oil dyes, each capsule is submerged in baths dyed with plant roots, walnut husks, and ground mineral oxides sourced from honest soil deposits.",
            "This ancestral process yields soft, muted tones that look beautifully sun-baked, weathering gracefully over years of wear and sunlight exposure."
          ]}
          reverse={true}
        />

      </div>
    </div>
  );
};

export default AtelierPage;
