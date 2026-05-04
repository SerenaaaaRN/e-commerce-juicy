import { HugeiconsIcon } from "@hugeicons/react"
import { Separator } from "@/components/ui/separator"
import { ShippingTruck01Icon, Recycle01Icon, SecurityIcon, CustomerServiceIcon } from "@hugeicons/core-free-icons"

const VALUES = [
  {
    icon: ShippingTruck01Icon,
    title: "Free Shipping",
    desc: "Gratis ongkir di atas Rp 500.000",
  },
  {
    icon: Recycle01Icon,
    title: "Easy Returns",
    desc: "14 hari pengembalian, tanpa ribet",
  },
  {
    icon: SecurityIcon,
    title: "Secure Payment",
    desc: "Transaksi aman terenkripsi",
  },
  {
    icon: CustomerServiceIcon,
    title: "24/7 Support",
    desc: "Tim siap membantu kapan saja",
  },
]

export const WhyJuicy = () => {
  return (
    <section data-section="why-juicy" className="relative overflow-hidden bg-foreground">
      {/* Subtle grain overlay */}
      <div className="bg-grain absolute inset-0" />

      <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {VALUES.map((v, i) => (
            <div
              key={v.title}
              className="gsap-stagger-item group relative flex flex-col items-center gap-4 px-4 py-10 text-center md:px-6 md:py-14"
            >
              {i > 0 && (
                <Separator
                  orientation="vertical"
                  className="absolute top-1/2 left-0 hidden h-10 -translate-y-1/2 bg-background/6 md:block"
                />
              )}

              <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-(--color-gold-muted) bg-(--color-gold-subtle) transition-colors duration-500 group-hover:border-[var(--color-gold)] group-hover:bg-[var(--color-gold)]/10">
                <HugeiconsIcon icon={v.icon} className="size-4.5 text-(--color-gold)" />
              </div>

              {/* Text */}
              <div>
                <p className="font-heading text-xs font-semibold tracking-wide text-background uppercase">{v.title}</p>
                <p className="mx-auto mt-1.5 max-w-45 text-[10px] leading-relaxed text-background/40">{v.desc}</p>
              </div>

              {/* Diamond separator on mobile between rows */}
              {i === 1 && (
                <div className="absolute -bottom-px left-1/2 -translate-x-1/2 md:hidden">
                  <span className="block size-1 rotate-45 bg-(--color-gold-muted)" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Top & bottom gold accent lines */}
      <Separator className="absolute top-0 right-0 left-0 h-px bg-linear-to-r from-transparent via-(--color-gold) to-transparent" />
      <Separator className="absolute right-0 bottom-0 left-0 h-px bg-linear-to-r from-transparent via-(--color-gold) to-transparent" />
    </section>
  )
}
