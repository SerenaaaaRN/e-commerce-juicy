import { useRef, useMemo } from "react"
import { Link } from "react-router-dom"
import { motion, useScroll, useTransform, useSpring } from "motion/react"
import { useReducedMotion } from "motion/react"
import { useProductsQuery } from "@/features/shop/hooks/useProductQueries"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { scrollSpring } from "@/lib/animations"

export const NewArrivals = () => {
  const { data: productsData } = useProductsQuery({ tag: "new-arrival", per_page: 6 })
  const products = productsData?.products ?? []
  const displayProducts = useMemo(() => products.filter((p) => p.tags?.includes("new-arrival")).slice(0, 6), [products])
  const sectionRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, scrollSpring)

  const totalSlides = displayProducts.length
  const trackWidth = totalSlides * 100

  const x = useTransform(smoothProgress, [0, 1], ["0%", `-${trackWidth - 100}%`])

  if (displayProducts.length === 0) return null

  return (
    <section
      ref={sectionRef}
      data-section="new-arrivals"
      className="relative bg-black"
      style={{ height: `${totalSlides * 120}dvh` }}
    >
      {/* Sticky pinned container */}
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden bg-black">
        {/* Horizontal track of slides */}
        <motion.div className="flex h-full items-center will-change-transform" style={{ x: prefersReduced ? "0%" : x }}>
          {displayProducts.map((product, i) => (
            <SlideContent
              key={product.id}
              product={product}
              index={i}
              total={totalSlides}
              scrollProgress={smoothProgress}
              reduce={prefersReduced}
            />
          ))}
        </motion.div>

        {/* Overlay gradients at edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-linear-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-linear-to-l from-black to-transparent" />

        {/* Fixed right-side product info panel */}
        <ProductInfoPanel products={displayProducts} scrollProgress={smoothProgress} />
      </div>
    </section>
  )
}

import type { MotionValue } from "motion/react"
import type { CatalogProduct } from "@/types"

type SlideContentProps = {
  product: CatalogProduct
  index: number
  total: number
  scrollProgress: MotionValue<number>
  reduce: boolean | null
}

const SlideContent = ({ product, index, total, scrollProgress, reduce }: SlideContentProps) => {
  const slideStart = index / total
  const slideEnd = (index + 1) / total
  const opacity = useTransform(scrollProgress, [slideStart, slideEnd], [0.4, 1])
  const scale = useTransform(scrollProgress, [slideStart, slideEnd], [0.92, 1])

  return (
    <div className="flex h-full w-screen shrink-0 items-center justify-center px-4 sm:px-12 lg:px-24">
      <motion.div
        className="relative h-[70vh] w-full max-w-5xl overflow-hidden"
        style={{ opacity: reduce ? 1 : opacity, scale: reduce ? 1 : scale }}
      >
        <img src={product.primary_image || "/placeholder.webp"} alt={product.name} className="size-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/10" />

        {/* Slide counter */}
        <div className="absolute top-6 left-6 flex items-center gap-3 font-mono">
          <span className="text-xs font-bold text-white">{String(index + 1).padStart(2, "0")}</span>
          <Separator className="h-px w-6 bg-white/20" />
          <span className="text-[10px] text-white/30">{String(total).padStart(2, "0")}</span>
        </div>
      </motion.div>
    </div>
  )
}

type ProductInfoPanelProps = {
  products: CatalogProduct[]
  scrollProgress: MotionValue<number>
}

const ProductInfoPanel = ({ products, scrollProgress }: ProductInfoPanelProps) => {
  return (
    <div className="pointer-events-none absolute top-0 right-0 z-20 flex h-full w-80 items-center justify-end pr-8 lg:pr-16">
      <div className="flex flex-col gap-2 text-right">
        <motion.span className="font-mono text-[9px] font-bold tracking-[0.4em] text-(--color-gold) uppercase">
          New Arrivals
        </motion.span>
        <div className="h-20 overflow-hidden">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              className="flex flex-col gap-1"
              style={{
                opacity: useTransform(
                  scrollProgress,
                  [(i - 0.5) / products.length, i / products.length, (i + 0.5) / products.length],
                  [0, 1, 0]
                ),
                y: useTransform(scrollProgress, [i / products.length, (i + 1) / products.length], ["0%", "-100%"]),
              }}
            >
              <span className="font-heading text-2xl leading-none font-bold text-white md:text-3xl">
                {product.name.length > 25 ? product.name.slice(0, 22) + "..." : product.name}
              </span>
              <span className="font-mono text-sm text-white/30">{product.category_name}</span>
              <span className="font-mono text-base font-semibold text-(--color-gold)">
                {formatPrice(product.price)}
              </span>
            </motion.div>
          ))}
        </div>
        <Link
          to={`/shop/${products[0]?.slug}`}
          className="group pointer-events-auto mt-4 inline-flex items-center justify-end gap-3"
        >
          <span className="text-[10px] font-bold tracking-[0.3em] text-(--color-gold) uppercase">Discover</span>
          <Separator className="h-px w-8 bg-(--color-gold) transition-all duration-500 group-hover:w-14" />
          <span className="text-[10px] text-(--color-gold)">→</span>
        </Link>
      </div>
    </div>
  )
}

export default NewArrivals
