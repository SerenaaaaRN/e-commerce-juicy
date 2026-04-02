import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type DioramaSectionProps = {
  subtitle?: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
  foregroundImg?: string; // Kept for backward compatibility
  backgroundImg: string;
};

export const DioramaSection = ({
  subtitle = "Atelier Story",
  title,
  description,
  ctaText = "Discover Atelier",
  ctaHref = "#",
  backgroundImg,
}: DioramaSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    const img = imgRef.current;
    const overlay = overlayRef.current;
    const text = textRef.current;

    if (!container || !card || !img || !overlay || !text) return;

    // BOX-TO-FULLSCREEN PARALLAX REVEAL
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=300%", // Long pinning space for smooth control
        scrub: 1.5, // Ultra smooth momentum
        pin: true,
        anticipatePin: 1,
      },
    });

    // Reset initial states before animation (sharp edges, no border-radius)
    gsap.set(card, { width: "70%", height: "70vh" });
    gsap.set(img, { scale: 1.35 });
    gsap.set(overlay, { opacity: 0 });
    gsap.set(text, { opacity: 0, y: 60 });

    tl.to(
      card,
      {
        width: "100%",
        height: "100vh",
        ease: "power2.inOut",
      },
      0
    )
      .to(
        img,
        {
          scale: 1.05,
          ease: "power2.inOut",
        },
        0
      )
      .to(
        overlay,
        {
          opacity: 0.45,
          ease: "power2.inOut",
        },
        0.1
      )
      .to(
        text,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        0.45
      )
      // Exit transition: Fades out and shrinks slightly at the end of the scroll scrub
      .to(
        container,
        {
          opacity: 0,
          scale: 0.96,
          ease: "power2.inOut",
        },
        2.4 // Occurs during the final part of the timeline
      );

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
      className="relative w-full h-screen overflow-hidden bg-background select-none flex items-center justify-center"
    >
      {/* Centered Mask Card */}
      <div
        ref={cardRef}
        className="relative overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.25)] flex items-center justify-center transition-all duration-100"
        style={{ willChange: "width, height" }}
      >
        {/* Parallax Background Image */}
        <img
          ref={imgRef}
          src={backgroundImg}
          alt="Provence Resort View"
          className="absolute inset-0 w-full h-full object-cover origin-center"
          style={{ willChange: "transform" }}
          loading="eager"
        />

        {/* Ambient Dark Overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-[#1e130c] pointer-events-none"
          style={{ willChange: "opacity" }}
        />

        {/* Floating Elegant Editorial Typography */}
        <div
          ref={textRef}
          className="relative max-w-2xl px-6 text-center z-10 flex flex-col items-center gap-6 pointer-events-auto"
          style={{ willChange: "transform, opacity" }}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-cream flex items-center gap-1.5">
            <Sparkles className="size-3 text-terracotta fill-terracotta" />
            {subtitle}
          </span>

          <h2 className="font-playfair text-3xl sm:text-5xl lg:text-6xl font-normal text-chalk leading-tight tracking-wide drop-shadow-sm">
            {title}
          </h2>

          <p className="text-xs sm:text-sm text-sand/85 leading-relaxed font-light font-dm-sans max-w-lg">
            {description}
          </p>

          <div className="mt-4">
            <a href={ctaHref}>
              <Button
                variant="primary"
                size="default"
                className="text-[10px] font-bold uppercase tracking-widest px-8 py-3 bg-chalk text-soil hover:bg-cream border-transparent"
              >
                {ctaText}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DioramaSection;
