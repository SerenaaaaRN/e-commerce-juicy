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
    <Card className="group flex flex-col gap-0 overflow-visible rounded-none border-none bg-transparent p-0 text-left shadow-none ring-0 select-none">
      {/* Clickable Image Container */}
      <Link
        to={`/shop/${product.slug}`}
        className="relative block overflow-hidden border border-foreground/5 bg-muted shadow-sm"
      >
        <AspectRatio ratio={3 / 4}>
          {/* Hover zoom product picture */}
          <img
            src={product.primary_image || "/placeholder.webp"}
            alt={product.name}
            className="size-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103"
            loading="lazy"
          />

          {/* Luxury frame overlay */}
          <div className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-500 group-hover:border-foreground/10" />

          {/* Quick interactive action indicator */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full border-t border-border bg-background/90 py-2 text-center backdrop-blur-xs transition-transform duration-300 group-hover:translate-y-0">
            <span className="text-[9px] font-bold tracking-widest text-foreground uppercase">View Silhouette</span>
          </div>
        </AspectRatio>

        {/* Dynamic product tags */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.is_featured ? (
            <Badge
              variant="secondary"
              className="rounded-none border-none px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase"
            >
              Bestseller
            </Badge>
          ) : null}
          {hasDiscount ? (
            <Badge
              variant="destructive"
              className="rounded-none border-none px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase"
            >
              Sale
            </Badge>
          ) : null}
        </div>

        {/* Rating embedded tag */}
        {product.avg_rating > 0 ? (
          <div className="absolute top-3 right-3 flex items-center gap-1 border border-border/40 bg-background/80 px-1.5 py-0.5 text-[9px] font-bold text-foreground backdrop-blur-xs [&_svg]:size-2.5">
            <HugeiconsIcon icon={StarIcon} strokeWidth={2} className="fill-primary text-primary" />
            <span>{product.avg_rating.toFixed(1)}</span>
          </div>
        ) : null}
      </Link>

      {/* Info Card Content */}
      <CardContent className="flex flex-col gap-1 px-0 pt-3.5 pb-2 text-left">
        {/* Category */}
        <span className="text-[9px] font-semibold tracking-widest text-muted-foreground/80 uppercase">
          {product.category_name}
        </span>

        {/* Product Title */}
        <Link to={`/shop/${product.slug}`} className="block">
          <h3 className="truncate font-heading text-xs font-semibold tracking-wide text-foreground uppercase transition-colors duration-300 group-hover:text-primary">
            {product.name}
          </h3>
        </Link>

        {/* Price details */}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="font-mono text-xs font-semibold tracking-wider text-foreground">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && product.compare_at_price ? (
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground line-through">
              {formatPrice(product.compare_at_price)}
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductCard
