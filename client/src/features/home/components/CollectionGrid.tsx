import { ProductCard } from "@/components/common/ProductCard"
import { useProductsQuery } from "@/features/shop/hooks/useProductQueries"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { motion, useScroll, useTransform, useSpring } from "motion/react"
import { useRef } from "react"
import { Link } from "@tanstack/react-router"
import { type CatalogProduct } from "@/types"

const CollectionGridContent = ({ products }: { products: CatalogProduct[] }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const yLeft = useTransform(smoothProgress, [0, 1], [100, -100])
  const yCenter = useTransform(smoothProgress, [0, 1], [-30, 30])
  const yRight = useTransform(smoothProgress, [0, 1], [200, -200])

  return (
    <section className="px-6 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center lg:mb-24"
        >
          <h2 className="mb-4 font-serif text-3xl lg:text-5xl">Curated Selection</h2>
          <p className="mx-auto max-w-md tracking-wide text-muted-foreground">
            Each piece tells a story of meticulous craftsmanship
          </p>
        </motion.div>

        <div ref={containerRef} className="relative w-full">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 gap-8 md:hidden"
          >
            {products.slice(0, 6).map((product, idx) => {
              const isOffset = idx % 2 === 1
              return (
                <motion.div key={product.id} variants={fadeInUp} className={isOffset ? "pt-12" : ""}>
                  <ProductCard product={product} variants={fadeInUp} />
                </motion.div>
              )
            })}
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="hidden items-start md:grid md:grid-cols-3 gap-6 lg:gap-12"
          >
            <motion.div style={{ y: yLeft }} className="flex flex-col gap-12 pt-12">
              {products[0] && (
                <motion.div variants={fadeInUp}>
                  <ProductCard product={products[0]} />
                </motion.div>
              )}
              {products[3] && (
                <motion.div variants={fadeInUp}>
                  <ProductCard product={products[3]} />
                </motion.div>
              )}
            </motion.div>

            <motion.div style={{ y: yCenter }} className="flex flex-col gap-12">
              {products[1] && (
                <motion.div variants={fadeInUp}>
                  <ProductCard product={products[1]} />
                </motion.div>
              )}
              {products[4] && (
                <motion.div variants={fadeInUp}>
                  <ProductCard product={products[4]} />
                </motion.div>
              )}
            </motion.div>

            <motion.div style={{ y: yRight }} className="flex flex-col gap-12 pt-24">
              {products[2] && (
                <motion.div variants={fadeInUp}>
                  <ProductCard product={products[2]} />
                </motion.div>
              )}
              {products[5] && (
                <motion.div variants={fadeInUp}>
                  <ProductCard product={products[5]} />
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center lg:mt-24"
        >
          <Link
            to="/shop"
            className="inline-flex items-center border-b border-foreground pb-1 text-sm tracking-[0.2em] uppercase transition-colors duration-300 hover:border-transparent"
          >
            View Full Collection
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export const CollectionGrid = () => {
  const { data, isLoading } = useProductsQuery({ per_page: 12, page: 1 })
  const products = data?.products || []

  if (isLoading) {
    return (
      <section className="px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl text-center">
          <p className="animate-pulse text-muted-foreground">Loading Collection...</p>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return null
  }

  return <CollectionGridContent products={products} />
}
