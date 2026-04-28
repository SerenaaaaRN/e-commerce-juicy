import type { Category } from "@/types"

type CategoryInfoProps = {
  category: Category
}

export const CategoryInfo = ({ category }: CategoryInfoProps) => {
  return (
    <section className="py-16 bg-muted/5 border-y border-border/5">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-[10px] font-semibold tracking-widest text-primary uppercase mb-3 block">
            Tentang Koleksi
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
            {category.name}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {category.description || `Jelajahi koleksi ${category.name} kami yang dikurasi secara eksklusif. 
            Setiap silhouette dirancang dengan bahan premium dan perhatian terhadap detail, 
            menghadirkan fashion berkualitas tinggi untuk gaya hidup modern Anda.`}
          </p>
          <div className="grid grid-cols-3 gap-8 mt-10">
            <div>
              <p className="text-2xl font-bold text-foreground">{category.product_count}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Produk</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">100%</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Original</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">24/7</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Customer Service</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
