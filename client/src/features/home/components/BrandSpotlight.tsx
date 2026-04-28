import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export const BrandSpotlight = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative overflow-hidden">
            <AspectRatio ratio={4 / 5}>
              <img
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1740&auto=format&fit=crop"
                alt="Juicy Brand Story"
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
            </AspectRatio>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-xs font-semibold tracking-wider text-primary uppercase">
              Brand Story
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
              The Art of <br />
              <span className="text-primary">Silhouette</span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Juicy adalah brand fashion yang lahir dari kecintaan terhadap 
              silhouette dan tekstur. Setiap koleksi kami dirancang dengan 
              bahan premium dan perhatian terhadap detail, menghadirkan 
              pengalaman berpakaian yang tak tertandingi.
            </p>
            <div className="grid grid-cols-3 gap-6 py-4">
              <div>
                <p className="text-2xl font-bold text-foreground">200+</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Silhouettes</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">50K+</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Happy Customers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">4.8</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Avg Rating</p>
              </div>
            </div>
            <div>
              <Button asChild>
                <Link to="/shop">Explore Collection</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
