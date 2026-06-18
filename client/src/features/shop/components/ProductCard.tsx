import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { HugeiconsIcon } from "@hugeicons/react"
import { StarIcon } from "@hugeicons/core-free-icons"
import { formatPrice } from "@/lib/utils"
import { tactileBounce } from "@/lib/animations"
import type { CatalogProduct } from "@/types"

type ProductCardProps = {
  product: CatalogProduct
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={tactileBounce}
      className="group"
    >
      <Card className="flex flex-col gap-0 overflow-visible rounded-none border-none bg-transparent p-0 text-left shadow-none ring-0 select-none">
        {/* Clickable Image Container */}
        <Link
          to={`/shop/${product.slug}`}
          className="relative block overflow-hidden border border-foreground/5 bg-muted shadow-sm"
        >
          <AspectRatio ratio={3 / 4}>
            {/* Hover zoom product picture */}
            <motion.img
              src={product.primary_image || "/placeholder.webp"}
              alt={product.name}
              className="size-full object-cover object-center"
              loading="lazy"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Luxury frame overlay */}
            <motion.div
              className="pointer-events-none absolute inset-0 border border-transparent"
              whileHover={{ borderColor: "rgba(181,99,58,0.15)" }}
              transition={{ duration: 0.4 }}
            />

            {/* Quick interactive action indicator */}
            <motion.div
              className="pointer-events-none absolute inset-x-0 bottom-0 border-t border-border bg-background/90 py-2 text-center backdrop-blur-xs"
              initial={{ y: "100%" }}
              whileHover={{ y: 0 }}
              transition={tactileBounce}
            >
              <span className="text-[9px] font-bold tracking-widest text-foreground uppercase">View Silhouette</span>
            </motion.div>
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
    </motion.div>
  )
}

export default ProductCard
