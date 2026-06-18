import { Link } from "react-router-dom"
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"

export const RecentlyViewedSection = () => {
  const { items } = useRecentlyViewed()

  if (items.length === 0) return null

  return (
    <section data-section="recently-viewed" className="w-full overflow-hidden bg-background py-20 md:py-24">
      {/* Top accent */}
      <Separator className="h-px bg-linear-to-r from-transparent via-(--color-gold) to-transparent" />

      <div className="container mx-auto mt-16 mb-10 max-w-7xl px-4 sm:px-6 md:mt-20 md:mb-14 lg:px-8">
        <div className="gsap-reveal flex items-end justify-between">
          <div className="flex items-start gap-5">
            <span className="hidden font-heading text-6xl leading-none font-extralight text-foreground/4 select-none md:block md:text-7xl">
              ◆
            </span>
            <div className="flex flex-col gap-1.5">
              <span className="flex items-center gap-2.5 font-mono text-[9px] font-bold tracking-[0.4em] text-(--color-gold) uppercase">
                <span className="size-1 rotate-45 bg-(--color-gold)" />
                Recently Viewed
              </span>
              <h2 className="font-heading text-2xl leading-none font-bold tracking-tight text-foreground md:text-3xl">
                Lanjutkan Jelajahi
              </h2>
            </div>
          </div>
          <span className="hidden font-mono text-[10px] text-muted-foreground/50 sm:block">
            {items.length} item{items.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="-mx-4 flex snap-x snap-mandatory scrollbar-none gap-5 overflow-x-auto px-4"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((item, i) => (
            <Link
              key={item.slug}
              to={`/shop/${item.slug}`}
              className="group gsap-stagger-item w-50 shrink-0 snap-start will-change-transform md:w-55"
            >
              {/* Image with index overlay */}
              <div className="relative aspect-3/4 overflow-hidden bg-muted">
                <img
                  src={item.image_url || "/placeholder-product.svg"}
                  alt={item.name}
                  className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/placeholder-product.svg"
                  }}
                />
                {/* Hover lift overlay */}
                <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
                {/* Index number */}
                <span className="absolute right-3 bottom-3 font-mono text-[9px] text-white/40 mix-blend-difference">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-0.5 pt-3.5">
                <span className="text-[8px] font-bold tracking-[0.3em] text-muted-foreground/60 uppercase">
                  {item.category_name}
                </span>
                <p className="truncate text-xs font-semibold tracking-wide text-foreground transition-colors duration-300 group-hover:text-(--color-gold)">
                  {item.name}
                </p>
                <span className="mt-0.5 font-mono text-[11px] font-semibold text-foreground/70">
                  {formatPrice(item.price)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom accent */}
      <Separator className="mt-16 h-px bg-linear-to-r from-transparent via-(--color-gold) to-transparent md:mt-20" />
    </section>
  )
}
