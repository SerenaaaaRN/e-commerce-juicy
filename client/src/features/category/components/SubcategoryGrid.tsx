import { Link } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import type { Category } from "@/types"

type SubcategoryGridProps = {
  subcategories: Category[]
}

const SUBCAT_IMAGES = [
  "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1598550472225-efd91e7f8757?q=80&w=600&auto=format&fit=crop",
]

export const SubcategoryGrid = ({ subcategories }: SubcategoryGridProps) => {
  if (subcategories.length === 0) return null

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">
            Jelajahi
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mt-1">
            Subkategori
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subcategories.map((sub, idx) => (
            <Link
              key={sub.id}
              to={`/category/${sub.slug}`}
              className="group block"
            >
              <Card className="overflow-hidden border-border/10 shadow-sm hover:shadow-md transition-all duration-300">
                <AspectRatio ratio={4 / 5}>
                  <img
                    src={SUBCAT_IMAGES[idx % SUBCAT_IMAGES.length]}
                    alt={sub.name}
                    className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
                      {sub.name}
                    </h3>
                    <span className="text-[10px] text-white/60 mt-1 block">
                      {sub.product_count} Produk
                    </span>
                  </div>
                </AspectRatio>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
