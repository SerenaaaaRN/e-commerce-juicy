import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { initLenis } from "@/lib/lenis";
import Divider from "@/components/ui/Divider";
import { Button, ButtonLink } from "@/components/ui/button";
import { productsApi } from "@/lib/api";
import type { ProductSummary, ProductDetail } from "@/lib/api/types";
import { Heart, Loader2 } from "lucide-react";

// Creative Mediterranean location names mapped to product categories/ids
const getCampaignLocation = (category: string) => {
  const locs: Record<string, string> = {
    tops: "Provence Lavender Fields",
    bottoms: "St. Tropez Coastline",
    dresses: "Marseille Port d'Attache",
    outerwear: "Paris Design Archives",
    accessories: "Camargue Salt Marshes",
    sets: "Gordes Terracotta Villa",
  };
  return locs[category.toLowerCase()] || "Mediterranean Coast";
};

const getCampaignSeason = (category: string) => {
  if (category.toLowerCase() === "outerwear") return "Autumn Atelier Preview";
  return "Summer Atelier Edition";
};

const ShowroomPage = () => {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [activeProduct, setActiveProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [lovedLooks, setLovedLooks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const lenis = initLenis();
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });

    const fetchAll = async () => {
      try {
        setLoading(true);
        const data = await productsApi.listProducts({ per_page: 12 });
        setProducts(data);
        if (data.length > 0) {
          const detail = await productsApi.getProductBySlug(data[0].slug);
          setActiveProduct(detail);
        }
      } catch (err) {
        console.error("Failed to load dynamic showroom data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleSelectProduct = async (slug: string) => {
    try {
      setDetailsLoading(true);
      const detail = await productsApi.getProductBySlug(slug);
      setActiveProduct(detail);

      const showcaseElem = document.getElementById("showcase-section");
      if (showcaseElem) {
        showcaseElem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (err) {
      console.error("Failed to load product details:", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const toggleLove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLovedLooks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="bg-background font-dm-sans text-soil flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="text-terracotta mb-4 size-8 animate-spin" />
        <span className="text-dust text-xs font-semibold tracking-widest uppercase">
          Synchronizing database catalog...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-background font-dm-sans text-soil min-h-screen py-16 transition-all duration-300 sm:py-24">
      <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8">
        {/* Editorial Showroom Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center sm:mb-24">
          <span className="text-terracotta mb-3 block text-[10px] font-bold tracking-[0.3em] uppercase">
            Atelier Campaign
          </span>
          <h1 className="font-playfair text-soil text-4xl leading-tight font-normal select-none sm:text-5xl lg:text-6xl">
            The Showroom
          </h1>
          <p className="text-dust mt-4 text-xs leading-relaxed font-normal sm:text-sm">
            Step into our database-driven lookbook archive. Explore styled compositions, sun-drenched Provence
            campaigns, and structured silhouettes designed for raw motion.
          </p>
        </div>

        {/* Featured Large Look Showcase Section */}
        {activeProduct ? (
          <div
            id="showcase-section"
            className="bg-cream/30 border-sand/15 relative mb-24 grid grid-cols-1 items-center gap-12 rounded-[2px] border p-6 transition-all duration-500 sm:p-8 lg:grid-cols-12 lg:gap-16 lg:p-12"
          >
            {detailsLoading && (
              <div className="bg-chalk/60 absolute inset-0 z-10 flex items-center justify-center rounded-[2px] backdrop-blur-xs">
                <Loader2 className="text-terracotta size-6 animate-spin" />
              </div>
            )}

            {/* Left: Active Look Large Visual */}
            <aside className="bg-cream border-sand/10 relative aspect-3/4 overflow-hidden border lg:col-span-7">
              <img
                src={
                  activeProduct.images?.find((i) => i.is_primary)?.image_url ||
                  activeProduct.images?.[0]?.image_url ||
                  "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"
                }
                alt={activeProduct.name}
                className="animate-fade-in size-full object-cover"
              />
              <span className="bg-terracotta text-chalk absolute top-4 left-4 rounded-[1px] px-2.5 py-1 text-[8px] font-bold tracking-widest uppercase">
                {getCampaignSeason(activeProduct.category?.slug || "dresses")}
              </span>
            </aside>

            {/* Right: Active Look Details */}
            <aside className="flex flex-col gap-6 lg:col-span-5">
              <div>
                <span className="text-dust/80 text-[10px] font-bold tracking-[0.15em] uppercase">
                  {getCampaignLocation(activeProduct.category?.slug || "dresses")}
                </span>
                <h3 className="font-playfair text-soil mt-1.5 text-3xl leading-tight font-normal sm:text-4xl">
                  {activeProduct.name}
                </h3>
                <span className="text-terracotta mt-1 block text-sm font-bold">
                  Rp {activeProduct.price.toLocaleString("id-ID")}
                </span>
              </div>

              <p className="text-dust text-xs leading-relaxed font-normal">
                {activeProduct.description ||
                  "A masterfully draped piece woven from organically sourced sustainable flax, finished with heritage clay washes to ensure structural elegance and ultimate softness."}
              </p>

              <Divider className="my-2" />

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={(e) => toggleLove(activeProduct.id, e)}
                  className={`text-[10px] font-bold tracking-wider uppercase ${
                    lovedLooks[activeProduct.id]
                      ? "border-terracotta text-terracotta bg-terracotta/5"
                      : "border-sand text-soil"
                  }`}
                >
                  <Heart className={`size-4 ${lovedLooks[activeProduct.id] ? "fill-current" : ""}`} />
                  <span>{lovedLooks[activeProduct.id] ? "Loved" : "Add to Lookbook"}</span>
                </Button>

                <Link to={`/product/${activeProduct.slug}`} className="flex-1">
                  <Button
                    variant="primary"
                    size="default"
                    className="w-full py-2.5 text-[10px] font-bold tracking-widest uppercase"
                  >
                    Acquire Dynamic Piece
                  </Button>
                </Link>
              </div>
            </aside>
          </div>
        ) : null}

        {/* Gallery Grid */}
        <div className="space-y-8">
          <div className="border-sand/35 flex items-center justify-between border-b pb-4">
            <h4 className="font-playfair text-soil text-xl font-normal sm:text-2xl">Curated Silhouettes Lookbook</h4>
            <span className="text-dust text-[10px] font-bold tracking-widest uppercase">
              Season Collection ({products.length} live pieces)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {products.map((look) => {
              const isActive = activeProduct?.id === look.id;
              const isLoved = !!lovedLooks[look.id];

              return (
                <div
                  key={look.id}
                  onClick={() => handleSelectProduct(look.slug)}
                  className={`group bg-cream/10 hover:bg-cream/40 relative flex cursor-pointer flex-col gap-3 rounded-[2px] border p-4 transition-all ${
                    isActive ? "border-terracotta ring-terracotta/40 scale-102 ring-1" : "border-sand/20"
                  }`}
                >
                  {/* Frame */}
                  <div className="bg-cream border-sand/10 relative aspect-3/4 overflow-hidden border">
                    <img
                      src={
                        look.primary_image ||
                        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={look.name}
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Hover detail trigger */}
                    <div className="bg-soil/45 absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectProduct(look.slug);
                        }}
                      >
                        Inspect Look
                      </Button>
                      <ButtonLink
                        to={`/product/${look.slug}`}
                        variant="primary"
                        size="xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Product
                      </ButtonLink>
                    </div>

                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={(e) => toggleLove(look.id, e)}
                      className={`absolute top-3 right-3 rounded-full bg-chalk/90 backdrop-blur-xs shadow-xs ${
                        isLoved ? "text-terracotta" : "text-dust hover:text-terracotta"
                      }`}
                    >
                      <Heart className={`size-3.5 ${isLoved ? "fill-current" : ""}`} />
                    </Button>
                  </div>

                  {/* Look caption */}
                  <div className="mt-1 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-terracotta text-[9px] font-bold tracking-wider uppercase">
                        {getCampaignSeason(look.category_name)}
                      </span>
                      <span className="text-dust text-[9px] font-semibold uppercase">
                        {getCampaignLocation(look.category_name)}
                      </span>
                    </div>
                    <h5 className="font-playfair text-soil group-hover:text-terracotta truncate text-sm font-semibold transition-colors">
                      {look.name}
                    </h5>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowroomPage;
