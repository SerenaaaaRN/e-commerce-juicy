import { Link } from "react-router-dom";
import type { Product } from "@/features/shop/types/shop.types";
import { Badge } from "@/components/ui/badge";
import StarRating from "./StarRating";

type ProductCardProps = {
  product: Product;
  className?: string;
};

const ProductCard = ({ product, className }: ProductCardProps) => {
  const hasSale = product.compare_at_price !== null && product.compare_at_price > product.price;

  // Formatting utility for IDR Currency
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("id-IDR", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className={`group flex flex-col gap-0 select-none ${className}`}
    >
      {/* Product Image Wrapper */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-cream">
        <img
          src={product.primary_image}
          alt={product.name}
          className="size-full object-cover transition-transform duration-[400ms] ease-out group-hover:scale-103"
          loading="lazy"
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.tags.map((tag) => {
            if (tag === "sale" && hasSale) {
              return (
                <Badge key={tag} variant="sale">
                  Sale
                </Badge>
              );
            }
            return (
              <Badge key={tag} variant="primary">
                {tag.replace("-", " ")}
              </Badge>
            );
          })}
          {!product.is_available && (
            <Badge variant="outline" className="bg-chalk/80 text-dust border-sand">
              Sold Out
            </Badge>
          )}
        </div>
      </div>

      {/* Info block - stacked with 0px gap as requested by design guidelines */}
      <div className="pt-3 flex flex-col gap-1 font-dm-sans bg-transparent">
        
        {/* Rating if present */}
        {product.avg_rating > 0 && (
          <div className="flex items-center gap-1">
            <StarRating rating={product.avg_rating} starClassName="size-3" />
            <span className="text-[10px] text-dust font-normal">({product.review_count})</span>
          </div>
        )}

        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium text-soil group-hover:text-terracotta transition-colors duration-300 truncate">
            {product.name}
          </h4>
          <span className="text-xs text-dust/70 tracking-widest font-normal uppercase">
            {product.category.name}
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-semibold text-terracotta">
            {formatPrice(product.price)}
          </span>
          {hasSale && (
            <span className="text-[11px] text-sand line-through font-normal">
              {formatPrice(product.compare_at_price!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
