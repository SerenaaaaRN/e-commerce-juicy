import { useState } from "react"
import { Link } from "react-router-dom"
import { useProductsQuery } from "@/features/shop/hooks/useProductQueries"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"

export const NewArrivals = () => {
  const { data: productsData } = useProductsQuery({ tag: "new-arrival", per_page: 4 })
  const products = productsData?.products ?? []
  const displayProducts = products.filter((p) => p.tags?.includes("new-arrival")).slice(0, 4)
  const [activeIdx, setActiveIdx] = useState(0)

  if (displayProducts.length === 0) return null

  const active = displayProducts[activeIdx]

  return (
    <section data-section="new-arrivals" className="relative min-h-162.5 overflow-hidden bg-black md:min-h-187.5">
      {/* Full-bleed product images */}
      <div className="absolute inset-0">
        {displayProducts.map((p, i) => (
          <div
            key={p.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${i === activeIdx ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <img src={p.primary_image || "/placeholder.webp"} alt={p.name} className="size-full object-cover" />
          </div>
        ))}
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-black/40" />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/10" />
      </div>

      {/* Split-screen content */}
      <div className="relative z-10 container mx-auto flex h-full min-h-162.5 max-w-7xl items-center px-4 sm:px-6 md:min-h-187.5 lg:px-8">
        <div className="flex w-full flex-col gap-12 md:flex-row md:gap-20">
          {/* Left — Product detail */}
          <aside className="gsap-reveal flex flex-1 flex-col justify-center">
            <div className="mb-8 flex items-center gap-4">
              <span className="size-1.5 rotate-45 bg-(--color-gold)" />
              <span className="font-mono text-[9px] font-bold tracking-[0.4em] text-(--color-gold) uppercase">
                New Arrivals
              </span>
              <Separator className="h-px flex-1 bg-white/6" />
              <span className="font-mono text-[9px] text-white/20">
                {String(activeIdx + 1).padStart(2, "0")} / {String(displayProducts.length).padStart(2, "0")}
              </span>
            </div>

            <h2 className="gsap-slide-up font-heading text-4xl leading-[0.92] font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              {active.name}
            </h2>

            <div className="mt-5 flex items-center gap-3">
              <Separator className="h-px w-6 bg-(--color-gold-muted)" />
              <span className="text-[9px] font-medium tracking-[0.3em] text-white/30 uppercase">
                {active.category_name}
              </span>
            </div>

            <div className="mt-8 flex items-baseline gap-4">
              <span className="font-heading text-2xl font-bold text-white md:text-3xl">
                {formatPrice(active.price)}
              </span>
              {active.compare_at_price && (
                <span className="font-mono text-sm text-white/30 line-through">
                  {formatPrice(active.compare_at_price)}
                </span>
              )}
            </div>

            <Link to={`/shop/${active.slug}`} className="group mt-10 inline-flex items-center gap-3">
              <span className="text-[10px] font-bold tracking-[0.3em] text-(--color-gold) uppercase">Discover</span>
              <Separator className="h-px w-8 bg-(--color-gold) transition-all duration-500 group-hover:w-14" />
              <span className="text-[10px] text-(--color-gold)">→</span>
            </Link>
          </aside>

          {/* Right — Vertical product selector */}
          <aside className="gsap-stagger-item flex shrink-0 flex-row gap-1 md:w-56 md:flex-col md:justify-center">
            {displayProducts.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActiveIdx(i)}
                className={`group flex cursor-pointer items-center gap-4 border-l-2 p-3.5 text-left transition-all duration-500 ${
                  i === activeIdx
                    ? "border-l-(--color-gold) bg-white/6"
                    : "border-l-transparent hover:border-l-white/10 hover:bg-white/2"
                }`}
              >
                <span
                  className={`font-mono text-[10px] transition-colors duration-300 ${
                    i === activeIdx ? "text-(--color-gold)" : "text-white/20"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="hidden min-w-0 md:block">
                  <p
                    className={`truncate text-xs font-semibold tracking-wide transition-colors duration-300 ${
                      i === activeIdx ? "text-white" : "text-white/40 group-hover:text-white/70"
                    }`}
                  >
                    {p.name}
                  </p>
                  <p
                    className={`mt-0.5 font-mono text-[10px] transition-colors duration-300 ${
                      i === activeIdx ? "text-white/40" : "text-white/15"
                    }`}
                  >
                    {formatPrice(p.price)}
                  </p>
                </div>
              </button>
            ))}
          </aside>
        </div>
      </div>

      {/* Bottom progress indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
        {displayProducts.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={`h-0.5 cursor-pointer transition-all duration-700 ${
              i === activeIdx ? "w-10 bg-(--color-gold)" : "w-5 bg-white/15 hover:bg-white/30"
            }`}
            aria-label={`Go to product ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
