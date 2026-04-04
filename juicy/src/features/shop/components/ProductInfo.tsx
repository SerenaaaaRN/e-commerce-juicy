import { StarRating } from "./StarRating"
import { Badge } from "@/components/ui/badge"

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
  
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="flex flex-col gap-5 text-left">
      
      {/* Category & Tags Row */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase">
          {categoryName}
        </span>
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-none font-semibold border-none">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Product Title */}
      <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-semibold tracking-wide text-foreground uppercase">
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
        <div className="pt-4 border-t border-foreground/5 text-xs uppercase tracking-widest text-muted-foreground leading-relaxed">
          <p>{description}</p>
        </div>
      )}

    </div>
  )
}

export default ProductInfo
