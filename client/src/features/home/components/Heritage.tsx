import { motion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"

export const HeritageSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])

  return (
    <section ref={sectionRef} className="relative flex min-h-screen items-center overflow-hidden">
      {/* Parallax background - converted to img */}
      <motion.div style={{ y }} className="absolute inset-0 -top-20 -bottom-20">
        <img
          src="/italian-atelier-workshop-artisan-crafting-luxury-l.jpg"
          alt="Heritage craftsmanship in Italian atelier"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/60" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="mb-6 block text-xs tracking-[0.4em] text-background/70 uppercase">Our Heritage</span>
            <h2 className="mb-8 font-serif text-4xl leading-[1.15] text-balance text-background lg:text-6xl">
              Crafted with Intention,
              <br />
              Made in Italy
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-background/80 lg:text-xl">
              For over five generations, our artisans have perfected the art of quiet luxury. Each piece is meticulously
              crafted in our Florence atelier, where tradition meets contemporary vision.
            </p>

            <div className="flex flex-wrap justify-center gap-12 lg:gap-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="mb-2 block font-serif text-4xl text-background lg:text-5xl">1847</span>
                <span className="text-xs tracking-[0.2em] text-background/60 uppercase">Founded</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <span className="mb-2 block font-serif text-4xl text-background lg:text-5xl">5</span>
                <span className="text-xs tracking-[0.2em] text-background/60 uppercase">Generations</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <span className="mb-2 block font-serif text-4xl text-background lg:text-5xl">200+</span>
                <span className="text-xs tracking-[0.2em] text-background/60 uppercase">Hours per Piece</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
