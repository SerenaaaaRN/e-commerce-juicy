import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { ProductCard } from "@/features/shop/components/ProductCard"
import { useProductsQuery } from "@/features/shop/hooks/useProductQueries"
import { ROUTES } from "@/constants/routes"

export const CollectionGrid = () => {
  const { data, isLoading } = useProductsQuery({ limit: 12, page: 1 })
  const products = data?.products || []

  if (isLoading) {
    return (
      <section className="py-24 lg:py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground animate-pulse">Loading Collection...</p>
        </div>
      </section>
    )
  }

  // Fallback to empty grid if no products
  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-24"
        >
          <h2 className="font-serif text-3xl lg:text-5xl mb-4">Curated Selection</h2>
          <p className="text-muted-foreground tracking-wide max-w-md mx-auto">
            Each piece tells a story of meticulous craftsmanship
          </p>
        </motion.div>

        {/* Asymmetrical grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
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
          className="text-center mt-16 lg:mt-24"
        >
          <Link
            to={ROUTES.shop}
            className="inline-flex items-center text-sm tracking-[0.2em] uppercase border-b border-foreground pb-1 hover:border-transparent transition-colors duration-300"
          >
            View Full Collection
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
