import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { JuicyMotion } from "@/lib/gsap";
import { gsap } from "gsap";

const HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2000&q=90",
    alt: "Editorial sitting campaign",
  },
  {
    src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2000&q=90",
    alt: "Luxury shopping campaign",
  },
  {
    src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=2000&q=90",
    alt: "Studio editorial portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=90",
    alt: "Sunlight dress campaign",
  },
];

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const currentRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (containerRef.current) {
      JuicyMotion.heroParallax(`#${containerRef.current.id}`);
    }
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (!currentRef.current || !nextRef.current) return;

    const nextImg = nextRef.current.querySelector("img");
    if (nextImg) {
      nextImg.src = HERO_IMAGES[activeIndex].src;
      nextImg.alt = HERO_IMAGES[activeIndex].alt;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        const curImg = currentRef.current?.querySelector("img");
        if (curImg) {
          curImg.src = HERO_IMAGES[activeIndex].src;
          curImg.alt = HERO_IMAGES[activeIndex].alt;
        }
        gsap.set(currentRef.current, { opacity: 1, scale: 1 });
        gsap.set(nextRef.current, { opacity: 0, scale: 1.05 });
      },
    });

    tl.to(currentRef.current, {
      opacity: 0,
      scale: 1.05,
      duration: 1.2,
      ease: "power2.inOut",
    }, 0);

    tl.fromTo(nextRef.current,
      { opacity: 0, scale: 1.08 },
      { opacity: 1, scale: 1, duration: 1.4, ease: "power3.out" },
      0.3,
    );
  }, [activeIndex]);

  return (
    <section
      id="hero-container"
      ref={containerRef}
      className="bg-soil font-dm-sans relative h-screen w-full overflow-hidden"
    >
      <div ref={currentRef} className="hero-image absolute inset-0 size-full">
        <img
          src={HERO_IMAGES[0].src}
          alt={HERO_IMAGES[0].alt}
          className="size-full object-cover"
          loading="eager"
        />
      </div>

      <div ref={nextRef} className="hero-image absolute inset-0 size-full opacity-0" style={{ scale: 1.05 }}>
        <img
          src={HERO_IMAGES[0].src}
          alt={HERO_IMAGES[0].alt}
          className="size-full object-cover"
          loading="eager"
        />
      </div>

      <div className="hero-overlay from-soil/90 via-soil/50 pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r to-transparent" />

      <div className="hero-content relative z-10 flex h-full items-center pt-64 lg:pt-80">
        <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <div className="max-w-xl">
            <div className="hero-stagger mb-6 flex items-center gap-4">
              <span className="bg-terracotta h-px w-10" />
              <span className="text-terracotta-light text-[10px] font-semibold tracking-[0.25em] uppercase">
                New Summer Drop
              </span>
            </div>

            <h1 className="hero-stagger font-playfair text-chalk text-6xl leading-[0.88] tracking-tight sm:text-7xl md:text-8xl lg:text-[110px]">
              Sun-Soaked
              <br />
              <span className="from-terracotta-light to-chalk/80 bg-gradient-to-r bg-clip-text text-transparent">
                Luxury
              </span>
            </h1>

            <div className="hero-divider-line bg-terracotta my-8 h-[2px] w-24 origin-left" />

            <div className="hero-stagger mt-10 flex items-center gap-5">
              <ButtonLink
                to="/collection"
                variant="outline"
                size="lg"
                className="border-chalk/80 text-chalk hover:bg-chalk hover:text-soil text-[11px] font-semibold tracking-widest uppercase"
              >
                Explore Collection
              </ButtonLink>
              <ButtonLink
                to="/collection?category=dresses"
                variant="ghost"
                size="lg"
                className="text-chalk/60 hover:text-chalk text-[11px] font-semibold tracking-widest uppercase"
              >
                New Arrivals
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 right-6 z-10 flex flex-col items-center gap-4 sm:right-10">
        <div className="flex flex-col items-center gap-3">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                clearInterval(intervalRef.current);
                setActiveIndex(i);
              }}
              className={`rounded-full transition-all duration-700 ${
                i === activeIndex
                  ? "bg-chalk h-4 w-[2px]"
                  : "bg-chalk/30 h-2.5 w-[2px] hover:bg-chalk/60"
              }`}
            />
          ))}
        </div>
        <div className="from-chalk/40 h-10 w-px bg-gradient-to-b to-transparent" />
        <span className="text-chalk/40 text-[9px] font-semibold tracking-[0.3em] uppercase [writing-mode:vertical-lr]">
          Scroll
        </span>
      </div>

      <div className="text-chalk/30 absolute right-8 bottom-10 z-10 hidden items-center gap-4 sm:flex">
        <span className="text-[10px] font-semibold tracking-[0.25em] uppercase">Est. 2026</span>
        <span className="bg-chalk/20 h-px w-6" />
        <span className="text-[10px] font-semibold tracking-[0.25em] uppercase">Atelier</span>
      </div>
    </section>
  );
};

export default HeroSection;
