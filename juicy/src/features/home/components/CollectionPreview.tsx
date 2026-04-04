import { Link } from "react-router-dom"
import { Separator } from "@/components/ui/separator"

type CategoryCard = {
  name: string
  slug: string
  image: string
  count: string
}

const CATEGORIES: CategoryCard[] = [
  {
    name: "Dresses",
    slug: "dresses",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop",
    count: "12 Silhouettes",
  },
  {
    name: "Tops",
    slug: "tops",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=600&auto=format&fit=crop",
    count: "18 Silhouettes",
  },
  {
    name: "Bottoms",
    slug: "bottoms",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop",
    count: "15 Silhouettes",
  },
]

export const CollectionPreview = () => {
  return (
    <section className="py-24 bg-muted/20">
      <Separator className="mb-24" />
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl text-left mb-16 flex flex-col gap-3">
          <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase block">
            Artisanal Taxonomy
          </span>
          <h2 className="font-['Space_Grotesk'] text-3xl font-semibold uppercase tracking-wider text-foreground">
            Explore Categories
          </h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest leading-relaxed max-w-md">
            Handpicked raw textures sorted by design purpose. Choose your aesthetic foundation.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="group relative block aspect-[4/5] w-full overflow-hidden bg-muted shadow-lg hover:shadow-xl transition-shadow duration-500 rounded-none select-none"
            >
              {/* Category Image */}
              <img
                src={cat.image}
                alt={`${cat.name} Collection`}
                className="absolute inset-0 size-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Dark Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 opacity-90 group-hover:opacity-95" />

              {/* Text Card overlay */}
              <div className="absolute inset-6 flex flex-col justify-end text-left text-white z-10 flex flex-col gap-1">
                <span className="text-[9px] font-semibold tracking-widest text-primary uppercase">
                  {cat.count}
                </span>
                <h3 className="font-['Space_Grotesk'] text-lg font-semibold tracking-wider uppercase">
                  {cat.name}
                </h3>
                <span className="text-[10px] tracking-[0.25em] font-medium pt-2 uppercase flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
                  Shop Category <span className="translate-x-0 group-hover:translate-x-1 transition-transform duration-300">→</span>
                </span>
              </div>

              {/* Thin border inside */}
              <div className="absolute inset-4 border border-white/10 pointer-events-none transition-all duration-500 group-hover:inset-5" />
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}

export default CollectionPreview
