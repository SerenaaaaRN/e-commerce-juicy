import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const NewsletterSection = () => {
  return (
    <section data-section="newsletter" className="relative overflow-hidden py-28 md:py-36">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1740&auto=format&fit=crop"
          alt=""
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/75 to-black/50" />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/20" />
      </div>

      {/* Oversized decorative background text */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden">
        <span className="-mr-10 font-heading text-[8rem] leading-none font-black tracking-tighter whitespace-nowrap text-white/2 select-none md:text-[14rem] lg:text-[18rem]">
          STAY
        </span>
      </div>

      {/* Grain overlay */}
      <div className="bg-grain absolute inset-0" />

      <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="gsap-reveal max-w-lg">
          {/* Diamond marker */}
          <span className="mb-6 inline-block size-1.5 rotate-45 bg-(--color-gold)" />

          <span className="mb-4 block font-mono text-[9px] font-bold tracking-[0.4em] text-(--color-gold) uppercase">
            Newsletter
          </span>

          <h2 className="gsap-slide-up font-heading text-3xl leading-[0.95] font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Dapatkan Update
            <br />
            <span className="text-(--color-gold) italic">Koleksi Terbaru</span>
          </h2>

          <p className="mt-6 max-w-sm text-sm leading-relaxed tracking-wide text-white/40">
            Berlangganan untuk info koleksi terbaru, promo eksklusif, dan inspirasi style setiap minggu.
          </p>

          {/* Underline-style input */}
          <div className="mt-10 flex max-w-sm items-end gap-3">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Alamat email Anda"
                className="rounded-none border-0 border-b border-white/20 bg-transparent px-0 text-sm tracking-wide text-white shadow-none transition-colors duration-300 placeholder:text-white/25 focus:border-(--color-gold)"
              />
            </div>
            <Button type="submit" variant="luxury" className="shrink-0 px-6">
              Subscribe
            </Button>
          </div>

          <p className="mt-6 text-[9px] tracking-wide text-white/20">
            Dengan mendaftar, Anda setuju dengan kebijakan privasi kami.
          </p>
        </div>
      </div>
    </section>
  )
}
