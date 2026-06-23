import type { Category } from "@/types"

type CategoryHeroProps = {
  category: Category
}

const HERO_IMAGES: Record<string, string> = {
  wanita: "/luxury-minimalist-fashion-model-in-elegant-dark-cl.jpg",
  tops: "/cashmere-sweater-ivory.jpg",
  bottoms: "/beige-linen-trousers-relaxed-fit-luxury-fashion.jpg",
  dresses: "/cream-cashmere-wrap-dress-elegant-luxury-fashion.jpg",
  outerwear: "/luxury-wool-coat-front-view-editorial-fashion-phot.jpg",
  accessories: "/black-structured-leather-handbag-luxury-minimal-de.jpg",
  sets: "/elegant-italian-woman-designer-portrait.jpg",
}

export const CategoryHero = ({ category }: CategoryHeroProps) => {
  const image = HERO_IMAGES[category.slug] || HERO_IMAGES.dresses

  return (
    <section className="relative h-[50vh] mt-32 max-h-150 min-h-100 overflow-hidden">
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
