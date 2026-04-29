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

const STAGGER_OFFSETS = ["mt-0", "mt-12", "mt-4", "mt-16"]

export const TrendingNow = () => {
  const { featuredProducts } = useProductStore()
  const realTrending = featuredProducts.slice(0, 4)
  const displayProducts = realTrending.length > 0 ? realTrending : FALLBACKS

  return (
    <section
      data-section="trending"
      className="relative py-24 md:py-32 bg-background overflow-hidden"
    >
      {/* Subtle radial depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,var(--color-gold-subtle)_0%,transparent_60%)] pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Section header — editorial style */}
        <div className="flex items-end justify-between mb-16 md:mb-20 gsap-reveal">
          <div className="flex items-start gap-6">
            {/* Oversized index number */}
            <span className="text-7xl md:text-[6.5rem] font-heading font-extralight text-foreground/[0.06] leading-none select-none hidden md:block">
              01
            </span>
            <div className="flex flex-col gap-2 md:pt-4">
              <span className="text-[9px] font-bold tracking-[0.4em] text-(--color-gold) uppercase font-mono flex items-center gap-2.5">
                <span className="size-1 rotate-45 bg-[var(--color-gold)]" />
                Trending Now
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-heading leading-none">
                Sedang Tren
              </h2>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild className="hidden sm:flex gap-1.5 text-[10px] tracking-wider uppercase font-semibold text-muted-foreground hover:text-[var(--color-gold)] transition-colors">
            <Link to="/shop?sort=popular">
              Lihat Semua <HugeiconsIcon icon={ArrowRightIcon} className="size-3" />
            </Link>
          </Button>
        </div>

        {/* Decorative line */}
        <div className="accent-line-gold mb-12 md:mb-16" />

        {/* Desktop: staggered editorial grid */}
        <div className="hidden md:grid grid-cols-4 gap-6 lg:gap-8">
          {displayProducts.map((product, i) => (
            <div
              key={product.id}
              className={`gsap-stagger-item will-change-transform ${STAGGER_OFFSETS[i] ?? "mt-0"}`}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile: horizontal scroll */}
        <div
          className="flex md:hidden gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-4 px-4"
          style={{ scrollbarWidth: "none" }}
        >
          {displayProducts.map((product) => (
            <div key={product.id} className="snap-start shrink-0 w-[260px] gsap-stagger-item">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="flex sm:hidden justify-center mt-10">
          <Button variant="outline" size="sm" asChild className="text-[10px] tracking-wider uppercase">
            <Link to="/shop?sort=popular">
              Lihat Semua <HugeiconsIcon icon={ArrowRightIcon} className="size-3 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
