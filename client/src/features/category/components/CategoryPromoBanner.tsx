import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import type { Category } from "@/types"

type CategoryPromoBannerProps = {
  category: Category
}

export const CategoryPromoBanner = ({ category }: CategoryPromoBannerProps) => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-sm bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/10">
          <div className="relative z-10 px-8 py-12 sm:px-16 sm:py-20 text-center">
            <span className="text-[10px] font-semibold tracking-widest text-primary uppercase mb-3 block">
              Promo Spesial
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
              Koleksi {category.name} Terbaru
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              Temukan silhouette terbaru dari koleksi {category.name.toLowerCase()} kami. 
              Dapatkan penawaran eksklusif untuk setiap pembelian.
            </p>
            <Button asChild>
              <Link to={`/shop?category=${category.slug}`}>
                Belanja Sekarang
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
