import { Card } from "@/components/ui/card"
import type { Category } from "@/types"
import { Link } from "react-router-dom"

type SubcategoryGridProps = {
  subcategories: Category[]
}

const SUBCAT_IMAGES = [
  "/silk-blouse-ivory.jpg",
  "/tailored-blazer-charcoal.jpg",
  "/wool-trousers-charcoal.jpg",
  "/silk-scarf-abstract-pattern-luxury-accessory-elega.jpg",
]

export const SubcategoryGrid = ({ subcategories }: SubcategoryGridProps) => {
  if (subcategories.length === 0) return null

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">Jelajahi</span>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Subkategori</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {subcategories.map((sub, idx) => (
            <Link key={sub.id} to={`/category/${sub.slug}`} className="group block">
              <Card className="overflow-hidden border-border/10 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="aspect-3/4">
                  <img
                    src={SUBCAT_IMAGES[idx % SUBCAT_IMAGES.length]}
                    alt={sub.name}
                    className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute right-0 bottom-0 left-0 p-4">
                    <h3 className="text-sm font-semibold tracking-wider text-white uppercase">{sub.name}</h3>
                    <span className="mt-1 block text-[10px] text-white/60">{sub.product_count} Produk</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
