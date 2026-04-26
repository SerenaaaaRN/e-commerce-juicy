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
    <section className="w-full bg-background py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="text-left flex flex-col gap-1">
            <span className="text-xs font-semibold tracking-wider text-primary uppercase flex items-center gap-2">
              <HugeiconsIcon icon={Clock01Icon} className="size-3.5" />
              Continue Browsing
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground font-heading">
              Recently Viewed
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <Link
              key={item.slug}
              to={`/shop/${item.slug}`}
              className="group"
            >
              <Card className="overflow-hidden hover:shadow-md transition-all duration-200">
                <div className="aspect-[4/5] bg-muted overflow-hidden">
                  <img
                    src={item.image_url || "/placeholder-product.svg"}
                    alt={item.name}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder-product.svg"
                    }}
                  />
                </div>
                <CardContent className="p-3 text-left flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    {item.category_name}
                  </span>
                  <span className="text-sm font-semibold text-foreground truncate">
                    {item.name}
                  </span>
                  <span className="text-sm font-bold text-primary">
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

export default RecentlyViewedSection
