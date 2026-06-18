import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react"
import { Separator } from "@/components/ui/separator"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { parallaxSpring, scrollSpring, fadeInUp } from "@/lib/animations"

const scrubWords = (text: string) => text.split(" ")

export const EditorialSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, scrollSpring)

  const rawY = useTransform(smoothProgress, [0, 1], ["-15%", "15%"])
  const yParallax = useSpring(rawY, parallaxSpring)

  const headline = "Handcrafted for the Modern Nomad"
  const words = scrubWords(headline)

  return (
    <section ref={sectionRef} data-section="editorial" className="bg-background py-24 md:py-32">
      <Separator className="mb-24 h-px bg-linear-to-r from-transparent via-border to-transparent md:mb-28" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Main campaign image */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="group w-full select-none lg:col-span-7"
          >
            <AspectRatio ratio={16 / 10} className="relative overflow-hidden bg-muted">
              <motion.img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop"
                alt="Editorial Brand Lookbook Showcase"
                className="absolute inset-0 size-full object-cover object-center transition-transform duration-2500 ease-out group-hover:scale-[1.04]"
                style={prefersReduced ? {} : { y: yParallax }}
              />
              <motion.div
                className="pointer-events-none absolute inset-4 border border-white/15 transition-all duration-700 group-hover:inset-6 group-hover:border-(--color-gold-muted)"
                whileInView={{ borderColor: "rgba(181,99,58,0.3)" }}
                viewport={{ once: true }}
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.2)_100%)]" />
            </AspectRatio>
          </motion.div>

          {/* Editorial copy */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.1,
                },
              },
            }}
            className="flex flex-col gap-6 text-left lg:col-span-5"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3">
              <span className="size-1 rotate-45 bg-(--color-gold)" />
              <span className="font-mono text-[9px] font-bold tracking-[0.4em] text-(--color-gold) uppercase">
                Atelier Philosophy
              </span>
            </motion.div>

            {/* Word-by-word staggered reveal heading */}
            <h2 className="font-heading text-3xl leading-[1.05] font-bold tracking-tight text-foreground md:text-4xl">
              {words.map((word, i) => (
                <motion.span key={i} variants={fadeInUp} className="mr-2 inline-block">
                  {word}
                </motion.span>
              ))}
              <br />
              <motion.span variants={fadeInUp} className="inline-block text-(--color-gold) italic">
                Modern Nomad
              </motion.span>
            </h2>

            <motion.div variants={fadeInUp}>
              <Separator className="h-px w-12 bg-(--color-gold)" />
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col gap-4 text-xs leading-relaxed tracking-wide text-muted-foreground"
            >
              <p>
                Every garment begins in the fertile flax fields of Belgium and Northern France. We source only the
                highest grade long-staple flax fibers, woven by master weavers into breathable, high-density raw
                textures.
              </p>
              <p>
                Our designs reject mass trends, celebrating pure form, clean geometric cuts, and sharp edges.
                Handcrafted in low batches, we minimize manufacturing impact and nurture enduring pieces destined for
                lifetimes of narrative.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-6 pt-5">
              <Separator className="col-span-2 h-px bg-border/30" />
              <div>
                <span className="block font-heading text-[10px] font-bold tracking-wider text-(--color-gold) uppercase">
                  100% Raw Flax
                </span>
                <span className="text-[9px] tracking-wide text-muted-foreground/60">Certified European Fiber</span>
              </div>
              <div>
                <span className="block font-heading text-[10px] font-bold tracking-wider text-(--color-gold) uppercase">
                  Slow Batches
                </span>
                <span className="text-[9px] tracking-wide text-muted-foreground/60">Limited Curated Release</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default EditorialSection
