const PROMOS = [
  "Free Shipping on orders over Rp 500.000",
  "Up to 50% Off — Summer Collection",
  "New Arrivals: Linen Edition",
  "Easy Returns within 14 Days",
]

export const PromoStrip = () => {
  return (
    <section className="overflow-hidden bg-foreground text-background">
      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee flex items-center py-2.5 whitespace-nowrap">
          {[...PROMOS, ...PROMOS].map((text, i) => (
            <span key={i} className="mx-8 flex items-center gap-4 text-[11px] font-medium tracking-widest uppercase">
              <span className="size-1.5 rounded-full bg-primary" />
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
