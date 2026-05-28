import { useRef } from "react"
import { Link } from "react-router-dom"
import { useFeaturedProductsQuery } from "@/features/shop/hooks/useProductQueries"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"

export const FeaturedSection = () => {
  const { data: featuredProducts = [] } = useFeaturedProductsQuery()
  const sectionRef = useRef<HTMLDivElement>(null)

  if (featuredProducts.length === 0) return null

  const [hero, ...rest] = featuredProducts

  return (
    <section
      ref={sectionRef}
      data-section="featured"
      className="relative min-h-175 overflow-hidden bg-black md:min-h-212.5"
    >
      {/* Cinematic background */}
      <div className="absolute inset-0">
        <img
          src={hero.primary_image || "/placeholder.webp"}
          alt={hero.name}
          className="size-full scale-[1.02] object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-black/60" />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/20" />
      </div>

      {/* Floating thumbnail rail — right side */}
      <div className="gsap-stagger-item absolute top-8 right-6 z-20 hidden flex-col gap-3 sm:flex md:top-12 md:right-12">
        {rest.slice(0, 3).map((product, i) => (
          <Link
            key={product.id}
            to={`/shop/${product.slug}`}
            className="group block w-20 overflow-hidden border border-white/6 transition-all duration-500 will-change-transform hover:border-(--color-gold-muted) md:w-30"
          >
            <div className="aspect-3/4 overflow-hidden">
              <img
                src={product.primary_image || "/placeholder.webp"}
                alt={product.name}
                className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="bg-white/4 px-2.5 py-2 backdrop-blur-sm">
              <p className="mb-0.5 font-mono text-[8px] text-white/30">{String(i + 1).padStart(2, "0")}</p>
              <p className="truncate text-[9px] font-medium tracking-wide text-white/60">{product.name}</p>
              <p className="mt-0.5 font-mono text-[8px] text-white/30">{formatPrice(product.price)}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto flex h-full min-h-175 max-w-7xl flex-col justify-center px-4 sm:px-6 md:min-h-212.5 lg:px-8">
        <div className="gsap-reveal max-w-2xl">
          <div className="mb-8 flex items-center gap-4">
            <Separator className="h-px w-10 bg-(--color-gold)" />
            <span className="font-mono text-[9px] font-bold tracking-[0.4em] text-(--color-gold) uppercase">
              {hero.category_name}
            </span>
          </div>
          <h2 className="gsap-slide-up font-heading text-5xl leading-[0.88] font-bold tracking-tight text-white sm:text-6xl md:text-8xl">
            Featured
            <br />
            <span className="text-(--color-gold) italic">Edit</span>
          </h2>
          <p className="mt-8 max-w-md text-sm leading-relaxed tracking-wide text-white/40 sm:text-base">
            {hero.category_name} — a curated selection of standout pieces from the current collection.
          </p>
        </div>
      </div>

      {/* Frosted bottom bar */}
      <div className="absolute right-0 bottom-0 left-0 z-10">
        <Separator className="bg-linear-to-r h-px from-transparent via-(--color-gold) to-transparent" />
        <div className="bg-white/4 backdrop-blur-md">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="gsap-fade flex items-center justify-between py-5">
              <div className="flex items-center gap-5">
                <span className="font-mono text-[10px] text-white/25">01</span>
                <span className="size-1 rotate-45 bg-(--color-gold-muted)" />
                <span className="text-[9px] font-medium tracking-[0.3em] text-white/35 uppercase">Featured</span>
              </div>
              <div className="flex items-center gap-5">
                <span className="hidden font-mono text-[10px] text-white/25 sm:block">{hero.name}</span>
                <span className="hidden size-1 rotate-45 bg-(--color-gold-muted) sm:block" />
                <span className="font-mono text-[10px] font-semibold text-white/50">{formatPrice(hero.price)}</span>
                <Link
                  to={`/shop/${hero.slug}`}
                  className="text-[9px] font-bold tracking-[0.3em] text-(--color-gold) uppercase transition-colors duration-300 hover:text-white"
                >
                  Shop Now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
