import { ProductCard } from "@/components/common/ProductCard"
import { ROUTES } from "@/constants/paths"
import { useProductsQuery } from "@/features/shop/hooks/useProductQueries"
import { motion } from "motion/react"
import { Link } from "react-router-dom"

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

  // Fallback to empty grid if no products
  if (products.length === 0) {
    return null
  }

  return (
    <section className="px-6 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
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

        {/* Asymmetrical grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {/* First row - offset layout */}
          {products[0] && (
            <div className="lg:pt-12">
              <ProductCard product={products[0]} />
            </div>
          )}
          {products[1] && (
            <div>
              <ProductCard product={products[2]} />
            </div>
          )}
          {products[2] && (
            <div className="lg:pt-24">
              <ProductCard product={products[3]} />
            </div>
          )}

          {/* Second row - different offset */}
          {products[3] && (
            <div>
              <ProductCard product={products[4]} />
            </div>
          )}
          {products[4] && (
            <div className="lg:pt-16">
              <ProductCard product={products[5]} />
            </div>
          )}
          {products[5] && (
            <div className="lg:-mt-8">
              <ProductCard product={products[9]} />
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center lg:mt-24"
        >
          <Link
            to={ROUTES.shop}
            className="inline-flex items-center border-b border-foreground pb-1 text-sm tracking-[0.2em] uppercase transition-colors duration-300 hover:border-transparent"
          >
            View Full Collection
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
