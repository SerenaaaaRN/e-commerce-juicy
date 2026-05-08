import { useState } from "react"
import { Link } from "react-router-dom"
import { useProductStore } from "@/stores/productStore"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"

export const NewArrivals = () => {
  const { products } = useProductStore()
  const displayProducts = products.filter((p) => p.tags?.includes("new-arrival")).slice(0, 4)
  const [activeIdx, setActiveIdx] = useState(0)

  if (displayProducts.length === 0) return null

  const active = displayProducts[activeIdx]

  return (
    <section
      data-section="new-arrivals"
      className="relative min-h-[650px] md:min-h-[750px] overflow-hidden bg-black"
    >
      {/* Full-bleed product images */}
      <div className="absolute inset-0">
        {displayProducts.map((p, i) => (
          <div
            key={p.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${i === activeIdx ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <img
              src={p.primary_image || "/placeholder.webp"}
              alt={p.name}
              className="size-full object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
      </div>

      {/* Split-screen content */}
      <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center min-h-[650px] md:min-h-[750px]">
        <div className="flex flex-col md:flex-row w-full gap-12 md:gap-20">

          {/* Left — Product detail */}
          <div className="flex-1 flex flex-col justify-center gsap-reveal">
            <div className="flex items-center gap-4 mb-8">
              <span className="size-1.5 rotate-45 bg-[var(--color-gold)]" />
              <span className="text-[9px] font-bold tracking-[0.4em] text-[var(--color-gold)] uppercase font-mono">
                New Arrivals
              </span>
              <Separator className="flex-1 bg-white/[0.06] h-px" />
              <span className="text-[9px] font-mono text-white/20">
                {String(activeIdx + 1).padStart(2, "0")} / {String(displayProducts.length).padStart(2, "0")}
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[0.92] tracking-tight font-heading gsap-slide-up">
              {active.name}
            </h2>

            <div className="flex items-center gap-3 mt-5">
              <Separator className="w-6 bg-[var(--color-gold-muted)] h-px" />
              <span className="text-[9px] tracking-[0.3em] text-white/30 uppercase font-medium">
                {active.category_name}
              </span>
            </div>

            <div className="flex items-baseline gap-4 mt-8">
              <span className="text-2xl md:text-3xl font-heading font-bold text-white">
                {formatPrice(active.price)}
              </span>
              {active.compare_at_price && (
                <span className="text-sm font-mono text-white/30 line-through">
                  {formatPrice(active.compare_at_price)}
                </span>
              )}
            </div>

            <Link
              to={`/shop/${active.slug}`}
              className="inline-flex items-center gap-3 mt-10 group"
            >
              <span className="text-[10px] font-bold tracking-[0.3em] text-[var(--color-gold)] uppercase">
                Discover
              </span>
              <Separator className="w-8 bg-[var(--color-gold)] h-px group-hover:w-14 transition-all duration-500" />
              <span className="text-[10px] text-[var(--color-gold)]">→</span>
            </Link>
          </div>

          {/* Right — Vertical product selector */}
          <div className="flex flex-row md:flex-col gap-1 md:w-56 shrink-0 md:justify-center gsap-stagger-item">
            {displayProducts.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActiveIdx(i)}
                className={`group text-left flex items-center gap-4 p-3.5 transition-all duration-500 cursor-pointer border-l-2 ${
                  i === activeIdx
                    ? "border-l-[var(--color-gold)] bg-white/[0.06]"
                    : "border-l-transparent hover:border-l-white/10 hover:bg-white/[0.02]"
                }`}
              >
                <span className={`text-[10px] font-mono transition-colors duration-300 ${
                  i === activeIdx ? "text-[var(--color-gold)]" : "text-white/20"
                }`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="hidden md:block min-w-0">
                  <p className={`text-xs font-semibold tracking-wide transition-colors duration-300 truncate ${
                    i === activeIdx ? "text-white" : "text-white/40 group-hover:text-white/70"
                  }`}>
                    {p.name}
                  </p>
                  <p className={`text-[10px] font-mono transition-colors duration-300 mt-0.5 ${
                    i === activeIdx ? "text-white/40" : "text-white/15"
                  }`}>
                    {formatPrice(p.price)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom progress indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
        {displayProducts.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={`h-[2px] transition-all duration-700 cursor-pointer ${
              i === activeIdx
                ? "w-10 bg-[var(--color-gold)]"
                : "w-5 bg-white/15 hover:bg-white/30"
            }`}
            aria-label={`Go to product ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
