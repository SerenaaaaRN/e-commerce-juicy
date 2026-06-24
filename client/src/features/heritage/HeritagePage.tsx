import { ROUTES } from "@/constants/paths"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion } from "motion/react"
import { Link } from "react-router-dom"

const timeline = [
  {
    year: "1847",
    title: "The Beginning",
    description:
      "Giuseppe Maison established our first atelier in Florence, crafting bespoke leather goods for Italian nobility. His vision was simple: create pieces that transcend time.",
  },
  {
    year: "1892",
    title: "Royal Appointment",
    description:
      "Recognized for exceptional craftsmanship, Maison received its first royal warrant, establishing a tradition of serving discerning clientele across Europe.",
  },
  {
    year: "1935",
    title: "The Signature Stitch",
    description:
      "Third-generation artisan Marco Maison perfected our distinctive hand-stitching technique, now recognized worldwide as the hallmark of authentic Maison pieces.",
  },
  {
    year: "1978",
    title: "Global Expansion",
    description:
      "While maintaining our Florence atelier as the heart of production, Maison opened boutiques in Paris, Milan, and New York, sharing Italian excellence with the world.",
  },
  {
    year: "2024",
    title: "Contemporary Vision",
    description:
      "Today, the fifth generation continues our legacy, blending centuries of tradition with contemporary design to create pieces for the modern connoisseur.",
  },
]

const values = [
  {
    title: "Artisanal Excellence",
    description:
      "Every piece is crafted by master artisans with decades of experience, ensuring unparalleled quality and attention to detail.",
    image: "/artisan-hands-crafting-leather-luxury-goods.jpg",
  },
  {
    title: "Sustainable Luxury",
    description:
      "We source only the finest materials from ethical suppliers, believing true luxury must be responsible to both people and planet.",
    image: "/premium-leather-material-sustainable-luxury.jpg",
  },
  {
    title: "Timeless Design",
    description:
      "Our designs eschew fleeting trends in favor of enduring elegance, creating pieces meant to be treasured for generations.",
    image: "/minimalist-luxury-handbag-timeless-design.jpg",
  },
]

const craftsmen = [
  {
    name: "Lorenzo Benedetti",
    role: "Master Leather Artisan",
    years: "42 years",
    image: "/elderly-italian-craftsman-portrait-luxury.jpg",
  },
  {
    name: "Sofia Marchetti",
    role: "Lead Designer",
    years: "18 years",
    image: "/elegant-italian-woman-designer-portrait.jpg",
  },
  {
    name: "Alessandro Rossi",
    role: "Quality Director",
    years: "28 years",
    image: "/distinguished-italian-man-portrait-luxury.jpg",
  },
]

export const HeritagePage = () => {
  return (
    <main className="min-h-screen bg-background pb-12">
      {/* Hero Section */}
      <section className="relative flex h-[70vh] items-center justify-center overflow-hidden lg:h-[80vh]">
        <div className="absolute inset-0">
          <img
            src="/florence-italy-aerial-view-luxury-historic.jpg"
            alt="Florence, Italy"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-50"
          />
          <div className="absolute inset-0 bg-background/40" />
        </div>

        <div className="relative z-10 px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 block text-xs tracking-[0.4em] text-foreground/80 uppercase drop-shadow-md"
          >
            Since 1847
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 font-serif text-5xl leading-[1.1] text-balance text-foreground drop-shadow-md md:text-6xl lg:text-7xl"
          >
            Our Heritage
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg leading-relaxed text-foreground/90 drop-shadow-md lg:text-xl"
          >
            Five generations of Italian craftsmanship, dedicated to the pursuit of timeless elegance.
          </motion.p>
        </div>
      </section>

      {/* Introduction */}
      <section className="px-6 py-20 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-lg leading-relaxed text-muted-foreground lg:text-xl"
          >
            In the heart of Florence, where the Renaissance redefined beauty and craftsmanship, our story began. What
            started as a modest workshop has evolved into a symbol of Italian excellence, yet our founding principles
            remain unchanged: exceptional materials, masterful technique, and an unwavering commitment to perfection.
          </motion.p>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-muted/40 py-20 lg:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center lg:mb-24"
          >
            <span className="mb-4 block text-xs tracking-[0.4em] text-muted-foreground uppercase">Our Journey</span>
            <h2 className="font-serif text-3xl lg:text-5xl">A Legacy of Excellence</h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line - hidden on mobile */}
            <div className="absolute top-0 bottom-0 left-1/2 hidden w-px bg-border lg:block" />

            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative mb-12 flex flex-col items-start gap-6 lg:mb-16 lg:flex-row lg:items-center lg:gap-12 [content-visibility:auto] ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                  <span className="mb-2 block font-serif text-3xl text-muted-foreground/50 lg:text-4xl">
                    {item.year}
                  </span>
                  <h3 className="mb-3 font-serif text-xl lg:text-2xl">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">{item.description}</p>
                </div>

                {/* Dot - hidden on mobile */}
                <div className="relative z-10 hidden lg:block">
                  <div className="h-4 w-4 bg-foreground" />
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden flex-1 lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-6 py-20 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center lg:mb-24"
          >
            <span className="mb-4 block text-xs tracking-[0.4em] text-muted-foreground uppercase">Our Philosophy</span>
            <h2 className="font-serif text-3xl lg:text-5xl">Guiding Principles</h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative mb-6 aspect-5/6 overflow-hidden bg-muted">
                  <img
                    src={value.image || "/placeholder.webp"}
                    alt={value.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="mb-3 font-serif text-xl lg:text-2xl">{value.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmen Section */}
      <section className="bg-foreground py-20 text-background lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center lg:mb-24"
          >
            <span className="mb-4 block text-xs tracking-[0.4em] text-background/60 uppercase">The Artisans</span>
            <h2 className="font-serif text-3xl lg:text-5xl">Masters of Craft</h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {craftsmen.map((person, index) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative mb-6 aspect-4/5 overflow-hidden bg-muted grayscale transition-all duration-700 hover:grayscale-0">
                  <img
                    src={person.image || "/placeholder.webp"}
                    alt={person.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <h3 className="mb-1 font-serif text-xl lg:text-2xl">{person.name}</h3>
                <p className="mb-1 text-sm text-background/60">{person.role}</p>
                <p className="text-xs tracking-[0.2em] text-background/40 uppercase">{person.years}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="px-6 py-20 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="mb-8 font-serif text-2xl leading-relaxed text-balance lg:text-4xl">
              "True luxury is not about ostentation. It is about the quiet confidence that comes from knowing every
              detail has been considered, every stitch placed with intention."
            </p>
            <cite className="not-italic">
              <span className="block text-sm tracking-[0.2em] text-muted-foreground uppercase">
                — Isabella JUICY, Creative Director
              </span>
            </cite>
          </motion.blockquote>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/40 py-20 lg:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="mb-4 block text-xs tracking-[0.4em] text-muted-foreground uppercase">Explore</span>
            <h2 className="mb-6 font-serif text-3xl lg:text-5xl">Discover the Collection</h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Experience the culmination of our heritage in every piece we create.
            </p>
            <Link
              to={ROUTES.shop}
              className="group inline-flex items-center gap-3 bg-foreground px-8 py-4 text-sm tracking-[0.2em] text-background uppercase transition-all duration-300 hover:gap-5"
            >
              View Collection
              <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4 stroke-[1.5]" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

export default HeritagePage
