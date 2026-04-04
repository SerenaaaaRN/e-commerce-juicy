import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import { StarIcon } from "@hugeicons/core-free-icons"
import type { CatalogProduct } from "@/types"

type ProductCardProps = {
  product: CatalogProduct
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
  
  // Helper to format currency
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card className="group overflow-hidden rounded-none border border-transparent hover:border-foreground/10 bg-transparent transition-all duration-300">
      
      {/* Clickable Image Gallery Anchor */}
      <Link to={`/shop/${product.slug}`} className="relative block aspect-[3/4] w-full overflow-hidden bg-muted">
        
        {/* Hover zoom product picture */}
        <img
          src={product.primary_image || "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=400&auto=format&fit=crop"}
          alt={product.name}
          className="size-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Dynamic product tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.is_featured && (
            <Badge className="rounded-none text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 border-none">
              Bestseller
            </Badge>
          )}
          {hasDiscount && (
            <Badge variant="destructive" className="rounded-none text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 border-none">
              Sale
            </Badge>
          )}
        </div>
      </Link>

      {/* Info Card Content */}
      <CardContent className="pt-4 px-1 pb-2 flex flex-col gap-1.5 text-left">
        
        {/* Category & Ratings row */}
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>{product.category_name}</span>
          {product.avg_rating > 0 && (
            <div className="flex items-center gap-1 font-semibold text-primary">
              <HugeiconsIcon icon={StarIcon} strokeWidth={2} className="size-3 fill-current" />
              <span>{product.avg_rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Product Title */}
        <Link to={`/shop/${product.slug}`} className="block">
          <h3 className="font-['Space_Grotesk'] text-sm font-semibold tracking-wide text-foreground uppercase truncate group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        {/* Price list details */}
        <div className="flex items-baseline gap-2 font-mono text-xs">
          <span className="font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && product.compare_at_price && (
            <span className="text-muted-foreground line-through text-[11px]">
              {formatPrice(product.compare_at_price)}
            </span>
          )}
        </div>

      </CardContent>

      <CardFooter className="p-0" />
    </Card>
  )
}

export default ProductCard
