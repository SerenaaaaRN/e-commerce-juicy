import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const NewsletterSection = () => {
  return (
    <section className="relative overflow-hidden py-28">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1740&auto=format&fit=crop"
          alt=""
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50" />
      </div>
      <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg">
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">
            Newsletter
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 leading-tight">
            Dapatkan Update<br />Koleksi Terbaru
          </h2>
          <p className="text-sm text-white/60 mt-4 leading-relaxed">
            Berlangganan untuk info koleksi terbaru, promo eksklusif, 
            dan inspirasi style setiap minggu.
          </p>
          <div className="flex gap-2 mt-8 max-w-sm">
            <Input
              type="email"
              placeholder="Masukkan email Anda"
              className="rounded-none bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
            <Button type="submit" className="shrink-0">
              Subscribe
            </Button>
          </div>
          <p className="text-[10px] text-white/40 mt-4">
            Dengan mendaftar, Anda setuju dengan kebijakan privasi kami.
          </p>
        </div>
      </div>
    </section>
  )
}
