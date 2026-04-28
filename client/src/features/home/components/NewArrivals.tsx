import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useProductStore } from "@/stores/productStore"

const formatPrice = (p: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(p)

export const NewArrivals = () => {
  const { products } = useProductStore()
  const displayProducts = products.filter((p) => p.tags?.includes("new-arrival")).slice(0, 4)
  const [activeIdx, setActiveIdx] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  if (displayProducts.length === 0) return null

  const active = displayProducts[activeIdx]

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[600px] md:min-h-[700px] overflow-hidden bg-black"
    >
      <div className="absolute inset-0">
        {displayProducts.map((p, i) => (
          <div
            key={p.id}
            className={`absolute inset-0 transition-opacity duration-700 ${i === activeIdx ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <img
              src={p.primary_image || "/placeholder.webp"}
              alt={p.name}
              className="size-full object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/60" />
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center min-h-[600px] md:min-h-[700px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-10">
          <div className={`max-w-lg transition-all duration-700 delay-100 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-primary" />
              <span className="text-[9px] font-bold tracking-[0.35em] text-primary uppercase">
                New Arrivals · {activeIdx + 1}/{displayProducts.length}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-[0.95] tracking-tight">
              {active.name}
            </h2>
            <p className="text-white/50 text-sm mt-4 max-w-sm leading-relaxed">
              New Season — {active.category_name}
            </p>
            <div className="flex items-center gap-4 mt-6">
              <span className="text-2xl font-bold text-white">{formatPrice(active.price)}</span>
              {active.compare_at_price && (
                <span className="text-sm text-white/40 line-through">{formatPrice(active.compare_at_price)}</span>
              )}
            </div>
            <Link
              to={`/shop/${active.slug}`}
              className="inline-flex items-center gap-2 mt-6 text-[10px] font-bold tracking-widest text-primary uppercase border-b border-primary/30 pb-1 hover:border-primary transition-colors"
            >
              Shop Now →
            </Link>
          </div>

          <div className={`flex flex-row md:flex-col gap-2 transition-all duration-700 delay-200 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
            {displayProducts.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActiveIdx(i)}
                className={`group text-left flex items-center gap-3 p-3 border transition-all duration-300 cursor-pointer ${
                  i === activeIdx
                    ? "border-white/40 bg-white/10"
                    : "border-transparent hover:border-white/10"
                }`}
              >
                <span className={`text-xs font-mono transition-colors ${
                  i === activeIdx ? "text-primary" : "text-white/30"
                }`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="hidden md:block">
                  <p className={`text-xs font-semibold transition-colors ${
                    i === activeIdx ? "text-white" : "text-white/50 group-hover:text-white/80"
                  }`}>
                    {p.name}
                  </p>
                  <p className={`text-[10px] transition-colors ${
                    i === activeIdx ? "text-white/40" : "text-white/20"
                  }`}>
                    {formatPrice(p.price)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center gap-2">
        {displayProducts.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={`h-0.5 transition-all duration-500 cursor-pointer ${
              i === activeIdx ? "w-8 bg-primary" : "w-4 bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Go to product ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
