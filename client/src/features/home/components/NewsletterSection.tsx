import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const NewsletterSection = () => {
  return (
    <section
      data-section="newsletter"
      className="relative overflow-hidden py-28 md:py-36"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1740&auto=format&fit=crop"
          alt=""
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      </div>

      {/* Oversized decorative background text */}
      <div className="absolute inset-0 flex items-center justify-end pointer-events-none overflow-hidden">
        <span className="text-[8rem] md:text-[14rem] lg:text-[18rem] font-heading font-black text-white/[0.02] leading-none tracking-tighter whitespace-nowrap -mr-10 select-none">
          STAY
        </span>
      </div>

      {/* Grain overlay */}
      <div className="absolute inset-0 bg-grain" />

      <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg gsap-reveal">
          {/* Diamond marker */}
          <span className="inline-block size-1.5 rotate-45 bg-[var(--color-gold)] mb-6" />

          <span className="text-[9px] font-bold tracking-[0.4em] text-[var(--color-gold)] uppercase block font-mono mb-4">
            Newsletter
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[0.95] tracking-tight font-heading gsap-slide-up">
            Dapatkan Update<br />
            <span className="text-[var(--color-gold)] italic">Koleksi Terbaru</span>
          </h2>

          <p className="text-sm text-white/40 mt-6 leading-relaxed tracking-wide max-w-sm">
            Berlangganan untuk info koleksi terbaru, promo eksklusif,
            dan inspirasi style setiap minggu.
          </p>

          {/* Underline-style input */}
          <div className="flex gap-3 mt-10 max-w-sm items-end">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Alamat email Anda"
                className="rounded-none bg-transparent border-0 border-b border-white/20 focus:border-[var(--color-gold)] text-white placeholder:text-white/25 px-0 text-sm tracking-wide transition-colors duration-300 shadow-none"
              />
            </div>
            <Button
              type="submit"
              variant="luxury"
              className="shrink-0 px-6"
            >
              Subscribe
            </Button>
          </div>

          <p className="text-[9px] text-white/20 mt-6 tracking-wide">
            Dengan mendaftar, Anda setuju dengan kebijakan privasi kami.
          </p>
        </div>
      </div>
    </section>
  )
}
