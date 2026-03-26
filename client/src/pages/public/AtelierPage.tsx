import { useEffect } from "react";
import { Link } from "react-router-dom";
import { initLenis } from "@/lib/lenis";
import Divider from "@/components/ui/Divider";
import { Button } from "@/components/ui/button";
import { Sparkles, Scissors, Sun, Compass } from "lucide-react";

const AtelierPage = () => {
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
            The Atelier
          </h1>
          <p className="text-xs sm:text-sm text-dust font-normal leading-relaxed mt-4">
            Born between the sun-drenched coast of southern France and the tactile architectural archives of Paris, Juicy crafts clothing as wearable sculpture.
          </p>
        </div>

        {/* Asymmetric Showcase Section 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20 sm:mb-28">
          <div className="lg:col-span-7 aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5] relative overflow-hidden bg-cream border border-sand/15">
            <img
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
              alt="Linen yarn weaving"
              className="size-full object-cover hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute bottom-4 left-4 bg-chalk/90 backdrop-blur-xs px-4 py-2 text-[10px] font-bold uppercase tracking-widest">
              Linen Textile Sourcing
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-6 lg:pl-6">
            <h2 className="font-playfair text-3xl sm:text-4xl font-normal leading-tight">
              Honest Textiles, Tactile Finishes.
            </h2>
            <p className="text-xs text-dust leading-relaxed font-normal">
              We work exclusively with certified European flax, woven on heritage looms to ensure an unmatched tactile drape. Our raw linen is treated with traditional clay wash baths and soil-dyed with organic earth pigments to achieve our signature warm terracotta and soft chalk palettes.
            </p>
            <p className="text-xs text-dust leading-relaxed font-normal">
              Each garment retains its natural irregularities—celebrating the subtle slubs, textures, and histories of the raw fibers.
            </p>
            <Divider className="my-2" />
            <div className="flex items-center gap-3">
              <Sun className="size-5 text-terracotta" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Sun-Bleached & Earth-Finished
              </span>
            </div>
          </div>
        </div>

        {/* Brand Pillars Grid */}
        <div className="bg-cream/40 border border-sand/20 rounded-[2px] p-8 sm:p-12 mb-20 sm:mb-28">
          <div className="text-center max-w-lg mx-auto mb-10">
            <h3 className="font-playfair text-2xl sm:text-3xl font-normal">
              Atelier Craftsmanship
            </h3>
            <p className="text-[11px] text-dust uppercase tracking-widest mt-1">
              The four pillars of our creation methodology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col gap-3">
              <div className="size-10 bg-chalk rounded-full border border-sand/40 flex items-center justify-center text-terracotta shadow-xs">
                <Compass className="size-4" />
              </div>
              <h4 className="font-playfair text-lg font-normal text-soil mt-1">
                1. Architectural Drape
              </h4>
              <p className="text-xs text-dust leading-relaxed">
                Garments designed around structural drapes and playful asymmetry inspired by Mediterranean architecture.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="size-10 bg-chalk rounded-full border border-sand/40 flex items-center justify-center text-terracotta shadow-xs">
                <Scissors className="size-4" />
              </div>
              <h4 className="font-playfair text-lg font-normal text-soil mt-1">
                2. Pattern Slicing
              </h4>
              <p className="text-xs text-dust leading-relaxed">
                Unique, oversized patterns hand-sliced in Paris to ensure silhouettes respond beautifully to body motion.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="size-10 bg-chalk rounded-full border border-sand/40 flex items-center justify-center text-terracotta shadow-xs">
                <Sparkles className="size-4" />
              </div>
              <h4 className="font-playfair text-lg font-normal text-soil mt-1">
                3. Clay-Wash Baths
              </h4>
              <p className="text-xs text-dust leading-relaxed">
                Our linen undergoes signature clay washes, delivering an extraordinarily soft, heritage feel on first wear.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="size-10 bg-chalk rounded-full border border-sand/40 flex items-center justify-center text-terracotta shadow-xs">
                <Sun className="size-4" />
              </div>
              <h4 className="font-playfair text-lg font-normal text-soil mt-1">
                4. Sun-Drenched Palette
              </h4>
              <p className="text-xs text-dust leading-relaxed">
                Colors organically dyed to capture shades of rich soil, burnt terracotta bricks, soft chalk, and Mediterranean sun.
              </p>
            </div>
          </div>
        </div>

        {/* Asymmetric Section 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col gap-6 lg:pr-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-terracotta">
              Slow Fashion Paradigm
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-normal leading-tight">
              An Atelier Committed to the Future.
            </h2>
            <p className="text-xs text-dust leading-relaxed font-normal">
              We reject the breakneck speed of typical modern fashion cycles. Juicy manufactures in limited batches—often on a pre-order basis—to minimize textile waste and ensure that each seam is given the focus it deserves.
            </p>
            <p className="text-xs text-dust leading-relaxed font-normal">
              Our partners are small, ethical, family-owned stitching houses across France and Portugal who pay fair wages and maintain high-grade craft working environments.
            </p>
            
            <Link to="/collection" className="mt-2">
              <Button variant="primary" size="default" className="text-[11px] font-bold uppercase tracking-widest px-8">
                Explore The Silhouettes
              </Button>
            </Link>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2 aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5] relative overflow-hidden bg-cream border border-sand/15">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80"
              alt="Designer at work table"
              className="size-full object-cover hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute bottom-4 right-4 bg-chalk/90 backdrop-blur-xs px-4 py-2 text-[10px] font-bold uppercase tracking-widest">
              Pattern Draping Room
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AtelierPage;
