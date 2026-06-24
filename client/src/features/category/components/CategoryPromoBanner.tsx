import { Button } from "@/components/ui/button"
import type { Category } from "@/types"
import { Link } from "react-router-dom"

type CategoryPromoBannerProps = {
  category: Category
}

export const CategoryPromoBanner = ({ category }: CategoryPromoBannerProps) => {
  return (
    <section className="bg-background pt-12 pb-16" aria-labelledby="promo-title">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-sm border border-primary/10 bg-linear-to-r from-primary/10 via-primary/5 to-background">
          <div className="relative z-10 px-8 py-10 text-center sm:px-16 sm:py-16">
            <span className="mb-2 block text-[10px] font-semibold tracking-widest text-primary uppercase">
              Promo Spesial
            </span>
            <h3 id="promo-title" className="mb-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Koleksi {category.name} Terbaru
            </h3>
            <p className="mx-auto mb-5 max-w-md text-sm text-muted-foreground">
              Temukan silhouette terbaru dari koleksi {category.name.toLowerCase()} kami. Dapatkan penawaran eksklusif
              untuk setiap pembelian.
            </p>
            <Button asChild>
              <Link
                to={`/shop?category=${category.slug}`}
                aria-label={`Belanja sekarang untuk koleksi ${category.name}`}
              >
                Belanja Sekarang
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
