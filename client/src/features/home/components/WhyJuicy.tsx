import { HugeiconsIcon } from "@hugeicons/react"
import { Separator } from "@/components/ui/separator"
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
    <section
      data-section="why-juicy"
      className="relative bg-foreground overflow-hidden"
    >
      {/* Subtle grain overlay */}
      <div className="absolute inset-0 bg-grain" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {VALUES.map((v, i) => (
            <div
              key={v.title}
              className="gsap-stagger-item group relative flex flex-col items-center text-center gap-4 py-10 md:py-14 px-4 md:px-6"
            >
              {/* Vertical separator (not on first item) */}
              {i > 0 && (
                <Separator orientation="vertical" className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/[0.06] h-10 hidden md:block" />
              )}

              {/* Icon container with gold ring */}
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[var(--color-gold-muted)] bg-[var(--color-gold-subtle)] transition-colors duration-500 group-hover:border-[var(--color-gold)] group-hover:bg-[var(--color-gold)]/10">
                <HugeiconsIcon icon={v.icon} className="size-4.5 text-(--color-gold)" />
              </div>

              {/* Text */}
              <div>
                <p className="text-xs font-heading font-semibold tracking-wide text-background uppercase">
                  {v.title}
                </p>
                <p className="text-[10px] text-background/40 mt-1.5 leading-relaxed max-w-45 mx-auto">
                  {v.desc}
                </p>
              </div>

              {/* Diamond separator on mobile between rows */}
              {i === 1 && (
                <div className="absolute -bottom-px left-1/2 -translate-x-1/2 md:hidden">
                  <span className="size-1 rotate-45 bg-[var(--color-gold-muted)] block" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Top & bottom gold accent lines */}
      <Separator className="absolute top-0 left-0 right-0 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent h-px" />
      <Separator className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent h-px" />
    </section>
  )
}
