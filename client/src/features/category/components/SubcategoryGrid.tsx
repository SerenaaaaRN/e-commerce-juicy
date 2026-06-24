import type { Category } from "@/types"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "react-router-dom"

type SubcategoryGridProps = {
  subcategories: Category[]
}

export const SubcategoryGrid = ({ subcategories }: SubcategoryGridProps) => {
  if (subcategories.length === 0) return null

  return (
    <section className="bg-background pt-12 pb-6" aria-labelledby="subcategory-heading">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-start md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-semibold tracking-wider text-primary uppercase">Jelajahi</span>
            <h2 id="subcategory-heading" className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              Subkategori
            </h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground md:mt-0 font-medium">
            Temukan koleksi pilihan untuk gaya Anda
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {subcategories.length > 0 ? (
            subcategories.map((sub) => (
              <Link
                key={sub.id}
                to={`/category/${sub.slug}`}
                className="group block"
                aria-label={`Jelajahi subkategori ${sub.name}, berisi ${sub.product_count} produk`}
              >
                <div className="relative flex h-full flex-col justify-between rounded-xl border border-border/30 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-sm">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors duration-200">
                      {sub.name}
                    </h3>
                    {sub.description ? (
                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                        {sub.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/10">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {sub.product_count} Produk
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-primary opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                      <span>Lihat</span>
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : null}
        </div>
      </div>
    </section>
  )
}
