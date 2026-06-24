import { cn, formatPrice } from "@/lib/utils"
import type { CatalogProduct } from "@/types"
import { motion, type Variants } from "motion/react"
import { useState } from "react"
import { Link } from "react-router-dom"

type ProductCardProps = {
  product: CatalogProduct
  variants?: Variants
}

export const ProductCard = ({ product, variants }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const images = product.images?.filter((img) => img.image_url) ?? []
  const hoverImage = images.length > 1 ? images[1].image_url : product.primary_image
  const hasCustomVariants = !!variants

  return (
    <motion.div
      variants={variants}
      {...(!hasCustomVariants
        ? {
            initial: { opacity: 0, y: 30 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: "-50px" },
            transition: { duration: 0.6, ease: "easeOut" },
          }
        : {})}
    >
      <Link
        to={`/shop/${product.slug}`}
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative mb-4 aspect-3/4 overflow-hidden bg-muted">
          <img
            src={product.primary_image || "/placeholder.webp"}
            alt={product.name}
            loading="lazy"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out",
              isHovered ? "opacity-0" : "opacity-100"
            )}
          />
          <img
            src={hoverImage || "/placeholder.webp"}
            alt={`${product.name} alternate view`}
            loading="lazy"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          />
          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.1)]"
          />
        </div>

        <div className="space-y-1">
          <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase">{product.category_name}</p>
          <h3 className="text-md font-serif">{product.name}</h3>
          <p className="text-sm tracking-wide text-muted-foreground">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard
