import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useProductStore } from "@/stores/productStore"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"

export const FeaturedSection = () => {
  const { featuredProducts, fetchFeaturedProducts } = useProductStore()
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [fetchFeaturedProducts])

  if (featuredProducts.length === 0) return null

  const [hero, ...rest] = featuredProducts

  return (
    <section
      ref={sectionRef}
      data-section="featured"
      className="relative min-h-[700px] md:min-h-[850px] overflow-hidden bg-black"
    >
      {/* Cinematic background */}
      <div className="absolute inset-0">
        <img
          src={hero.primary_image || "/placeholder.webp"}
          alt={hero.name}
          className="size-full object-cover scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
      </div>

      {/* Floating thumbnail rail — right side */}
      <div className="absolute top-8 right-6 md:top-12 md:right-12 z-20 hidden sm:flex flex-col gap-3 gsap-stagger-item">
        {rest.slice(0, 3).map((product, i) => (
          <Link
            key={product.id}
            to={`/shop/${product.slug}`}
            className="group block w-20 md:w-[7.5rem] overflow-hidden border border-white/[0.06] hover:border-[var(--color-gold-muted)] transition-all duration-500 will-change-transform"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={product.primary_image || "/placeholder.webp"}
                alt={product.name}
                className="size-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="bg-white/[0.04] backdrop-blur-sm px-2.5 py-2">
              <p className="text-[8px] font-mono text-white/30 mb-0.5">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="text-[9px] text-white/60 truncate font-medium tracking-wide">
                {product.name}
              </p>
              <p className="text-[8px] font-mono text-white/30 mt-0.5">
                {formatPrice(product.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center min-h-[700px] md:min-h-[850px]">
        <div className="max-w-2xl gsap-reveal">
          <div className="flex items-center gap-4 mb-8">
            <Separator className="w-10 bg-[var(--color-gold)] h-px" />
            <span className="text-[9px] font-bold tracking-[0.4em] text-[var(--color-gold)] uppercase font-mono">
              {hero.category_name}
            </span>
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-8xl font-bold text-white leading-[0.88] tracking-tight font-heading gsap-slide-up">
            Featured<br />
            <span className="italic text-[var(--color-gold)]">Edit</span>
          </h2>
          <p className="text-sm sm:text-base text-white/40 max-w-md mt-8 leading-relaxed tracking-wide">
            {hero.category_name} — a curated selection of standout pieces from the current collection.
          </p>
        </div>
      </div>

      {/* Frosted bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <Separator className="bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent h-px" />
        <div className="backdrop-blur-md bg-white/[0.04]">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-5 gsap-fade">
              <div className="flex items-center gap-5">
                <span className="text-[10px] font-mono text-white/25">01</span>
                <span className="size-1 rotate-45 bg-[var(--color-gold-muted)]" />
                <span className="text-[9px] tracking-[0.3em] text-white/35 uppercase font-medium">
                  Featured
                </span>
              </div>
              <div className="flex items-center gap-5">
                <span className="text-[10px] text-white/25 font-mono hidden sm:block">
                  {hero.name}
                </span>
                <span className="size-1 rotate-45 bg-[var(--color-gold-muted)] hidden sm:block" />
                <span className="text-[10px] text-white/50 font-mono font-semibold">
                  {formatPrice(hero.price)}
                </span>
                <Link
                  to={`/shop/${hero.slug}`}
                  className="text-[9px] font-bold tracking-[0.3em] text-[var(--color-gold)] uppercase hover:text-white transition-colors duration-300"
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
