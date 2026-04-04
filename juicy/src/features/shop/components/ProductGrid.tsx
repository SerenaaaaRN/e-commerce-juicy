import { ProductCard } from "./ProductCard"
import { ProductGridSkeleton } from "@/components/common/LoadingSkeleton"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import type { CatalogProduct } from "@/types"

type ProductGridProps = {
  products: CatalogProduct[]
  isLoading: boolean
}

export const ProductGrid = ({ products, isLoading }: ProductGridProps) => {
  if (isLoading) {
    return <ProductGridSkeleton count={6} />
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center py-20 w-full">
        <Empty className="border-none max-w-md bg-transparent">
          <EmptyHeader>
            <EmptyTitle className="font-['Space_Grotesk'] text-lg font-bold tracking-widest uppercase">
              No Items Found
            </EmptyTitle>
            <EmptyDescription className="text-xs text-muted-foreground uppercase tracking-widest leading-relaxed mt-2">
              We couldn't find any silhouettes matching your current criteria. Try adjusting or clearing your filters.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid
