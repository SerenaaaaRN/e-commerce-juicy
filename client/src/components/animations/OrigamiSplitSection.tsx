import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type OrigamiSplitSectionProps = {
  imgSrc: string;
  imgAlt: string;
  label?: string;
  title: string;
  paragraphs: string[];
  badgeText?: string;
  reverse?: boolean;
  ctaText?: string;
  ctaHref?: string;
};

export const OrigamiSplitSection = ({
  imgSrc,
  imgAlt,
  label = "Atelier Detail",
  title,
  paragraphs,
  badgeText = "Sourcing",
  reverse = false,
  ctaText,
  ctaHref,
}: OrigamiSplitSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const left = leftRef.current;
    const right = rightRef.current;

    if (!container || !left || !right) return;

    // Reset initial states for 3D origami folding
    gsap.set(left, {
      transformOrigin: reverse ? "right center" : "left center",
      rotateY: 0,
      opacity: 1,
    });

    gsap.set(right, {
      transformOrigin: "center top",
      rotateX: 90,
      opacity: 0,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 70%",
        end: "bottom 30%",
        scrub: 1.2,
      },
    });

    tl.to(
      left,
      {
        rotateY: reverse ? 45 : -45,
        opacity: 0.75,
        ease: "power1.inOut",
      },
      0
    ).to(
      right,
      {
        rotateX: 0,
        opacity: 1,
        ease: "power2.out",
      },
      0.1
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [reverse]);

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24 sm:mb-32 select-none"
      style={{ perspective: "1500px" }}
    >
      {/* Left / Image side */}
      <div
        ref={leftRef}
        className={`lg:col-span-7 aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5] relative overflow-hidden bg-cream border border-sand/15 rounded-[2px] transform-gpu will-change-transform shadow-lg ${
          reverse ? "lg:order-2" : "lg:order-1"
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        <img
          src={imgSrc}
          alt={imgAlt}
          className="size-full object-cover"
        />
        <div className="absolute bottom-4 left-4 bg-chalk/90 backdrop-blur-xs px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-soil">
          {badgeText}
        </div>
      </div>

      {/* Right / Content side */}
      <div
        ref={rightRef}
        className={`lg:col-span-5 flex flex-col gap-6 lg:pl-6 transform-gpu will-change-transform ${
          reverse ? "lg:order-1 lg:pr-6 lg:pl-0" : "lg:order-2"
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {label && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-terracotta">
            {label}
          </span>
        )}
        <h2 className="font-playfair text-3xl sm:text-4xl font-normal leading-tight text-soil">
          {title}
        </h2>
        {paragraphs.map((para, idx) => (
          <p key={idx} className="text-xs text-dust leading-relaxed font-normal">
            {para}
          </p>
        ))}
        {ctaText && ctaHref && (
          <Link to={ctaHref} className="mt-2">
            <Button variant="primary" size="default" className="text-[11px] font-bold uppercase tracking-widest px-8">
              {ctaText}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default OrigamiSplitSection;
