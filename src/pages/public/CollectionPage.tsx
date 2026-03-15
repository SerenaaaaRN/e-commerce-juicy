import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mockData";
import ProductCard from "@/components/shop/ProductCard";
import { initLenis } from "@/lib/lenis";
import { JuicyMotion } from "@/lib/gsap";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

const ITEMS_PER_PAGE = 8;

const CollectionPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Get active category slug from query string
  const activeCategory = searchParams.get("category") || "all";

  useEffect(() => {
    const lenis = initLenis();
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  }, [activeCategory, currentPage]);

  // Simulate loading state on category or page changes to show beautiful skeletons
  useEffect(() => {
    const raf = requestAnimationFrame(() => setLoading(true));
    const timer = setTimeout(() => {
      setLoading(false);
      // Re-trigger staggers after skeletons disappear
      setTimeout(() => {
        JuicyMotion.gridStagger(".collection-item");
      }, 50);
    }, 450);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [activeCategory, sortBy, currentPage]);

  // Handle Category tab change
  const handleCategoryChange = (slug: string) => {
    setCurrentPage(1);
    if (slug === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", slug);
    }
    setSearchParams(searchParams);
  };

  // Filter products by category
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      if (activeCategory === "all") return true;
      return product.category.slug === activeCategory;
    });
  }, [activeCategory]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const productsCopy = [...filteredProducts];
    if (sortBy === "price_asc") {
      return productsCopy.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price_desc") {
      return productsCopy.sort((a, b) => b.price - a.price);
    }
    if (sortBy === "popular") {
      return productsCopy.sort((a, b) => b.avg_rating - a.avg_rating);
    }
    // Default: newest
    return productsCopy.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [filteredProducts, sortBy]);

  // Paginate products
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  const activeCategoryDetails = MOCK_CATEGORIES.find((c) => c.slug === activeCategory);

  return (
    <div className="bg-background min-h-screen py-12 sm:py-20 font-dm-sans transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Header Title */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-terracotta">
            Our Offerings
          </span>
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-normal text-soil tracking-wide mt-2 capitalize">
            {activeCategory === "all" ? "The Atelier Catalog" : activeCategoryDetails?.name}
          </h1>
          <p className="text-xs text-dust max-w-md mx-auto leading-relaxed mt-4">
            {activeCategory === "all"
              ? "Browse our complete capsule of luxury, sun-drenched warm silhouettes carefully hand-assembled for seasonal transitions."
              : activeCategoryDetails?.description || `Explore our premium collection of luxury crafted ${activeCategoryDetails?.name}.`}
          </p>
        </div>

        {/* Category Tabs & Sorting Controls */}
        <div className="flex flex-col gap-6 mb-10">
          
          {/* Tabs */}
          <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-3 sm:pb-0 scrollbar-none gap-2 sm:gap-4 border-b border-sand/20">
            <button
              onClick={() => handleCategoryChange("all")}
              className={`text-xs font-semibold uppercase tracking-widest px-4 py-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === "all"
                  ? "border-terracotta text-soil font-bold"
                  : "border-transparent text-dust hover:text-soil"
              }`}
            >
              All
            </button>
            {MOCK_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`text-xs font-semibold uppercase tracking-widest px-4 py-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.slug
                    ? "border-terracotta text-soil font-bold"
                    : "border-transparent text-dust hover:text-soil"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between text-xs text-soil font-medium border-y border-sand/25 py-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-dust" />
              <span>Showing {sortedProducts.length} Items</span>
            </div>
            
            {/* Sort selection */}
            <div className="relative flex items-center gap-1.5 cursor-pointer">
              <span className="text-dust">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setCurrentPage(1);
                  setSortBy(e.target.value);
                }}
                className="bg-transparent font-semibold border-0 outline-none text-soil pr-4 appearance-none cursor-pointer"
              >
                <option value="newest">Newest Drops</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="popular">Highly Rated</option>
              </select>
              <ChevronDown className="size-3.5 absolute right-0 pointer-events-none text-soil" />
            </div>
          </div>

        </div>

        {/* Catalog Grid */}
        {loading ? (
          /* Skeletons block */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <div key={s} className="flex flex-col gap-3 animate-pulse">
                <div className="aspect-[3/4] w-full bg-cream rounded-none" />
                <div className="h-4 w-2/3 bg-cream rounded-none mt-1" />
                <div className="h-3 w-1/3 bg-cream rounded-none" />
              </div>
            ))}
          </div>
        ) : paginatedProducts.length > 0 ? (
          /* Real Products grid */
          <div className="collection-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {paginatedProducts.map((product) => (
              <div key={product.id} className="collection-item opacity-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <span className="font-playfair text-xl text-dust">No garments found</span>
            <p className="text-xs text-dust max-w-xs">
              We are currently re-stocking or designing next season drops. Check back shortly.
            </p>
          </div>
        )}

        {/* Dynamic Pagination Stepper */}
        {totalPages > 1 && !loading && (
          <div className="mt-20 flex items-center justify-center gap-3 text-xs font-semibold">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="size-10 border border-sand/40 hover:border-terracotta hover:text-terracotta disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors cursor-pointer rounded-[2px]"
            >
              &larr;
            </button>
            
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`size-10 flex items-center justify-center transition-colors border cursor-pointer rounded-[2px] ${
                    currentPage === pageNum
                      ? "bg-terracotta text-chalk border-transparent"
                      : "border-sand/40 text-soil hover:border-terracotta hover:text-terracotta"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="size-10 border border-sand/40 hover:border-terracotta hover:text-terracotta disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors cursor-pointer rounded-[2px]"
            >
              &rarr;
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CollectionPage;
