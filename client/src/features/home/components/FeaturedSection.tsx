import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useProductStore } from "@/stores/productStore"

const formatPrice = (p: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(p)

export const FeaturedSection = () => {
  const { featuredProducts, fetchFeaturedProducts } = useProductStore()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [fetchFeaturedProducts])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  if (featuredProducts.length === 0) return null

  const [hero, ...rest] = featuredProducts

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[700px] md:min-h-[800px] overflow-hidden bg-black"
    >
      <div className="absolute inset-0">
        <img
          src={hero.primary_image || "/placeholder.webp"}
          alt={hero.name}
          className={`size-full object-cover transition-all duration-1000 ${visible ? "scale-100" : "scale-105"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/50" />
      </div>

      <div className={`absolute top-6 right-6 md:top-10 md:right-10 z-20 hidden sm:flex gap-3 transition-all duration-700 delay-300 ${visible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}>
        {rest.slice(0, 3).map((product) => (
          <Link
            key={product.id}
            to={`/shop/${product.slug}`}
            className="group block w-20 md:w-28 overflow-hidden border border-white/10 hover:border-white/40 transition-all duration-300"
          >
            <div className="aspect-[3/4]">
              <img
                src={product.primary_image || "/placeholder.webp"}
                alt={product.name}
                className="size-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="bg-white/5 backdrop-blur-sm px-2 py-1.5">
              <p className="text-[9px] text-white/70 truncate font-medium">{product.name}</p>
              <p className="text-[8px] text-white/40">{formatPrice(product.price)}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center min-h-[700px] md:min-h-[800px]">
        <div className={`max-w-2xl transition-all duration-700 delay-100 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-primary" />
            <span className="text-[9px] font-bold tracking-[0.35em] text-primary uppercase">
              {hero.category_name}
            </span>
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[0.9] tracking-tight">
            Featured<br />
            <span className="italic text-primary">Edit</span>
          </h2>
          <p className="text-sm sm:text-base text-white/50 max-w-md mt-6 leading-relaxed">
            {hero.category_name} — a curated selection of standout pieces from the current collection.
          </p>
        </div>
      </div>

      <div className={`absolute bottom-0 left-0 right-0 z-10 border-t border-white/5 transition-all duration-700 delay-500 ${visible ? "opacity-100" : "opacity-0"}`}>
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-white/30">01</span>
              <span className="h-3 w-px bg-white/10" />
              <span className="text-[10px] tracking-widest text-white/40 uppercase">Featured</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-white/30 font-medium hidden sm:block">{hero.name}</span>
              <span className="h-3 w-px bg-white/10 hidden sm:block" />
              <span className="text-[10px] text-white/50 font-semibold">{formatPrice(hero.price)}</span>
              <Link
                to={`/shop/${hero.slug}`}
                className="text-[10px] font-bold tracking-widest text-primary uppercase hover:text-primary/80 transition-colors"
              >
                Shop Now →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
