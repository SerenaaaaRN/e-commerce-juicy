import { StarRating } from "./StarRating"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"

type ProductInfoProps = {
  name: string
  categoryName: string
  price: number
  compareAtPrice?: number
  avgRating: number
  reviewCount: number
  description?: string
  tags: string[]
}

export const ProductInfo = ({
  name,
  categoryName,
  price,
  compareAtPrice,
  avgRating,
  reviewCount,
  description,
  tags,
}: ProductInfoProps) => {
  const hasDiscount = compareAtPrice && compareAtPrice > price

  return (
    <div className="flex flex-col gap-5 text-left">
      
      {/* Category & Tags Row */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold tracking-wider text-primary uppercase">
          {categoryName}
        </span>
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="font-semibold px-2 py-0.5 border-none">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Product Title */}
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
        {name}
      </h1>

      {/* Ratings Summary */}
      <div className="flex items-center gap-3 text-xs tracking-wider uppercase text-muted-foreground">
        <StarRating rating={avgRating} />
        {avgRating > 0 ? (
          <span>
            {avgRating.toFixed(1)} ({reviewCount} verified reviews)
          </span>
        ) : (
          <span>No reviews yet</span>
        )}
      </div>

      {/* Prices List */}
      <div className="flex items-baseline gap-3 pt-2 font-mono border-t border-foreground/5">
        <span className="text-2xl font-bold text-foreground">
          {formatPrice(price)}
        </span>
        {hasDiscount && compareAtPrice && (
          <span className="text-muted-foreground line-through text-sm">
            {formatPrice(compareAtPrice)}
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <div className="pt-4 border-t border-foreground/5 text-sm text-muted-foreground leading-relaxed">
          <p>{description}</p>
        </div>
      )}

    </div>
  )
}

export default ProductInfo
