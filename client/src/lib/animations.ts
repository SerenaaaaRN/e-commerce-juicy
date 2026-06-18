import type { Variants } from "motion/react"

export const editorialSpring = {
  type: "spring" as const,
  stiffness: 70,
  damping: 15,
  mass: 0.8,
  restDelta: 0.001,
}

export const tactileBounce = {
  type: "spring" as const,
  stiffness: 250,
  damping: 18,
}

export const parallaxSpring = {
  stiffness: 45,
  damping: 15,
  restDelta: 0.001,
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: editorialSpring,
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: editorialSpring,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
}

export const heroSlideUp: Variants = {
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: editorialSpring,
  },
}

export const scrollSpring = {
  stiffness: 100,
  damping: 30,
  restDelta: 0.001,
}

export const ghostReveal = {
  stiffness: 60,
  damping: 20,
  mass: 1.2,
  restDelta: 0.001,
}
