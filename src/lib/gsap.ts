import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export const JuicyMotion = {
  heroReveal: (textElementsSelector: string, imageSelector: string) => {
    if (prefersReducedMotion()) {
      gsap.to([textElementsSelector, imageSelector], {
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
      });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      imageSelector,
      { opacity: 0, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 1.6 }
    );

    tl.fromTo(
      textElementsSelector,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.08 },
      "-=1.0"
    );
  },

  imageDrift: (elementSelector: string) => {
    if (prefersReducedMotion()) return;

    gsap.utils.toArray(elementSelector).forEach((img: any) => {
      img.style.willChange = "transform";
      
      gsap.fromTo(
        img,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        }
      );
    });
  },

  fadeUp: (elementSelector: string) => {
    gsap.utils.toArray(elementSelector).forEach((el: any) => {
      const isReduced = prefersReducedMotion();

      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: isReduced ? 0 : 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  },

  gridStagger: (itemSelector: string) => {
    const isReduced = prefersReducedMotion();
    
    ScrollTrigger.batch(itemSelector, {
      onEnter: (batch) => {
        gsap.fromTo(
          batch,
          {
            opacity: 0,
            y: isReduced ? 0 : 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.06,
            ease: "power2.out",
            overwrite: "auto",
          }
        );
      },
    });
  },
};
