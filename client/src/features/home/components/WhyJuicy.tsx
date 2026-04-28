import { HugeiconsIcon } from "@hugeicons/react"
import {
  ShippingTruck01Icon,
  Recycle01Icon,
  SecurityIcon,
  CustomerServiceIcon,
} from "@hugeicons/core-free-icons"

const VALUES = [
  { icon: ShippingTruck01Icon, title: "Free Shipping", desc: "Gratis ongkir di atas Rp 500.000" },
  { icon: Recycle01Icon, title: "Easy Returns", desc: "14 hari pengembalian, tanpa ribet" },
  { icon: SecurityIcon, title: "Secure Payment", desc: "Transaksi aman terenkripsi" },
  { icon: CustomerServiceIcon, title: "24/7 Support", desc: "Tim siap membantu kapan saja" },
]

export const WhyJuicy = () => {
  return (
    <section className="border-y border-border/10 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/10 border-border/10">
          {VALUES.map((v) => (
            <div key={v.title} className="flex items-center gap-3 py-6 px-4 md:px-6">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <HugeiconsIcon icon={v.icon} className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">{v.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
