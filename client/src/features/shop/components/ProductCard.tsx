import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { HugeiconsIcon } from "@hugeicons/react"
import { StarIcon } from "@hugeicons/core-free-icons"
import { formatPrice } from "@/lib/utils"
import type { CatalogProduct } from "@/types"

type ProductCardProps = {
  product: CatalogProduct
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price

  return (
    <Card className="group flex flex-col bg-transparent border-none ring-0 shadow-none text-left select-none rounded-none p-0 gap-0 overflow-visible">
      {/* Clickable Image Container */}
      <Link to={`/shop/${product.slug}`} className="block overflow-hidden bg-muted relative border border-foreground/5 shadow-sm">
        <AspectRatio ratio={3 / 4}>
          {/* Hover zoom product picture */}
          <img
            src={product.primary_image || "/placeholder.webp"}
            alt={product.name}
            className="size-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103"
            loading="lazy"
          />

          {/* Luxury frame overlay */}
          <div className="absolute inset-0 border border-transparent transition-colors duration-500 group-hover:border-foreground/10 pointer-events-none" />

          {/* Quick interactive action indicator */}
          <div className="absolute inset-x-0 bottom-0 bg-background/90 backdrop-blur-xs py-2 text-center border-t border-border translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
            <span className="text-[9px] font-bold tracking-widest uppercase text-foreground">
              View Silhouette
            </span>
          </div>
        </AspectRatio>

        {/* Dynamic product tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.is_featured && (
            <Badge variant="secondary" className="font-bold tracking-wider text-[9px] uppercase px-2 py-0.5 rounded-none border-none">
              Bestseller
            </Badge>
          )}
          {hasDiscount && (
            <Badge variant="destructive" className="font-bold tracking-wider text-[9px] uppercase px-2 py-0.5 rounded-none border-none">
              Sale
            </Badge>
          )}
        </div>

        {/* Rating embedded tag */}
        {product.avg_rating > 0 && (
          <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-xs px-1.5 py-0.5 flex items-center gap-1 text-[9px] font-bold text-foreground border border-border/40 [&_svg]:size-2.5">
            <HugeiconsIcon icon={StarIcon} strokeWidth={2} className="fill-primary text-primary" />
            <span>{product.avg_rating.toFixed(1)}</span>
          </div>
        )}
      </Link>

      {/* Info Card Content */}
      <CardContent className="pt-3.5 pb-2 px-0 flex flex-col gap-1 text-left">
        {/* Category */}
        <span className="text-[9px] font-semibold tracking-widest text-muted-foreground/80 uppercase">
          {product.category_name}
        </span>

        {/* Product Title */}
        <Link to={`/shop/${product.slug}`} className="block">
          <h3 className="font-heading text-xs font-semibold tracking-wide uppercase text-foreground transition-colors duration-300 group-hover:text-primary truncate">
            {product.name}
          </h3>
        </Link>

        {/* Price details */}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="font-mono text-xs font-semibold tracking-wider text-foreground">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && product.compare_at_price && (
            <span className="text-muted-foreground line-through font-mono text-[10px] tracking-wider">
              {formatPrice(product.compare_at_price)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductCard
