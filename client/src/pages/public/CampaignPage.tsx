import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { initLenis } from "@/lib/lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ArrowRight, Sparkles } from "lucide-react";
import { TextRoll } from "@/components/ui/TextRoll";

// Campaign card type
type CampaignCard = {
  id: number;
  title: string;
  location: string;
  img: string;
  slug: string;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  xPercent: number;
  yPercent: number;
  z: number; // 3D depth coordinate
};

const CAMPAIGN_CARDS: CampaignCard[] = [
  {
    id: 1,
    title: "Linen Trench Silhouette",
    location: "Gordes Terracotta Villa",
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
    slug: "linen-trench-silhouette",
    rotateX: -10,
    rotateY: 15,
    rotateZ: -8,
    xPercent: -35,
    yPercent: -20,
    z: -120,
  },
  {
    id: 2,
    title: "Mediterranean Solstice Gown",
    location: "Provence Lavender Fields",
    img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    slug: "mediterranean-solstice-gown",
    rotateX: 12,
    rotateY: -10,
    rotateZ: 6,
    xPercent: 30,
    yPercent: -30,
    z: 60, // Hero card
  },
  {
    id: 3,
    title: "Asymmetric Organic Set",
    location: "St. Tropez Coastline",
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    slug: "asymmetric-organic-set",
    rotateX: -8,
    rotateY: -12,
    rotateZ: -5,
    xPercent: -20,
    yPercent: 25,
    z: -180,
  },
  {
    id: 4,
    title: "Sun-Bleached Flax Top",
    location: "Marseille Port d'Attache",
    img: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    slug: "sun-bleached-flax-top",
    rotateX: 15,
    rotateY: 8,
    rotateZ: 10,
    xPercent: 35,
    yPercent: 20,
    z: 40,
  },
];

export const CampaignPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = initLenis();
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });

    const container = containerRef.current;
    const cards = cardsRef.current?.querySelectorAll(".postcard-card");
    const heroCard = heroCardRef.current;

    if (!container || !cards || cards.length === 0 || !heroCard) return;

    // CINEMATIC STACKED INITIAL STATE
    gsap.set(cards, {
      xPercent: 0,
      yPercent: 0,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      z: 0,
      scale: 0.82,
      opacity: 0.7,
      filter: "blur(0px)",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=220%", // Extended pinning space
        scrub: 1.5, // Smooth inertia
        pin: true,
        anticipatePin: 1,
      },
    });

    // 1. Staggered 3D Scatter outwards
    CAMPAIGN_CARDS.forEach((card, idx) => {
      const cardEl = cards[idx];
      tl.to(
        cardEl,
        {
          xPercent: card.xPercent,
          yPercent: card.yPercent,
          rotateX: card.rotateX,
          rotateY: card.rotateY,
          rotateZ: card.rotateZ,
          z: card.z, // Disperse layers in 3D Depth
          scale: 1,
          opacity: 1,
          ease: "back.out(1.1)", // Bouncy luxury reveal
        },
        idx * 0.08 // Staggered scatter offsets!
      );
    });

    // 2. Bring Hero card to sharp focus and slide it forward (Depth of Field)
    tl.to(
      heroCard,
      {
        xPercent: 0,
        yPercent: -12,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        z: 320, // Pop right out into the close foreground!
        scale: 1.16,
        zIndex: 50,
        ease: "back.out(1.2)",
      },
      0.8
    );

    // 3. Recede and blur background cards (DoF Simulation)
    CAMPAIGN_CARDS.forEach((card, idx) => {
      if (card.id !== 2) {
        const cardEl = cards[idx];
        tl.to(
          cardEl,
          {
            z: card.z - 180, // Push far back
            opacity: 0.4, // Dim light
            filter: "blur(3px)", // Camera blur
            ease: "power2.inOut",
          },
          0.85 // Synced right as hero enters focus
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, []);

  // HOLOGRAPHIC MOUSE TILT INTERACTION (TACTILE FEEL)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 14; // Tilt up to 14deg on Y
    const rotateX = ((centerY - y) / centerY) * 14; // Tilt up to 14deg on X

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1000,
      duration: 0.45,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = (
    e: React.MouseEvent<HTMLDivElement>,
    original: CampaignCard,
    isHero: boolean
  ) => {
    const card = e.currentTarget;

    // Snaps back smoothly to its scroll-scrubbed state
    gsap.to(card, {
      rotateX: isHero ? 0 : original.rotateX,
      rotateY: isHero ? 0 : original.rotateY,
      duration: 0.7,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-background overflow-hidden font-dm-sans text-soil select-none"
      style={{ perspective: "1500px" }}
    >
      {/* Intro Header */}
      <div className="absolute top-24 inset-x-0 mx-auto max-w-xl text-center z-20 pointer-events-none">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-terracotta mb-2 inline-flex items-center gap-1.5">
          <Sparkles className="size-3 text-terracotta fill-terracotta" />
          Atelier Archives
        </span>
        <h1 className="font-playfair text-4xl sm:text-5xl font-normal leading-tight">
          <TextRoll text="Lookbook Campaign" />
        </h1>
        <p className="text-[11px] text-dust uppercase tracking-widest mt-2 pointer-events-auto">
          Scroll to scatter the postcard gallery
        </p>
      </div>

      {/* Floating 3D Canvas stage */}
      <div
        ref={cardsRef}
        className="absolute inset-0 w-full h-full flex items-center justify-center transform-gpu z-10"
        style={{ transformStyle: "preserve-3d" }}
      >
        {CAMPAIGN_CARDS.map((card) => {
          const isHero = card.id === 2; // Mediterranean Solstice Gown is our hero card
          return (
            <div
              key={card.id}
              ref={isHero ? heroCardRef : null}
              onMouseMove={handleMouseMove}
              onMouseLeave={(e) => handleMouseLeave(e, card, isHero)}
              className="postcard-card absolute w-[260px] sm:w-[310px] aspect-[3/4.1] bg-chalk border border-sand/20 p-4 shadow-xl transform-gpu rounded-[1px] group cursor-pointer transition-shadow duration-300 hover:shadow-2xl"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Polaroid Frame Image */}
              <div className="w-full aspect-[3/3.6] bg-cream overflow-hidden border border-sand/10 relative">
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                />
              </div>

              {/* Card Label */}
              <div className="flex flex-col justify-between mt-3 text-left">
                <span className="text-[9px] font-bold uppercase tracking-wider text-terracotta">
                  {card.location}
                </span>
                <div className="flex items-center justify-between mt-0.5">
                  <h4 className="font-playfair text-xs sm:text-sm font-semibold truncate max-w-[85%]">
                    {card.title}
                  </h4>
                  <Link to="/collection" className="text-soil opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky footer action */}
      <div className="absolute bottom-10 inset-x-0 text-center z-30">
        <Link to="/collection">
          <Button
            variant="primary"
            size="default"
            className="text-[10px] font-bold uppercase tracking-widest px-8 shadow-lg hover:shadow-xl transition-all"
          >
            Explore Capsule Catalog
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CampaignPage;
