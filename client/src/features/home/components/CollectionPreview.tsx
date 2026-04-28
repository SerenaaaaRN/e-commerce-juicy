import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { productApi } from "@/lib/api/products"
import type { CatalogProduct } from "@/types"

const formatPrice = (p: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(p)

export const CollectionPreview = () => {
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    productApi.getProducts({ per_page: 4 }).then((res) => {
      if (res.success) setProducts(res.data)
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  if (!loading && products.length === 0) return null

  const hero = products[0]

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-background overflow-hidden"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`flex items-start justify-between mb-16 transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block size-1.5 bg-primary rotate-45" />
              <span className="text-[10px] font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                {hero ? hero.category_name : "Collection"}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-[0.95]">
              Featured<br />
              <span className="text-primary italic">Products</span>
            </h2>
          </div>
          <p className="hidden md:block text-xs text-muted-foreground max-w-[200px] text-right self-end leading-relaxed">
            A curated edit of our latest silhouettes.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-3 aspect-[4/5] animate-pulse bg-muted/30" />
            <div className="lg:col-span-2 flex flex-col gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 animate-pulse bg-muted/30" />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className={`lg:col-span-3 relative transition-all duration-700 delay-100 ${visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}>
              <Link to={`/shop/${hero.slug}`} className="group block relative bg-muted/20">
                <img
                  src={hero.primary_image || "/placeholder.webp"}
                  alt={hero.name}
                  className="w-full aspect-[4/5] object-cover"
                />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.25)_100%)] pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-medium">View Product →</span>
                </div>
              </Link>
            </div>

            <div className={`lg:col-span-2 flex flex-col justify-between transition-all duration-700 delay-200 ${visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}>
              <div>
                <h3 className="text-2xl font-bold text-foreground">{hero.name}</h3>
                <p className="text-lg font-semibold text-primary mt-2">{formatPrice(hero.price)}</p>
                {hero.compare_at_price && (
                  <p className="text-sm text-muted-foreground line-through mt-0.5">{formatPrice(hero.compare_at_price)}</p>
                )}
                <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                  {hero.tags?.length ? hero.tags.join(" · ") : hero.category_name}
                </p>

                {products.length > 1 && (
                  <div className="mt-8 pt-6 border-t border-border/10">
                    <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase mb-3">
                      More in Collection
                    </p>
                    <div className="flex flex-col gap-2">
                      {products.slice(1).map((p) => (
                        <Link
                          key={p.id}
                          to={`/shop/${p.slug}`}
                          className="flex items-center gap-3 p-2 hover:bg-muted/20 transition-colors group/card"
                        >
                          <div className="size-12 shrink-0 bg-muted overflow-hidden">
                            <img
                              src={p.primary_image || "/placeholder.webp"}
                              alt={p.name}
                              className="size-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">{p.name}</p>
                            <p className="text-[10px] text-muted-foreground">{formatPrice(p.price)}</p>
                          </div>
                          <span className="text-[10px] text-muted-foreground group-hover/card:text-foreground transition-colors">→</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <Button asChild className="w-full">
                  <Link to={`/shop/${hero.slug}`}>Quick Shop</Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className={`flex items-center justify-between mt-16 transition-all duration-700 delay-500 ${visible ? "opacity-100" : "opacity-0"}`}>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-muted-foreground">01 — {products.length}</span>
            <span className="h-px w-12 bg-border" />
            <span className="text-[10px] text-muted-foreground tracking-widest uppercase">Collection</span>
          </div>
          <Link
            to="/shop"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors border-b border-foreground/10 hover:border-foreground/40 pb-0.5"
          >
            Explore all →
          </Link>
        </div>
      </div>
    </section>
  )
}
