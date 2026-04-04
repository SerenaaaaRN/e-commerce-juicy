import { useEffect } from "react"
import { useProductStore } from "@/stores/productStore"
import { ProductCard } from "@/features/shop/components/ProductCard"
import { ProductGridSkeleton } from "@/components/common/LoadingSkeleton"
import { Separator } from "@/components/ui/separator"
import type { CatalogProduct } from "@/types"

// High-fidelity fallback catalog products for editorial presentation in case seed is empty
const EDITORIAL_FALLBACKS: CatalogProduct[] = [
  {
    id: "f1",
    name: "Linen Trench Coat",
    slug: "linen-trench-coat",
    price: 1850000,
    compare_at_price: 2400000,
    is_featured: true,
    tags: ["new-arrival"],
    primary_image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop",
    category_name: "Outerwear",
    avg_rating: 4.9,
    review_count: 14,
  },
  {
    id: "f2",
    name: "Slouchy Tailored Trouser",
    slug: "slouchy-tailored-trouser",
    price: 950000,
    is_featured: true,
    tags: ["classic"],
    primary_image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop",
    category_name: "Bottoms",
    avg_rating: 4.7,
    review_count: 22,
  },
  {
    id: "f3",
    name: "Minimalist Slip Dress",
    slug: "minimalist-slip-dress",
    price: 1200000,
    compare_at_price: 1500000,
    is_featured: true,
    tags: ["bestseller", "sale"],
    primary_image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop",
    category_name: "Dresses",
    avg_rating: 4.8,
    review_count: 31,
  },
  {
    id: "f4",
    name: "Classic Atelier Vest",
    slug: "classic-atelier-vest",
    price: 780000,
    is_featured: true,
    tags: ["new"],
    primary_image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
    category_name: "Tops",
    avg_rating: 4.6,
    review_count: 19,
  },
 ]

export const FeaturedSection = () => {
  const { featuredProducts, isLoading, fetchFeaturedProducts } = useProductStore()

  useEffect(() => {
    fetchFeaturedProducts()
  }, [fetchFeaturedProducts])

  // Use real backend products if available, otherwise fall back to elegant design placeholders
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : EDITORIAL_FALLBACKS

  return (
    <section id="featured" className="py-20 bg-background">
      <Separator className="mb-20" />
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 text-left gap-4">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase block">
              Atelier Curator Highlights
            </span>
            <h2 className="font-['Space_Grotesk'] text-3xl font-semibold uppercase tracking-wider text-foreground">
              Bestseller Silhouettes
            </h2>
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest max-w-sm leading-relaxed">
            A selective edit of our signature, most sought-after silhouettes. Handcrafted using premium European flax fiber.
          </p>
        </div>

        {/* Dynamic Products Grid / Skeleton */}
        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {displayProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </section>
  )
}

export default FeaturedSection
