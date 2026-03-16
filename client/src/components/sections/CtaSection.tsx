import { useEffect } from "react";
import { JuicyMotion } from "@/lib/gsap";
import { ButtonLink } from "@/components/ui/button";

const CtaSection = () => {
  useEffect(() => {
    // Fade up CTA content
    JuicyMotion.fadeUp(".cta-fade");
  }, []);

  return (
    <section className="py-28 sm:py-36 bg-transparent text-soil text-center font-dm-sans px-4 select-none relative overflow-hidden transition-all duration-300">
      {/* Subtle Warm Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-terracotta-light/10 blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
        <span className="cta-fade text-[10px] font-semibold uppercase tracking-[0.25em] text-terracotta">
          Solstice Awaits
        </span>

        <h2 className="cta-fade font-playfair text-4xl sm:text-6xl md:text-7xl font-normal leading-[1.05] tracking-tight max-w-2xl text-soil">
          Step Into the Warm Canvas
        </h2>

        <p className="cta-fade text-sm sm:text-base text-dust leading-relaxed font-normal max-w-md my-2">
          Experience French linen wrap dresses, structured wool blazers, and luxury leather accessories crafted for sun-drenched afternoons.
        </p>

        <div className="cta-fade mt-4">
          <ButtonLink
            to="/collection"
            variant="primary"
            size="lg"
            className="uppercase tracking-widest text-[11px] font-bold"
          >
            Shop the Collection
          </ButtonLink>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
