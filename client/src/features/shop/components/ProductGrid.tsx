import { ProductGridSkeleton } from "@/components/common/LoadingSkeleton"
import { ProductCard } from "@/components/common/ProductCard"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import type { CatalogProduct } from "@/types"
import { ShoppingBag01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type ProductGridProps = {
  products: CatalogProduct[]
  isLoading: boolean
  cols?: 2 | 4
}

export const ProductGrid = ({ products, isLoading, cols = 4 }: ProductGridProps) => {
  if (isLoading && products.length === 0) {
    return <ProductGridSkeleton count={cols === 2 ? 4 : 8} />
  }

  if (products.length === 0) {
    return (
      <div className="flex w-full items-center justify-center py-20">
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
      </div>
    )
  }

  return (
    <div
      className={
        cols === 2
          ? "grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-12"
          : "grid grid-cols-2 gap-6 md:grid-cols-3 lg:gap-8 xl:grid-cols-4"
      }
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid
