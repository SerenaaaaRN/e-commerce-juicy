import { useEffect } from "react";
import { Link } from "react-router-dom";
import { JuicyMotion } from "@/lib/gsap";

const CATEGORY_TILES = [
  {
    title: "Dresses & Robes",
    slug: "dresses",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    size: "md:col-span-2 aspect-[4/3]",
  },
  {
    title: "Airy Tops",
    slug: "tops",
    image: "https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80",
    size: "md:col-span-1 aspect-square",
  },
  {
    title: "Editorial Sets",
    slug: "sets",
    image: "https://images.unsplash.com/photo-1608234807905-4465857986fd?auto=format&fit=crop&w=800&q=80",
    size: "md:col-span-1 aspect-square",
  },
  {
    title: "Summer Accents",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    size: "md:col-span-2 aspect-[4/3]",
  },
];

const CollectionPreview = () => {
  useEffect(() => {
    // Fade up sections when entering viewport
    JuicyMotion.fadeUp(".preview-fade");
  }, []);

  return (
    <section className="py-20 sm:py-28 px-4 max-w-[1400px] mx-auto font-dm-sans bg-transparent">
      {/* Title */}
      <div className="preview-fade text-center mb-16 flex flex-col items-center gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-terracotta">
          Curated Edits
        </span>
        <h2 className="font-playfair text-4xl sm:text-5xl font-normal text-soil leading-tight tracking-tight">
          Explore the Lines
        </h2>
        <div className="w-12 h-0.5 bg-sand mt-2" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {CATEGORY_TILES.map((tile) => (
          <Link
            key={tile.slug}
            to={`/collection?category=${tile.slug}`}
            className={`preview-fade group relative overflow-hidden bg-cream block cursor-pointer border border-sand/10 ${tile.size}`}
          >
            {/* Image Layer */}
            <div className="absolute inset-0 size-full overflow-hidden">
              <img
                src={tile.image}
                alt={tile.title}
                className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              {/* editorial shadow gradient mask */}
              <div className="absolute inset-0 bg-gradient-to-t from-soil/60 via-soil/15 to-transparent transition-opacity duration-300 group-hover:opacity-85" />
            </div>

            {/* Floating Title block */}
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex items-end justify-between z-10 text-chalk">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-terracotta-light">
                  Browse
                </span>
                <h3 className="font-playfair text-xl sm:text-2xl font-normal leading-none tracking-wide">
                  {tile.title}
                </h3>
              </div>
              <div className="size-8 rounded-full border border-chalk/35 flex items-center justify-center transition-all duration-300 group-hover:bg-chalk group-hover:text-soil">
                <svg
                  className="size-3.5 transform group-hover:translate-x-px"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CollectionPreview;
