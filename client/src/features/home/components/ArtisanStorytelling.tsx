import { motion, useScroll, useTransform, useSpring } from "motion/react"
import { useRef } from "react"
import { scrollSpring } from "@/lib/animations"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

interface StoryStep {
  number: string
  tag: string
  title: string
  description: string
  image: string
  details: { label: string; value: string }[]
}

export const ArtisanStorytelling = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Track the vertical scroll position of this container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Apply a smooth spring for scrolling
  const smoothProgress = useSpring(scrollYProgress, scrollSpring)

  // Translate track horizontally: from 0% to -80% (since total width is 500vw across 5 panels)
  const x = useTransform(smoothProgress, [0, 1], ["0%", "-80%"])

  // Dynamic horizontal parallax movement for images on each card (moving opposite to scroll)
  const imageX1 = useTransform(smoothProgress, [0.1, 0.45], [40, -40])
  const imageX2 = useTransform(smoothProgress, [0.3, 0.65], [40, -40])
  const imageX3 = useTransform(smoothProgress, [0.5, 0.85], [40, -40])
  const imageX4 = useTransform(smoothProgress, [0.7, 1.0], [40, -40])

  const steps: StoryStep[] = [
    {
      number: "01",
      tag: "The Runway",
      title: "Ready-to-Wear Collections",
      description:
        "Designed for the modern vanguard, our ready-to-wear collections combine architectural silhouettes with futuristic tailoring. Each piece debuting on the Paris runway represents a bold statement in contemporary high fashion.",
      image: "https://www.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton--W_Apparel_RTW_Playground_Nov23_DI3.jpg",
      details: [
        { label: "Show", value: "Paris Fashion Week" },
        { label: "Direction", value: "Avant-Garde Tailoring" },
      ],
    },
    {
      number: "02",
      tag: "Icons",
      title: "Contemporary Leather Icons",
      description:
        "From the sculptural Twist to the timeless Capucines, our modern handbags are masterpieces of architectural design. Crafted from exquisite leathers, they bridge heritage elegance with modern urban utility.",
      image: "https://www.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton--W_Bags_Capucines_Camp_Oct23_DI3.jpg",
      details: [
        { label: "Signature", value: "Capucines & Twist" },
        { label: "Hardware", value: "LV Signature Lock" },
      ],
    },
    {
      number: "03",
      tag: "Savoir-Faire",
      title: "The Haute Couture Atelier",
      description:
        "At the heart of our Paris ateliers, artisans dedicate hundreds of hours to hand-embellish and drape exclusive creations. This dedication to couture defines the pinnacle of fashion craftsmanship and custom elegance.",
      image: "https://www.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton--Maison_Vendome_Atelier_DI3.jpg",
      details: [
        { label: "Location", value: "Place Vendôme, Paris" },
        { label: "Craft", value: "Haute Couture" },
      ],
    },
    {
      number: "04",
      tag: "Campaign",
      title: "The Spirit of Travel",
      description:
        "A lifelong journey of exploration. Our global campaigns capture the elegance of modern travel through cinematic storytelling in breathtaking destinations, presenting fashion as an invitation to escape.",
      image: "https://www.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton--Spirit_of_Travel_Camp_2023_DI3.jpg",
      details: [
        { label: "Theme", value: "The Art of Travel" },
        { label: "Curation", value: "Global Editorial" },
      ],
    },
  ]

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-foreground">
      {/* Sticky container that locks in the viewport */}
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden bg-grain select-none">

        {/* Horizontal track */}
        <motion.div style={{ x }} className="flex h-full w-[500vw] items-center">

          {/* Panel 0: Intro */}
          <div className="flex h-full w-screen flex-col justify-center px-8 md:px-16 lg:px-24">
            <div className="max-w-2xl text-left">
              <span className="mb-4 block text-xs font-semibold tracking-[0.4em] text-primary uppercase font-sans">
                Maison Curation
              </span>
              <h2 className="mb-6 font-serif text-4xl leading-[1.15] text-background md:text-5xl lg:text-7xl">
                The Art of
                <br />
                Modern Fashion
              </h2>
              <p className="mb-10 max-w-lg font-sans text-sm md:text-base leading-relaxed text-background/70 lg:text-lg">
                Step into the universe of our Maison. A bold dialogue between heritage craftsmanship and the visionary spirit of contemporary high fashion.
              </p>
              <div className="flex items-center gap-3 text-primary">
                <span className="text-xs font-semibold tracking-widest uppercase font-sans">
                  Scroll to explore
                </span>
                <motion.div
                  animate={{ x: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" strokeWidth={1.5} />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Panel 1-4: Story Steps */}
          {steps.map((step, idx) => {
            // Assign corresponding parallax motion values
            const imageX =
              idx === 0
                ? imageX1
                : idx === 1
                ? imageX2
                : idx === 2
                ? imageX3
                : imageX4

            return (
              <div key={idx} className="flex h-full w-screen items-center px-8 md:px-16 lg:px-24">
                <div className="flex h-[80vh] w-full flex-col justify-center gap-8 md:grid md:grid-cols-2 md:items-center lg:gap-16">

                  {/* Image container with horizontal parallax */}
                  <div className="relative aspect-video w-full overflow-hidden border border-primary/15 bg-background/5 md:aspect-[4/3] lg:h-[55vh] rounded-none">
                    <motion.div style={{ x: imageX }} className="absolute -inset-x-12 top-0 bottom-0">
                      <img
                        src={step.image}
                        alt={step.title}
                        loading="lazy"
                        className="h-full w-full object-cover scale-110"
                      />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/45 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Text contents */}
                  <div className="relative flex flex-col justify-center text-left">
                    {/* Step Number Backdrop */}
                    <div className="absolute -top-12 -left-6 select-none font-serif text-[11vw] font-bold leading-none text-primary/10 md:-top-16 lg:-top-20 md:-left-8 pointer-events-none">
                      {step.number}
                    </div>

                    <div className="relative z-10">
                      <span className="mb-2 block text-xs font-semibold tracking-[0.3em] text-primary uppercase font-sans">
                        {step.tag}
                      </span>
                      <h3 className="mb-4 font-serif text-2xl md:text-3xl lg:text-4xl leading-tight text-background">
                        {step.title}
                      </h3>
                      <p className="mb-8 font-sans text-sm md:text-base leading-relaxed text-background/70 max-w-md">
                        {step.description}
                      </p>

                      {/* Technical specifications using gold accents and square borders */}
                      <div className="grid grid-cols-2 gap-4 max-w-sm">
                        {step.details.map((detail, dIdx) => (
                          <div
                            key={dIdx}
                            className="border border-primary/15 bg-primary-foreground/5 p-4 rounded-none transition-colors duration-300 hover:border-primary/25"
                          >
                            <span className="mb-1 block text-[10px] tracking-widest text-primary/60 uppercase font-sans">
                              {detail.label}
                            </span>
                            <span className="font-serif text-xs md:text-sm text-background font-medium">
                              {detail.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )
          })}
        </motion.div>

        {/* Scroll Progress Bar at the bottom */}
        <div className="absolute bottom-12 left-8 right-8 flex items-center justify-between lg:left-24 lg:right-24">
          <div className="h-[1px] w-[200px] bg-primary/20 relative">
            <motion.div
              style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
              className="absolute inset-0 bg-primary"
            />
          </div>
          <div className="font-serif text-xs text-primary/60 tracking-wider">
            Atelier Journey
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArtisanStorytelling
