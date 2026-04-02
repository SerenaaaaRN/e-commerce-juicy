import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

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

    tl.fromTo(img, { yPercent: -12 }, { yPercent: 12, ease: "none" });

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
      className="mb-24 grid grid-cols-1 items-center gap-12 overflow-hidden py-4 sm:mb-32 lg:grid-cols-12 lg:gap-16"
    >
      {/* Visual Image container */}
      <div
        className={`border-sand/20 bg-cream relative aspect-4/5 overflow-hidden rounded-[2px] border shadow-lg sm:aspect-16/10 lg:col-span-7 lg:aspect-4/5 ${
          reverse ? "lg:order-last" : ""
        }`}
      >
        <img ref={imgRef} src={imgSrc} alt={imgAlt} className="absolute top-0 left-0 h-[125%] w-full object-cover" />
      </div>

      {/* Content panel */}
      <div className="flex flex-col gap-5 text-left lg:col-span-5">
        <div className="flex flex-col gap-1">
          <span className="text-terracotta text-[9px] font-bold tracking-[0.2em] uppercase">{badgeText}</span>
          <span className="text-dust text-[10px] tracking-widest uppercase">{label}</span>
        </div>

        <h3 className="font-playfair text-2xl leading-tight font-normal sm:text-3xl">{title}</h3>

        {paragraphs.map((p, i) => (
          <p key={i} className="text-dust text-xs leading-relaxed font-normal">
            {p}
          </p>
        ))}

        {ctaText && ctaHref ? (
          <div className="mt-2">
            <a
              href={ctaHref}
              className="border-soil text-soil hover:text-terracotta hover:border-terracotta inline-block border-b pb-1 text-[10px] font-bold tracking-widest uppercase transition-colors"
            >
              {ctaText}
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AsymmetricParallaxSection;
