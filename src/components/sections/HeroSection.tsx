import { useEffect, useRef } from "react";
import { ButtonLink } from "@/components/ui/button";
import { JuicyMotion } from "@/lib/gsap";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Stagger word reveal entry on mount
    JuicyMotion.heroReveal(
      ".hero-stagger",
      ".hero-bg-img"
    );
  }, []);

  return (
    <section
      ref={containerRef}
      className="hero-container relative h-[90vh] sm:h-screen w-full flex items-center justify-center overflow-hidden bg-cream font-dm-sans"
    >
      {/* Background Image Layer */}
      <div
        ref={imageRef}
        className="hero-bg-img absolute inset-0 size-full bg-cover bg-center origin-center select-none"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(61,46,34,0.4), rgba(61,46,34,0.1)), url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80')`,
        }}
      />

      {/* Hero Typography Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl flex flex-col items-center gap-6">
        <span className="hero-stagger text-[11px] font-semibold uppercase tracking-[0.25em] text-chalk">
          New Summer Drop
        </span>
        
        <h1
          ref={titleRef}
          className="hero-stagger font-playfair text-5xl sm:text-7xl md:text-8xl lg:text-[110px] font-bold text-chalk leading-[0.9] tracking-tight max-w-3xl drop-shadow-sm select-none"
        >
          Sun-Soaked Luxury
        </h1>
        
        <p className="hero-stagger text-sm sm:text-base text-chalk/90 leading-relaxed font-normal max-w-md">
          A timeless collection designed in warm sand wool-blends and lightweight French linen. Moving with the natural cadence of warm coastal winds.
        </p>

        <div className="hero-stagger mt-4">
          <ButtonLink
            to="/collection"
            variant="outline"
            size="lg"
            className="border-chalk text-chalk hover:bg-chalk hover:text-soil transition-all duration-300 font-semibold uppercase tracking-widest text-[11px]"
          >
            Explore Collection
          </ButtonLink>
        </div>
      </div>

      {/* Decorative Warm Accent Light Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 text-chalk/60 animate-bounce">
        <span className="text-[9px] uppercase tracking-widest font-semibold">Scroll</span>
        <svg
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
