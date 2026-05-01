import { useProductStore } from "@/stores/productStore"
import { ProductCard } from "@/features/shop/components/ProductCard"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRightIcon } from "@hugeicons/core-free-icons"
import type { CatalogProduct } from "@/types"

const FALLBACKS: CatalogProduct[] = [
  {
    id: "t1",
    name: "Linen Trench Coat",
    slug: "linen-trench-coat",
    price: 1850000,
    compare_at_price: 2400000,
    is_featured: true,
    tags: ["popular"],
    primary_image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop",
    category_name: "Outerwear",
    avg_rating: 4.9,
    review_count: 14,
  },
  {
    id: "t2",
    name: "Slouchy Tailored Trouser",
    slug: "slouchy-tailored-trouser",
    price: 950000,
    is_featured: true,
    tags: ["popular"],
    primary_image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop",
    category_name: "Bottoms",
    avg_rating: 4.7,
    review_count: 22,
  },
  {
    id: "t3",
    name: "Minimalist Slip Dress",
    slug: "minimalist-slip-dress",
    price: 1200000,
    compare_at_price: 1500000,
    is_featured: true,
    tags: ["popular", "bestseller"],
    primary_image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop",
    category_name: "Dresses",
    avg_rating: 4.8,
    review_count: 31,
  },
  {
    id: "t4",
    name: "Classic Atelier Vest",
    slug: "classic-atelier-vest",
    price: 780000,
    is_featured: true,
    tags: ["popular"],
    primary_image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
    category_name: "Tops",
    avg_rating: 4.6,
    review_count: 19,
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
      className="relative overflow-hidden bg-background py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,var(--color-gold-subtle)_0%,transparent_60%)]" />

      <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="gsap-reveal mb-16 flex items-end justify-between md:mb-20">
          <div className="flex items-start gap-6">
            {/* Oversized index number */}
            <span className="hidden font-heading text-7xl leading-none font-extralight text-foreground/6 select-none md:block md:text-[6.5rem]">
              01
            </span>
            <div className="flex flex-col gap-2 md:pt-4">
              <span className="flex items-center gap-2.5 font-mono text-[9px] font-bold tracking-[0.4em] text-(--color-gold) uppercase">
                <span className="size-1 rotate-45 bg-(--color-gold)" />
                Trending Now
              </span>
              <h2 className="font-heading text-3xl leading-none font-bold tracking-tight text-foreground md:text-4xl">
                Sedang Tren
              </h2>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hidden text-[10px] font-semibold tracking-wider text-muted-foreground uppercase transition-colors hover:text-(--color-gold) sm:flex"
          >
            <Link to="/shop?sort=popular">
              Lihat Semua{" "}
              <HugeiconsIcon icon={ArrowRightIcon} data-icon="inline-end" />
            </Link>
          </Button>
        </div>

        {/* Decorative line */}
        <Separator className="mb-12 h-px bg-linear-to-r from-transparent via-(--color-gold) to-transparent md:mb-16" />

        {/* Desktop: staggered editorial grid */}
        <div className="hidden grid-cols-4 gap-6 md:grid lg:gap-8">
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
          className="-mx-4 flex snap-x snap-mandatory scrollbar-none gap-4 overflow-x-auto px-4 md:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="gsap-stagger-item w-65 shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="text-[10px] tracking-wider uppercase"
          >
            <Link to="/shop?sort=popular">
              Lihat Semua{" "}
              <HugeiconsIcon icon={ArrowRightIcon} data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
