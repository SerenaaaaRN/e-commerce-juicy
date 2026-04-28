import { Link } from "react-router-dom"
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed"
import { Card, CardContent } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import { Clock01Icon } from "@hugeicons/core-free-icons"
import { formatPrice } from "@/lib/utils/format"

export const RecentlyViewedSection = () => {
  const { items } = useRecentlyViewed()

  if (items.length === 0) return null

  return (
    <section className="w-full bg-muted/5 py-20 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
            <HugeiconsIcon icon={Clock01Icon} className="size-4 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Recently Viewed
            </h2>
            <p className="text-xs text-muted-foreground">
              Lanjutkan jelajahi silhouette favoritmu
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((item) => (
            <Link key={item.slug} to={`/shop/${item.slug}`} className="snap-start shrink-0 w-[200px] group">
              <Card className="overflow-hidden hover:shadow-md border-border/10">
                <div className="aspect-[4/5] bg-muted overflow-hidden">
                  <img
                    src={item.image_url || "/placeholder-product.svg"}
                    alt={item.name}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-product.svg" }}
                  />
                </div>
                <CardContent className="p-3 text-left">
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                    {item.category_name}
                  </span>
                  <p className="text-xs font-semibold text-foreground truncate mt-0.5">{item.name}</p>
                  <span className="text-xs font-bold text-primary mt-1 block">
                    {formatPrice(item.price)}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
