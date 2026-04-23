import { ProductCard } from "./ProductCard"
import { ProductGridSkeleton } from "@/components/common/LoadingSkeleton"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import type { CatalogProduct } from "@/types"

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
      <div className="flex justify-center items-center py-20 w-full">
        <Empty className="border-none max-w-md bg-transparent">
          <EmptyHeader>
            <EmptyTitle className="text-lg font-bold">
              No Items Found
            </EmptyTitle>
            <EmptyDescription className="text-sm text-muted-foreground mt-2">
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
          ? "grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12"
          : "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
      }
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid
