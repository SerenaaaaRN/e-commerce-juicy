import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type AsymmetricParallaxSectionProps = {
  imgSrc: string;
  imgAlt: string;
  badgeText: string;
  label: string;
  title: string;
  paragraphs: string[];
  reverse?: boolean;
  ctaText?: string;
  ctaHref?: string;
};

export const AsymmetricParallaxSection = ({
  imgSrc,
  imgAlt,
  badgeText,
  label,
  title,
  paragraphs,
  reverse = false,
  ctaText,
  ctaHref,
}: AsymmetricParallaxSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.2,
      },
    });

    // Smooth image vertical parallax slide
    tl.fromTo(
      img,
      { yPercent: -12 },
      { yPercent: 12, ease: "none" }
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
      className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24 sm:mb-32 overflow-hidden py-4"
    >
      {/* Visual Image container */}
      <div
        className={`lg:col-span-7 aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5] overflow-hidden border border-sand/20 rounded-[2px] shadow-lg relative bg-cream ${
          reverse ? "lg:order-last" : ""
        }`}
      >
        <img
          ref={imgRef}
          src={imgSrc}
          alt={imgAlt}
          className="w-full h-[125%] object-cover absolute top-0 left-0"
        />
      </div>

      {/* Content panel */}
      <div className="lg:col-span-5 flex flex-col gap-5 text-left">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-terracotta">
            {badgeText}
          </span>
          <span className="text-[10px] text-dust uppercase tracking-widest">
            {label}
          </span>
        </div>

        <h3 className="font-playfair text-2xl sm:text-3xl font-normal leading-tight">
          {title}
        </h3>

        {paragraphs.map((p, i) => (
          <p key={i} className="text-xs text-dust leading-relaxed font-normal">
            {p}
          </p>
        ))}

        {ctaText && ctaHref && (
          <div className="mt-2">
            <a
              href={ctaHref}
              className="inline-block text-[10px] font-bold uppercase tracking-widest border-b border-soil pb-1 text-soil hover:text-terracotta hover:border-terracotta transition-colors"
            >
              {ctaText}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AsymmetricParallaxSection;
