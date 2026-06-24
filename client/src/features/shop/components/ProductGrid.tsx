import { ProductGridSkeleton } from "@/components/common/LoadingSkeleton"
import { ProductCard } from "@/components/common/ProductCard"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { fadeIn, fadeInUp, staggerContainer } from "@/lib/animations"
import type { CatalogProduct } from "@/types"
import { ShoppingBag01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatePresence, motion } from "motion/react"

type ProductGridProps = {
  products: CatalogProduct[]
  isLoading: boolean
  cols?: 2 | 4
}

export const ProductGrid = ({ products, isLoading, cols = 4 }: ProductGridProps) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading && products.length === 0 ? (
        <motion.div
          key="skeleton"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={fadeIn}
        >
          <ProductGridSkeleton count={cols === 2 ? 4 : 8} />
        </motion.div>
      ) : products.length === 0 ? (
        <motion.div
          key="empty"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={fadeIn}
          className="flex w-full items-center justify-center py-20"
        >
          <Empty className="max-w-md border-none bg-transparent">
            <EmptyHeader>
              <EmptyMedia
                variant="icon"
                className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/5 text-primary"
              >
                <HugeiconsIcon icon={ShoppingBag01Icon} strokeWidth={1.8} className="size-6 text-primary" />
              </EmptyMedia>
              <EmptyTitle className="text-xl font-bold tracking-tight">No Items Found</EmptyTitle>
              <EmptyDescription className="mt-2 text-sm text-muted-foreground">
                We couldn't find any silhouettes matching your current criteria. Try adjusting or clearing your filters.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </motion.div>
      ) : (
        <motion.div
          key="grid"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className={
            cols === 2
              ? "grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-12"
              : "grid grid-cols-2 gap-6 md:grid-cols-3 lg:gap-8 xl:grid-cols-4"
          }
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={fadeInUp}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ProductGrid
