import { Link } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"

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
        <div className="max-w-2xl text-left mb-16 flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">
            Artisanal Taxonomy
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-heading">
            Explore Categories
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
            Handpicked raw textures sorted by design purpose. Choose your aesthetic foundation.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="block group"
            >
              <Card className="overflow-hidden w-full border border-foreground/10 shadow-sm hover:shadow-md transition-all duration-300 relative">
                <AspectRatio ratio={4 / 5}>
                  {/* Category Image */}
                  <img
                    src={cat.image}
                    alt={`${cat.name} Collection`}
                    className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                    loading="lazy"
                  />
                  
                  {/* Dark Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Text Card overlay */}
                  <div className="absolute inset-6 flex flex-col justify-end text-left text-white z-10 gap-1">
                    <span className="text-[10px] font-semibold tracking-widest text-primary uppercase">
                      {cat.count}
                    </span>
                    <h3 className="text-xl font-bold tracking-tight uppercase">
                      {cat.name}
                    </h3>
                    <span className="text-xs font-medium pt-2 flex items-center gap-1 group-hover:text-primary transition-colors duration-200">
                      Shop Category <span>→</span>
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

export default CollectionPreview
