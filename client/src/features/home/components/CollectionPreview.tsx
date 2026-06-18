import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/constants/routes"
import { Button } from "@/components/ui/button"
import { productApi } from "@/lib/api/products"
import { formatPrice } from "@/lib/utils"
import type { CatalogProduct } from "@/types"

export const CollectionPreview = () => {
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    productApi
      .getProducts({ per_page: 4 })
      .then((res) => {
        if (res.success) setProducts(res.data)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  if (!loading && products.length === 0) return null

  const hero = products[0]

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-background py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`mb-16 flex items-start justify-between transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="inline-block size-1.5 rotate-45 bg-primary" />
              <span className="text-[10px] font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                {hero ? hero.category_name : "Collection"}
              </span>
            </div>
            <h2 className="text-4xl leading-[0.95] font-bold tracking-tight text-foreground sm:text-5xl">
              Featured
              <br />
              <span className="text-primary italic">Products</span>
            </h2>
          </div>
          <p className="hidden max-w-50 self-end text-right text-xs leading-relaxed text-muted-foreground md:block">
            A curated edit of our latest silhouettes.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12">
            <div className="aspect-4/5 animate-pulse bg-muted/30 lg:col-span-3" />
            <div className="flex flex-col gap-4 lg:col-span-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 animate-pulse bg-muted/30" />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12">
            <div
              className={`relative transition-all delay-100 duration-700 lg:col-span-3 ${visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
            >
              <Link to={`/shop/${hero.slug}`} className="group relative block bg-muted/20">
                <img
                  src={hero.primary_image || "/placeholder.webp"}
                  alt={hero.name}
                  className="aspect-4/5 w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.25)_100%)]" />
                <div className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/60 via-transparent to-transparent p-6 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="text-xs font-medium text-white">View Product →</span>
                </div>
              </Link>
            </div>

            <div
              className={`flex flex-col justify-between transition-all delay-200 duration-700 lg:col-span-2 ${visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
            >
              <div>
                <h3 className="text-2xl font-bold text-foreground">{hero.name}</h3>
                <p className="mt-2 text-lg font-semibold text-primary">{formatPrice(hero.price)}</p>
                {hero.compare_at_price && (
                  <p className="mt-0.5 text-sm text-muted-foreground line-through">
                    {formatPrice(hero.compare_at_price)}
                  </p>
                )}
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  {hero.tags?.length ? hero.tags.join(" · ") : hero.category_name}
                </p>

                {products.length > 1 && (
                  <div className="mt-8 border-t border-border/10 pt-6">
                    <p className="mb-3 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                      More in Collection
                    </p>
                    <div className="flex flex-col gap-2">
                      {products.slice(1).map((p) => (
                        <Link
                          key={p.id}
                          to={`/shop/${p.slug}`}
                          className="group/card flex items-center gap-3 p-2 transition-colors hover:bg-muted/20"
                        >
                          <div className="size-12 shrink-0 overflow-hidden bg-muted">
                            <img
                              src={p.primary_image || "/placeholder.webp"}
                              alt={p.name}
                              className="size-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-foreground">{p.name}</p>
                            <p className="text-[10px] text-muted-foreground">{formatPrice(p.price)}</p>
                          </div>
                          <span className="text-[10px] text-muted-foreground transition-colors group-hover/card:text-foreground">
                            →
                          </span>
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

        <div
          className={`mt-16 flex items-center justify-between transition-all delay-500 duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-muted-foreground">01 — {products.length}</span>
            <span className="h-px w-12 bg-border" />
            <span className="text-[10px] tracking-widest text-muted-foreground uppercase">Collection</span>
          </div>
          <Link
            to={ROUTES.shop}
            className="border-b border-foreground/10 pb-0.5 text-xs text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            Explore all →
          </Link>
        </div>
      </div>
    </section>
  )
}
