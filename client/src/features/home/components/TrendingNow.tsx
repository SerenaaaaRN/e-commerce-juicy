import { useRef, useEffect, useState } from "react"
import { useProductStore } from "@/stores/productStore"
import { ProductCard } from "@/features/shop/components/ProductCard"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRightIcon } from "@hugeicons/core-free-icons"
import type { CatalogProduct } from "@/types"

const FALLBACKS: CatalogProduct[] = [
  {
    id: "t1", name: "Linen Trench Coat", slug: "linen-trench-coat", price: 1850000,
    compare_at_price: 2400000, is_featured: true, tags: ["popular"],
    primary_image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop",
    category_name: "Outerwear", avg_rating: 4.9, review_count: 14,
  },
  {
    id: "t2", name: "Slouchy Tailored Trouser", slug: "slouchy-tailored-trouser", price: 950000,
    is_featured: true, tags: ["popular"],
    primary_image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop",
    category_name: "Bottoms", avg_rating: 4.7, review_count: 22,
  },
  {
    id: "t3", name: "Minimalist Slip Dress", slug: "minimalist-slip-dress", price: 1200000,
    compare_at_price: 1500000, is_featured: true, tags: ["popular", "bestseller"],
    primary_image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop",
    category_name: "Dresses", avg_rating: 4.8, review_count: 31,
  },
  {
    id: "t4", name: "Classic Atelier Vest", slug: "classic-atelier-vest", price: 780000,
    is_featured: true, tags: ["popular"],
    primary_image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
    category_name: "Tops", avg_rating: 4.6, review_count: 19,
  },
]

export const TrendingNow = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { featuredProducts } = useProductStore()
  const realTrending = featuredProducts.slice(0, 4)
  const displayProducts = realTrending.length > 0 ? realTrending : FALLBACKS

  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold tracking-wider text-primary uppercase flex items-center gap-2">
              <span className="inline-block size-1.5 rounded-full bg-primary animate-pulse" />
              Trending Now
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mt-2">
              Sedang Tren
            </h2>
          </div>
          <Button variant="ghost" size="sm" asChild className="hidden sm:flex gap-1">
            <Link to="/shop?sort=popular">
              Lihat Semua <HugeiconsIcon icon={ArrowRightIcon} className="size-3" />
            </Link>
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none px-4 sm:px-6 lg:px-8"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex gap-4 mx-auto" style={{ maxWidth: "calc(1280px - 3rem)" }}>
          {displayProducts.map((product) => (
            <div key={product.id} className="snap-start shrink-0 w-[260px] sm:w-[280px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
