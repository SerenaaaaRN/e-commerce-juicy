import type { Category } from "@/types"

type CategoryHeroProps = {
  category: Category
}

const HERO_IMAGES: Record<string, string> = {
  wanita: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1740&auto=format&fit=crop",
  tops: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1706&auto=format&fit=crop",
  bottoms: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1587&auto=format&fit=crop",
  dresses: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1740&auto=format&fit=crop",
  outerwear: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1587&auto=format&fit=crop",
  accessories: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1587&auto=format&fit=crop",
  sets: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=1588&auto=format&fit=crop",
}

export const CategoryHero = ({ category }: CategoryHeroProps) => {
  const image = HERO_IMAGES[category.slug] || HERO_IMAGES.dresses

  return (
    <section className="relative h-[50vh] max-h-150 min-h-100 overflow-hidden">
      <div className="absolute inset-0">
        <img src={image} alt={category.name} className="size-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/10" />
      </div>
      <div className="absolute inset-0 flex flex-col justify-end px-4 pb-16 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <span className="mb-3 block text-[10px] font-semibold tracking-widest text-primary uppercase">Koleksi</span>
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">{category.name}</h1>
          {category.description && (
            <p className="max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">{category.description}</p>
          )}
          <p className="mt-4 text-xs text-white/60">{category.product_count} Produk Tersedia</p>
        </div>
      </div>
    </section>
  )
}
