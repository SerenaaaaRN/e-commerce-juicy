import { Link } from "react-router-dom"

const PROMOS = [
  "Free Shipping on orders over Rp 500.000",
  "Up to 50% Off — Summer Collection",
  "New Arrivals: Linen Edition",
  "Easy Returns within 14 Days",
]

export const PromoStrip = () => {
  return (
    <section className="bg-foreground text-background overflow-hidden">
      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center py-2.5">
          {[...PROMOS, ...PROMOS].map((text, i) => (
            <span key={i} className="mx-8 text-[11px] font-medium tracking-widest uppercase flex items-center gap-4">
              <span className="size-1.5 rounded-full bg-primary" />
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
