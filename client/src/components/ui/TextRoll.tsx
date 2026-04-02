import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type TextRollProps = {
  text: string;
  className?: string;
  scrub?: boolean;
  delay?: number;
};

export const TextRoll = ({ text, className = "", scrub = false, delay = 0 }: TextRollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chars = el.querySelectorAll(".roll-char");
    if (chars.length === 0) return;

    gsap.set(chars, {
      transformOrigin: "center bottom -50px",
      rotateX: -90,
      opacity: 0,
      z: -100,
    });

    const scrollTriggerConfig: ScrollTrigger.Vars = {
      trigger: el,
      start: scrub ? "top 85%" : "top 80%",
      end: scrub ? "top 35%" : undefined,
      scrub: scrub ? 1 : false,
      toggleActions: scrub ? undefined : "play none none none",
    };

    const tl = gsap.timeline({
      scrollTrigger: scrollTriggerConfig,
    });

    tl.to(chars, {
      rotateX: 0,
      opacity: 1,
      z: 0,
      duration: scrub ? 1 : 1.2,
      stagger: scrub ? 0.05 : 0.04,
      ease: scrub ? "power1.out" : "power4.out",
      delay: scrub ? 0 : delay,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === el) {
          trigger.kill();
        }
      });
    };
  }, [text, scrub, delay]);

  const words = text.split(" ");

  return (
    <div
      ref={containerRef}
      className={`inline-flex transform-gpu flex-wrap select-none ${className}`}
      style={{ perspective: "800px", transformStyle: "preserve-3d" }}
    >
      {words.map((word, wIdx) => (
        <span
          key={wIdx}
          className="mr-[0.25em] inline-block transform-gpu whitespace-nowrap last:mr-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {word.split("").map((char, cIdx) => (
            <span key={cIdx} className="roll-char inline-block transform-gpu will-change-transform">
              {char}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
};
