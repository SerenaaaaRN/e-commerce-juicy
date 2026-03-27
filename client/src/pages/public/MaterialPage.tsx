import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { initLenis } from "@/lib/lenis";
import { Sun, Sparkles, Wind } from "lucide-react";
import { TextRoll } from "@/components/ui/TextRoll";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type MaterialStorySection = {
  id: number;
  subtitle: string;
  title: string;
  img: string;
  description: string;
  detailText: string;
  icon: JSX.Element;
};

const MATERIAL_STORIES: MaterialStorySection[] = [
  {
    id: 1,
    subtitle: "Flax Cultivation",
    title: "Sown in European Soil, Nurtured by Sun.",
    img: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
    description:
      "Our linen originates from the flax fields of Normandy, where rich ocean breezes and fertile soils nurture resilient fibers without artificial irrigation. A heritage textile celebrating nature's unhurried rhythm.",
    detailText: "100% Certified Organic Flax • Zero Irrigation Sourced",
    icon: <Wind className="size-5 text-terracotta" />,
  },
  {
    id: 2,
    subtitle: "Clay-Wash Bathing",
    title: "softened by heritage clay washes.",
    img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
    description:
      "To bypass harsh chemical softeners, each garment undergoes traditional clay wash baths. Pure river-bed clay granules gently smooth the raw linen fibers, delivering a heavily draped feel with a soft suede-like texture.",
    detailText: "Traditional Clay Softeners • Hypoallergenic Finishes",
    icon: <Sparkles className="size-5 text-terracotta" />,
  },
  {
    id: 3,
    subtitle: "Organic Pigments",
    title: "Organically dyed with earth minerals.",
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    description:
      "Juicy's warm, sunset-inspired color palette is obtained entirely through plant extracts and ground mineral oxides. Rich ochres, terracotta clays, and warm chalks bond organically with our flax yarns.",
    detailText: "Mineral & Plant-Based Dyes • 100% Biodegradable",
    icon: <Sun className="size-5 text-terracotta" />,
  },
];

export const MaterialPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = initLenis();
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });

    const container = containerRef.current;
    if (!container) return;

    const sections = container.querySelectorAll(".story-section");
    if (sections.length === 0) return;

    // Apply Horizon Silk Curtain Warp (Option 5)
    sections.forEach((section, idx) => {
      if (idx === 0) return; // First section enters normally

      const inner = section.querySelector(".story-inner") as HTMLElement;
      const overlay = section.querySelector(".shadow-overlay") as HTMLElement;
      if (!inner || !overlay) return;

      // Set initial warped curve states
      gsap.set(inner, {
        rotateY: 14,
        skewX: -4,
        scale: 0.93,
        transformOrigin: "center bottom",
      });

      gsap.set(overlay, {
        opacity: 0.75,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "top top",
          scrub: 1.2,
        },
      });

      // Warp straightens out as we scroll
      tl.to(
        inner,
        {
          rotateY: 0,
          skewX: 0,
          scale: 1,
          ease: "none",
        },
        0
      ).to(
        overlay,
        {
          opacity: 0,
          ease: "none",
        },
        0
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-background min-h-screen font-dm-sans text-soil select-none overflow-hidden pb-16"
      style={{ perspective: "1200px" }}
    >
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto pt-24 pb-16 sm:pb-24 px-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-terracotta block mb-3">
          Honest Sourcing
        </span>
        <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight">
          <TextRoll text="Textile Sourcing" />
        </h1>
        <p className="text-xs sm:text-sm text-dust font-normal leading-relaxed mt-4">
          Juicy garments celebrate raw, certified European flax treated with heritage techniques. Explore the physical path from honest earth to refined drape.
        </p>
      </div>

      {/* Story Sections */}
      <div className="flex flex-col gap-0">
        {MATERIAL_STORIES.map((story) => (
          <section
            key={story.id}
            className="story-section relative w-full min-h-[90vh] flex items-center bg-chalk border-b border-sand/15"
          >
            {/* Story Inner Container (Warped Element) */}
            <div
              className="story-inner w-full max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-center transform-gpu"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Left Column: Story visual */}
              <div className="lg:col-span-6 relative aspect-[3/4.2] w-full overflow-hidden border border-sand/20 rounded-[2px] bg-cream shadow-xl">
                <img
                  src={story.img}
                  alt={story.title}
                  className="size-full object-cover"
                />
              </div>

              {/* Right Column: Narrative details */}
              <div className="lg:col-span-6 flex flex-col gap-6 lg:pl-8">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-chalk border border-sand/35 flex items-center justify-center shadow-xs">
                    {story.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-terracotta">
                    {story.subtitle}
                  </span>
                </div>

                <h2 className="font-playfair text-3xl sm:text-4xl font-normal leading-tight">
                  {story.title}
                </h2>

                <p className="text-xs text-dust leading-relaxed font-normal">
                  {story.description}
                </p>

                <div className="h-px bg-sand/20 my-2" />

                <span className="text-[10px] font-bold uppercase tracking-wider text-soil/95">
                  {story.detailText}
                </span>
              </div>
            </div>

            {/* Depth shadow overlay that fades out on entry */}
            <div className="shadow-overlay absolute inset-0 bg-soil/25 pointer-events-none transition-all duration-300 transform-gpu" />
          </section>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="text-center mt-24">
        <Link to="/collection">
          <Button
            variant="primary"
            size="default"
            className="text-[10px] font-bold uppercase tracking-widest px-8 shadow-lg hover:shadow-xl transition-all"
          >
            Explore Capsule Collection
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MaterialPage;
