import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { JuicyMotion } from "@/lib/gsap";

const CATEGORY_TILES = [
  {
    title: "Dresses & Robes",
    subtitle: "Flowing silhouettes cut for golden hour",
    slug: "dresses",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=85",
    span: "md:col-span-2 md:row-span-2",
    aspect: "aspect-[4/5] md:aspect-auto",
  },
  {
    title: "Airy Tops",
    subtitle: "Linen and silk for warm coastal winds",
    slug: "tops",
    image: "https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=85",
    span: "md:col-span-1",
    aspect: "aspect-[4/5]",
  },
  {
    title: "Editorial Sets",
    subtitle: "Curated two-pieces in raw canvas",
    slug: "sets",
    image: "https://images.unsplash.com/photo-1608234807905-4465857986fd?auto=format&fit=crop&w=800&q=85",
    span: "md:col-span-1",
    aspect: "aspect-[4/5]",
  },
  {
    title: "Summer Accents",
    subtitle: "Leather goods touched by the Mediterranean",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85",
    span: "md:col-span-2 md:row-span-1",
    aspect: "aspect-[4/5] md:aspect-[4/3]",
  },
];

const CollectionPreview = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    JuicyMotion.scrollReveal(".tile-item", ["scale", "slide-right", "slide-left", "clip"], 0.2);
    JuicyMotion.parallaxTiles(".tile-item", ".tile-img");
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-chalk relative overflow-hidden py-24 sm:py-32 font-dm-sans"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center sm:mb-20">
          <span className="text-terracotta text-[10px] font-semibold tracking-[0.25em] uppercase">
            Curated Edits
          </span>
          <h2 className="font-playfair text-soil mt-3 text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Explore the Lines
          </h2>
          <p className="text-dust mx-auto mt-4 max-w-lg text-sm leading-relaxed">
            Four distinct chapters, each telling a story of sun-soaked
            craftsmanship and warm-climate luxury.
          </p>
          <div className="bg-sand mx-auto mt-6 h-px w-16" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:grid-rows-[auto_auto] md:gap-8">
          {CATEGORY_TILES.map((tile, i) => (
            <Link
              key={tile.slug}
              to={`/collection?category=${tile.slug}`}
              className={`tile-item group relative block cursor-pointer overflow-hidden border border-sand/15 bg-cream ${tile.span} ${tile.aspect} opacity-0`}
            >
              <div className="absolute inset-0 size-full overflow-hidden">
                <img
                  src={tile.image}
                  alt={tile.title}
                  className="tile-img absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="via-soil/20 absolute inset-0 bg-gradient-to-t from-soil/70 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
              </div>

              <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-8">
                <div className="translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                  <span className="text-terracotta-light text-[9px] font-semibold tracking-[0.25em] uppercase">
                    0{i + 1}
                  </span>
                  <h3 className="font-playfair text-chalk mt-2 text-2xl leading-tight tracking-wide sm:text-3xl">
                    {tile.title}
                  </h3>
                  <p className="text-chalk/60 -translate-y-1 text-xs leading-relaxed opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {tile.subtitle}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/collection"
            className="text-soil hover:text-terracotta group inline-flex items-center gap-3 text-xs font-semibold tracking-[0.25em] uppercase transition-colors duration-300"
          >
            View All Collections
            <span className="bg-terracotta group-hover:bg-terracotta/80 h-px w-8 transition-colors duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CollectionPreview;
