import { useEffect } from "react";
import { JuicyMotion } from "@/lib/gsap";
import { ButtonLink } from "@/components/ui/button";

const EditorialSection = () => {
  useEffect(() => {
    // Parallax scroll on campaign image
    JuicyMotion.imageDrift(".editorial-parallax-img");
    // Fade up texts
    JuicyMotion.fadeUp(".editorial-fade");
  }, []);

  return (
    <section className="py-24 sm:py-36 bg-cream/60 border-y border-sand/20 font-dm-sans text-soil select-none overflow-hidden transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column: Asymmetric Large Portrait Image with parallax drift */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-full max-w-lg aspect-[3/4.2] overflow-hidden bg-sand/20">
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"
              alt="Editorial Mediterranean campaign"
              className="editorial-parallax-img absolute inset-x-0 -top-[12%] h-[124%] w-full object-cover origin-center"
              loading="lazy"
            />
            {/* Subtle luxury sun-drenched tint */}
            <div className="absolute inset-0 bg-[#b5633a]/5 mix-blend-overlay pointer-events-none" />
          </div>
        </div>

        {/* Right Column: Narrative Block */}
        <div className="lg:col-span-6 flex flex-col gap-8 lg:pl-8">
          <div className="editorial-fade flex flex-col gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-terracotta">
              Brand Philosophy
            </span>
            <h2 className="font-playfair text-4xl sm:text-5xl font-normal leading-[1.1] tracking-tight max-w-md">
              Crafted for Warm Solstices
            </h2>
          </div>

          <div className="editorial-fade flex flex-col gap-6 text-sm text-dust leading-relaxed font-normal max-w-md">
            <p>
              Juicy evokes a Mediterranean warmth, bringing playful asymmetric structures, lightweight organic linen layers, and earthy sun-kissed neutrals to modern luxury fashion. Every garment is conceived to move beautifully with you.
            </p>
            <p className="border-l-2 border-sand/40 pl-4 py-1 italic text-soil/95 text-xs">
              &ldquo;We wanted to capture the exact feeling of mid-afternoon sun rays brushing against stone walls in the south of France. A luxury that is tactile, warm, and uncomplicated.&rdquo;
            </p>
            <p>
              By combining relaxed tailored draping with architectural sharpness, the silhouette is airy yet intentional. Made to carry you from sand dunes to sunset dinners.
            </p>
          </div>

          <div className="editorial-fade mt-2">
            <ButtonLink
              to="/collection"
              variant="outline"
              size="sm"
              className="uppercase tracking-widest text-[11px] font-semibold"
            >
              Discover the Campaign
            </ButtonLink>
          </div>
        </div>

      </div>
    </section>
  );
};

export default EditorialSection;
