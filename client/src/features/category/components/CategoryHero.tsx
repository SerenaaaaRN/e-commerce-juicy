import type { Category } from "@/types"

type CategoryHeroProps = {
  category: Category
}

const HERO_IMAGES: Record<string, string> = {
  apparel: "/cream-cashmere-wrap-dress-elegant-luxury-fashion.jpg",
  bags: "/cashmere-sweater-ivory.jpg",
  shoes: "/beige-linen-trousers-relaxed-fit-luxury-fashion.jpg",
  accessories: "/black-structured-leather-handbag-luxury-minimal-de.jpg",
  beuty: "/elegant-italian-woman-designer-portrait.jpg",
}

export const CategoryHero = ({ category }: CategoryHeroProps) => {
  const image = HERO_IMAGES[category.slug] || HERO_IMAGES.apparel

  return (
    <section
      className="relative mt-16 h-[40vh] max-h-120 min-h-80 overflow-hidden lg:mt-20"
      aria-labelledby="hero-category-title"
    >
      <div className="absolute inset-0">
        <img
          src={image}
          alt={`Koleksi ${category.name}`}
          className="size-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/10" />
      </div>
      <div className="absolute inset-0 flex flex-col justify-end px-4 pb-10 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <span className="mb-2 block text-[10px] font-semibold tracking-widest text-primary uppercase">Koleksi</span>
          <h1
            id="hero-category-title"
            className="mb-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            {category.name}
          </h1>
          {category.description && (
            <p className="max-w-xl text-xs leading-relaxed text-white/80 sm:text-sm">{category.description}</p>
          )}
          <p className="mt-3 text-[11px] text-white/60">{category.product_count} Produk Tersedia</p>
        </div>
      </div>
    </section>
  )
}
