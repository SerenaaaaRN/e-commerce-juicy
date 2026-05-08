import { Link } from "react-router-dom"
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"

export const RecentlyViewedSection = () => {
  const { items } = useRecentlyViewed()

  if (items.length === 0) return null

  return (
    <section
      data-section="recently-viewed"
      className="w-full bg-background py-20 md:py-24 overflow-hidden"
    >
      {/* Top accent */}
      <Separator className="bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent h-px" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 md:mt-20 mb-10 md:mb-14">
        <div className="flex items-end justify-between gsap-reveal">
          <div className="flex items-start gap-5">
            <span className="text-6xl md:text-7xl font-heading font-extralight text-foreground/[0.04] leading-none select-none hidden md:block">
              ◆
            </span>
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-bold tracking-[0.4em] text-[var(--color-gold)] uppercase font-mono flex items-center gap-2.5">
                <span className="size-1 rotate-45 bg-[var(--color-gold)]" />
                Recently Viewed
              </span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-heading leading-none">
                Lanjutkan Jelajahi
              </h2>
            </div>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground/50 hidden sm:block">
            {items.length} item{items.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-4 px-4"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((item, i) => (
            <Link
              key={item.slug}
              to={`/shop/${item.slug}`}
              className="snap-start shrink-0 w-[200px] md:w-[220px] group gsap-stagger-item will-change-transform"
            >
              {/* Image with index overlay */}
              <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                <img
                  src={item.image_url || "/placeholder-product.svg"}
                  alt={item.name}
                  className="size-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-product.svg" }}
                />
                {/* Hover lift overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                {/* Index number */}
                <span className="absolute bottom-3 right-3 text-[9px] font-mono text-white/40 mix-blend-difference">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Info */}
              <div className="pt-3.5 flex flex-col gap-0.5">
                <span className="text-[8px] font-bold tracking-[0.3em] text-muted-foreground/60 uppercase">
                  {item.category_name}
                </span>
                <p className="text-xs font-semibold text-foreground truncate group-hover:text-[var(--color-gold)] transition-colors duration-300 tracking-wide">
                  {item.name}
                </p>
                <span className="text-[11px] font-mono font-semibold text-foreground/70 mt-0.5">
                  {formatPrice(item.price)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom accent */}
      <Separator className="mt-16 md:mt-20 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent h-px" />
    </section>
  )
}
