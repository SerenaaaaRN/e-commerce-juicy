import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { initLenis } from "@/lib/lenis";
import Divider from "@/components/ui/Divider";
import { Button } from "@/components/ui/button";
import { productsApi } from "@/lib/api";
import type { ProductSummary, ProductDetail } from "@/lib/api/types";
import { Heart, Maximize2, Sparkles, Loader2 } from "lucide-react";

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

// Creative seasonal names
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
          // Fetch full detailed product description for the first item
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
      
      // Smooth scroll to the top of the showcase section
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
      <div className="bg-background min-h-screen flex flex-col items-center justify-center font-dm-sans text-soil">
        <Loader2 className="size-8 text-terracotta animate-spin mb-4" />
        <span className="text-xs uppercase tracking-widest text-dust font-semibold">
          Synchronizing database catalog...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-16 sm:py-24 font-dm-sans text-soil transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Showroom Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-terracotta block mb-3">
            Atelier Campaign
          </span>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-normal text-soil leading-tight select-none">
            The Showroom
          </h1>
          <p className="text-xs sm:text-sm text-dust font-normal leading-relaxed mt-4">
            Step into our database-driven lookbook archive. Explore styled compositions, sun-drenched Provence campaigns, and structured silhouettes designed for raw motion.
          </p>
        </div>

        {/* Featured Large Look Showcase Section */}
        {activeProduct && (
          <div 
            id="showcase-section"
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center bg-cream/30 border border-sand/15 p-6 sm:p-8 lg:p-12 rounded-[2px] mb-24 transition-all duration-500 relative"
          >
            {detailsLoading && (
              <div className="absolute inset-0 bg-chalk/60 backdrop-blur-xs flex items-center justify-center z-10 rounded-[2px]">
                <Loader2 className="size-6 text-terracotta animate-spin" />
              </div>
            )}

            {/* Left: Active Look Large Visual */}
            <div className="lg:col-span-7 aspect-[3/4] relative overflow-hidden bg-cream border border-sand/10">
              <img
                src={activeProduct.images?.find(i => i.is_primary)?.image_url || activeProduct.images?.[0]?.image_url || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"}
                alt={activeProduct.name}
                className="size-full object-cover animate-fade-in"
              />
              <span className="absolute top-4 left-4 bg-terracotta text-chalk text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-[1px]">
                {getCampaignSeason(activeProduct.category?.slug || "dresses")}
              </span>
            </div>

            {/* Right: Active Look Details */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-dust/80">
                  {getCampaignLocation(activeProduct.category?.slug || "dresses")}
                </span>
                <h3 className="font-playfair text-3xl sm:text-4xl font-normal text-soil leading-tight mt-1.5">
                  {activeProduct.name}
                </h3>
                <span className="text-sm font-bold text-terracotta block mt-1">
                  Rp {activeProduct.price.toLocaleString("id-ID")}
                </span>
              </div>

              <p className="text-xs text-dust leading-relaxed font-normal">
                {activeProduct.description || "A masterfully draped piece woven from organically sourced sustainable flax, finished with heritage clay washes to ensure structural elegance and ultimate softness."}
              </p>

              <Divider className="my-2" />

              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => toggleLove(activeProduct.id, e)}
                  className={`flex items-center gap-2 border px-4 py-2.5 text-[10px] font-bold tracking-wider uppercase transition-all rounded-xs cursor-pointer select-none bg-chalk ${
                    lovedLooks[activeProduct.id]
                      ? "border-terracotta text-terracotta bg-terracotta/5"
                      : "border-sand text-soil hover:border-soil"
                  }`}
                >
                  <Heart className={`size-4 ${lovedLooks[activeProduct.id] ? "fill-current" : ""}`} />
                  <span>{lovedLooks[activeProduct.id] ? "Loved" : "Add to Lookbook"}</span>
                </button>
                
                <Link to={`/product/${activeProduct.slug}`} className="flex-1">
                  <Button variant="primary" size="default" className="w-full text-[10px] font-bold uppercase tracking-widest py-2.5">
                    Acquire Dynamic Piece
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="space-y-8">
          <div className="border-b border-sand/35 pb-4 flex items-center justify-between">
            <h4 className="font-playfair text-xl sm:text-2xl font-normal text-soil">
              Curated Silhouettes Lookbook
            </h4>
            <span className="text-[10px] font-bold tracking-widest text-dust uppercase">
              Season Collection ({products.length} live pieces)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {products.map((look) => {
              const isActive = activeProduct?.id === look.id;
              const isLoved = !!lovedLooks[look.id];

              return (
                <div
                  key={look.id}
                  onClick={() => handleSelectProduct(look.slug)}
                  className={`group relative flex flex-col gap-3 bg-cream/10 border p-4 rounded-[2px] cursor-pointer transition-all hover:bg-cream/40 ${
                    isActive ? "border-terracotta ring-1 ring-terracotta/40 scale-102" : "border-sand/20"
                  }`}
                >
                  {/* Frame */}
                  <div className="aspect-[3/4] relative overflow-hidden bg-cream border border-sand/10">
                    <img
                      src={look.primary_image || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"}
                      alt={look.name}
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Hover detail trigger */}
                    <div className="absolute inset-0 bg-soil/45 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectProduct(look.slug);
                        }}
                        className="bg-chalk text-soil text-[10px] font-bold uppercase tracking-widest px-4 py-2 hover:bg-cream transition-colors rounded-xs shadow-md select-none"
                      >
                        Inspect Look
                      </div>
                      <Link 
                        to={`/product/${look.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-terracotta text-chalk text-[10px] font-bold uppercase tracking-widest px-4 py-2 hover:bg-[#9a5230] transition-colors rounded-xs shadow-md select-none"
                      >
                        View Product
                      </Link>
                    </div>

                    <button
                      onClick={(e) => toggleLove(look.id, e)}
                      className={`absolute top-3 right-3 p-1.5 rounded-full border border-transparent shadow-xs transition-colors bg-chalk/90 backdrop-blur-xs cursor-pointer ${
                        isLoved ? "text-terracotta" : "text-dust hover:text-terracotta"
                      }`}
                    >
                      <Heart className={`size-3.5 ${isLoved ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Look caption */}
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-terracotta uppercase tracking-wider">
                        {getCampaignSeason(look.category_name)}
                      </span>
                      <span className="text-[9px] font-semibold text-dust uppercase">
                        {getCampaignLocation(look.category_name)}
                      </span>
                    </div>
                    <h5 className="font-playfair text-sm font-semibold text-soil truncate group-hover:text-terracotta transition-colors">
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
