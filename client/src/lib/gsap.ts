import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

type RevealPattern = "fade" | "scale" | "slide-left" | "slide-right" | "clip";

export const JuicyMotion = {
  scrollReveal: (itemSelector: string, pattern: RevealPattern | RevealPattern[] = "fade", staggerAmount = 0.15) => {
    const isReduced = prefersReducedMotion();
    const items = gsap.utils.toArray(itemSelector) as HTMLElement[];

    if (isReduced) {
      gsap.set(items, { opacity: 1, clearProps: "y" });
      return;
    }

    items.forEach((el, i) => {
      const p = Array.isArray(pattern) ? pattern[i % pattern.length] : pattern;

      el.style.willChange = "transform, opacity";

      const fromVars: gsap.TweenVars = { opacity: 0 };
      const toVars: gsap.TweenVars = {
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      };

      switch (p) {
        case "scale":
          fromVars.scale = 0.92;
          fromVars.y = 30;
          break;
        case "slide-left":
          fromVars.x = 80;
          break;
        case "slide-right":
          fromVars.x = -80;
          break;
        case "clip":
          fromVars.clipPath = "inset(0 100% 0 0)";
          toVars.clipPath = "inset(0 0% 0 0)";
          toVars.duration = 1.2;
          toVars.ease = "power4.inOut";
          break;
        default:
          fromVars.y = 40;
          break;
      }

      toVars.delay = i * staggerAmount;
      gsap.fromTo(el, fromVars, toVars);
    });
  },

  parallaxTiles: (containerSelector: string, imgSelector: string) => {
    if (prefersReducedMotion()) return;

    const containers = gsap.utils.toArray(containerSelector) as HTMLElement[];
    containers.forEach((container) => {
      const img = container.querySelector(imgSelector) as HTMLElement;
      if (!img) return;

      img.style.willChange = "transform";

      gsap.fromTo(
        img,
        { scale: 1.1, yPercent: -6 },
        {
          scale: 1,
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        }
      );
    });
  },

  heroParallax: (containerSelector: string) => {
    const isReduced = prefersReducedMotion();

    if (isReduced) {
      gsap.set([".hero-stagger", ".hero-image"], {
        opacity: 1,
        clearProps: "y",
      });
      gsap.set(".hero-divider-line", { scaleX: 1 });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.set(".hero-image", { willChange: "transform" });
    tl.set(".hero-content", { willChange: "transform" });
    tl.fromTo(".hero-image", { scale: 1.1, opacity: 0 }, { scale: 1, opacity: 1, duration: 2 }, 0);
    tl.fromTo(".hero-overlay", { opacity: 0 }, { opacity: 1, duration: 1.2 }, 0);
    tl.fromTo(".hero-stagger", { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.1 }, "-=1.0");

    tl.fromTo(
      ".hero-divider-line",
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 0.9, ease: "power3.inOut" },
      "-=0.6"
    );

    gsap.to(".hero-image", {
      yPercent: 18,
      ease: "none",
      scrollTrigger: {
        trigger: containerSelector,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
      },
    });

    gsap.to(".hero-content", {
      yPercent: -8,
      ease: "none",
      scrollTrigger: {
        trigger: containerSelector,
        start: "top top",
        end: "bottom top",
        scrub: 2,
      },
    });

    gsap.to(".hero-scroll-indicator", {
      opacity: 0,
      y: 20,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerSelector,
        start: "top top",
        end: "bottom 80%",
        scrub: 1,
      },
    });
  },

  imageDrift: (elementSelector: string) => {
    if (prefersReducedMotion()) return;

    (gsap.utils.toArray(elementSelector) as HTMLElement[]).forEach((img) => {
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
    (gsap.utils.toArray(elementSelector) as HTMLElement[]).forEach((el) => {
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

  gridLift3D: (itemSelector: string) => {
    const isReduced = prefersReducedMotion();
    const items = gsap.utils.toArray(itemSelector) as HTMLElement[];
    if (items.length === 0) return;

    if (isReduced) {
      gsap.set(items, { opacity: 1, y: 0, scale: 1, rotateX: 0 });
      return;
    }

    items.forEach((item) => {
      const parent = item.parentElement;
      if (parent) {
        parent.style.perspective = "1200px";
        parent.style.transformStyle = "preserve-3d";
      }
    });

    ScrollTrigger.batch(items, {
      onEnter: (batch) => {
        gsap.fromTo(
          batch,
          {
            opacity: 0,
            y: 65,
            scale: 0.94,
            rotateX: 12,
            transformOrigin: "center bottom",
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: "power3.out",
            overwrite: "auto",
          }
        );
      },
    });
  },
};
