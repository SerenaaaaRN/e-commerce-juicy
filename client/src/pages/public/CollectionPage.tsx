import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mockData";
import ProductCard from "@/components/shop/ProductCard";
import { initLenis } from "@/lib/lenis";
import { JuicyMotion } from "@/lib/gsap";
import { Input } from "@/components/ui/input";
import { X, SlidersHorizontal, ChevronDown } from "lucide-react";

const ITEMS_PER_PAGE = 8;

const UNIQUE_COLORS = [
  { name: "Ivory", hex: "#FAF5E9" },
  { name: "Terracotta", hex: "#B5633A" },
  { name: "Sand", hex: "#C9B99A" },
  { name: "Natural", hex: "#E8D8C8" },
  { name: "Gold", hex: "#D4AF37" },
];

const SIZES = ["XS", "S", "M", "L"] as const;

const TAGS = [
  { value: "new-arrival", label: "New Arrival" },
  { value: "sale", label: "Sale" },
  { value: "bestseller", label: "Bestseller" },
];

const PRICE_RANGES = [
  { label: "Under IDR 500K", min: 0, max: 500000 },
  { label: "IDR 500K - 1M", min: 500000, max: 1000000 },
  { label: "IDR 1M - 2M", min: 1000000, max: 2000000 },
  { label: "Above IDR 2M", min: 2000000, max: Infinity },
];

const RATINGS = [5, 4, 3, 2, 1];

const CollectionPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const activeCategory = searchParams.get("category") || "all";

  const selectedCategories = useMemo(() => {
    const raw = searchParams.get("categories");
    return raw ? raw.split(",") : [];
  }, [searchParams]);

  const selectedColors = useMemo(() => {
    const raw = searchParams.get("colors");
    return raw ? raw.split(",") : [];
  }, [searchParams]);

  const selectedSizes = useMemo(() => {
    const raw = searchParams.get("sizes");
    return raw ? raw.split(",") : [];
  }, [searchParams]);

  const selectedTags = useMemo(() => {
    const raw = searchParams.get("tags");
    return raw ? raw.split(",") : [];
  }, [searchParams]);

  const priceMin = useMemo(() => {
    const v = searchParams.get("priceMin");
    return v ? Number(v) : 0;
  }, [searchParams]);

  const priceMax = useMemo(() => {
    const v = searchParams.get("priceMax");
    return v ? Number(v) : Infinity;
  }, [searchParams]);

  const selectedRating = useMemo(() => {
    const v = searchParams.get("rating");
    return v ? Number(v) : 0;
  }, [searchParams]);

  const inStockOnly = searchParams.get("inStock") === "true";

  const activeFilterCount =
    selectedCategories.length +
    selectedColors.length +
    selectedSizes.length +
    selectedTags.length +
    (priceMin > 0 || priceMax < Infinity ? 1 : 0) +
    (selectedRating > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const updateParams = (key: string, value: string | null) => {
    setCurrentPage(1);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value === null || value === "") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      return next;
    });
  };

  const toggleArrayParam = (key: string, value: string) => {
    setCurrentPage(1);
    setSearchParams((prev) => {
      const raw = prev.get(key);
      const arr = raw ? raw.split(",") : [];
      const idx = arr.indexOf(value);
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(value);
      const next = new URLSearchParams(prev);
      if (arr.length === 0) next.delete(key);
      else next.set(key, arr.join(","));
      return next;
    });
  };

  const clearAllFilters = () => {
    setCurrentPage(1);
    setSearchParams(new URLSearchParams());
  };

  useEffect(() => {
    const lenis = initLenis();
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  }, [activeCategory, currentPage]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setLoading(true));
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => {
        JuicyMotion.gridStagger(".collection-item");
      }, 50);
    }, 450);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [searchParams, sortBy, currentPage]);

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category.slug))
        return false;
      if (
        selectedColors.length > 0 &&
        !product.variants.some((v) => selectedColors.includes(v.color))
      )
        return false;
      if (
        selectedSizes.length > 0 &&
        !product.variants.some((v) => selectedSizes.includes(v.size))
      )
        return false;
      if (
        selectedTags.length > 0 &&
        !product.tags.some((t) => selectedTags.includes(t))
      )
        return false;
      if (product.price < priceMin || product.price > priceMax) return false;
      if (selectedRating > 0 && product.avg_rating < selectedRating) return false;
      if (inStockOnly && !product.is_available) return false;
      return true;
    });
  }, [
    selectedCategories,
    selectedColors,
    selectedSizes,
    selectedTags,
    priceMin,
    priceMax,
    selectedRating,
    inStockOnly,
  ]);

  const sortedProducts = useMemo(() => {
    const copy = [...filteredProducts];
    if (sortBy === "price_asc") return copy.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") return copy.sort((a, b) => b.price - a.price);
    if (sortBy === "popular") return copy.sort((a, b) => b.avg_rating - a.avg_rating);
    return copy.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [filteredProducts, sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  const activeCategoryDetails = MOCK_CATEGORIES.find((c) => c.slug === activeCategory);

  const FilterSidebar = () => (
    <div className="flex flex-col gap-8">
      <div>
        <h4 className="text-soil mb-3 text-[10px] font-bold tracking-[0.2em] uppercase">
          Category
        </h4>
        <div className="flex flex-col gap-2">
          <label className="flex cursor-pointer items-center gap-2.5 text-xs text-dust hover:text-soil transition-colors">
            <input
              type="checkbox"
              checked={selectedCategories.length === 0}
              onChange={() => {
                setCurrentPage(1);
                updateParams("categories", null);
              }}
              className="size-3.5 accent-terracotta"
            />
            All Categories
          </label>
          {MOCK_CATEGORIES.map((cat) => (
            <label
              key={cat.slug}
              className="flex cursor-pointer items-center gap-2.5 text-xs text-dust hover:text-soil transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.slug)}
                onChange={() => toggleArrayParam("categories", cat.slug)}
                className="size-3.5 accent-terracotta"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-soil mb-3 text-[10px] font-bold tracking-[0.2em] uppercase">
          Price Range
        </h4>
        <div className="flex flex-col gap-2">
          {PRICE_RANGES.map((range) => {
            const isActive = priceMin === range.min && priceMax === range.max;
            return (
              <button
                key={range.label}
                onClick={() => {
                  setCurrentPage(1);
                  if (isActive) {
                    updateParams("priceMin", null);
                    updateParams("priceMax", null);
                  } else {
                    updateParams("priceMin", String(range.min));
                    updateParams("priceMax", range.max === Infinity ? null : String(range.max));
                  }
                }}
                className={`text-left text-xs transition-colors ${
                  isActive ? "text-terracotta font-semibold" : "text-dust hover:text-soil"
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={priceMin || ""}
            onChange={(e) => updateParams("priceMin", e.target.value || null)}
            className="h-8 text-xs"
          />
          <span className="text-dust text-xs">&mdash;</span>
          <Input
            type="number"
            placeholder="Max"
            value={priceMax === Infinity ? "" : priceMax || ""}
            onChange={(e) => updateParams("priceMax", e.target.value || null)}
            className="h-8 text-xs"
          />
        </div>
      </div>

      <div>
        <h4 className="text-soil mb-3 text-[10px] font-bold tracking-[0.2em] uppercase">
          Color
        </h4>
        <div className="flex flex-wrap gap-2.5">
          {UNIQUE_COLORS.map((c) => {
            const isActive = selectedColors.includes(c.name);
            return (
              <button
                key={c.name}
                onClick={() => toggleArrayParam("colors", c.name)}
                className={`size-7 rounded-full border-2 transition-all ${
                  isActive
                    ? "border-terracotta scale-110 shadow-sm"
                    : "border-transparent hover:border-sand/50"
                }`}
                title={c.name}
              >
                <span
                  className="block size-full rounded-full"
                  style={{ backgroundColor: c.hex }}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-soil mb-3 text-[10px] font-bold tracking-[0.2em] uppercase">
          Size
        </h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => {
            const isActive = selectedSizes.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleArrayParam("sizes", s)}
                className={`h-8 w-10 text-xs font-semibold rounded-[2px] border transition-all ${
                  isActive
                    ? "bg-soil text-chalk border-soil"
                    : "border-sand/40 text-dust hover:border-soil hover:text-soil"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-soil mb-3 text-[10px] font-bold tracking-[0.2em] uppercase">
          Collection
        </h4>
        <div className="flex flex-col gap-2">
          {TAGS.map((t) => (
            <label
              key={t.value}
              className="flex cursor-pointer items-center gap-2.5 text-xs text-dust hover:text-soil transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedTags.includes(t.value)}
                onChange={() => toggleArrayParam("tags", t.value)}
                className="size-3.5 accent-terracotta"
              />
              {t.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-soil mb-3 text-[10px] font-bold tracking-[0.2em] uppercase">
          Availability
        </h4>
        <label className="flex cursor-pointer items-center gap-2.5 text-xs text-dust hover:text-soil transition-colors">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={() => updateParams("inStock", inStockOnly ? null : "true")}
            className="size-3.5 accent-terracotta"
          />
          In Stock Only
        </label>
      </div>

      <div>
        <h4 className="text-soil mb-3 text-[10px] font-bold tracking-[0.2em] uppercase">
          Minimum Rating
        </h4>
        <div className="flex flex-col gap-1.5">
          {RATINGS.map((r) => (
            <button
              key={r}
              onClick={() => updateParams("rating", selectedRating === r ? null : String(r))}
              className={`flex items-center gap-2 text-xs transition-colors text-left ${
                selectedRating === r
                  ? "text-terracotta font-semibold"
                  : "text-dust hover:text-soil"
              }`}
            >
              <span className="text-amber-500">{r}</span>
              <svg className="size-3 fill-amber-500" viewBox="0 0 24 24">
                <path d="M11.48 3.499c.196-.427.778-.427.975 0l2.646 5.753 6.002.502c.475.04.665.632.296.974l-4.526 4.195 1.34 5.926c.106.471-.413.856-.816.59l-5.01-3.328-5.01 3.328c-.403.266-.922-.119-.816-.59l1.34-5.926-4.526-4.195c-.37-.341-.18-.934.296-.974l6.002-.502 2.646-5.753z" />
              </svg>
              <span className="text-dust/60">& up</span>
            </button>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="text-terracotta hover:text-terracotta/80 text-xs font-semibold tracking-wider uppercase transition-colors self-start"
        >
          Clear All ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-background font-dm-sans min-h-screen py-12 transition-all duration-300 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:mb-14">
          <span className="text-terracotta text-[10px] font-semibold tracking-[0.2em] uppercase">
            Our Offerings
          </span>
          <h1 className="font-playfair text-soil mt-2 text-4xl font-normal capitalize tracking-wide sm:text-5xl md:text-6xl">
            {activeCategory === "all"
              ? "The Atelier Catalog"
              : activeCategoryDetails?.name}
          </h1>
          <p className="text-dust mx-auto mt-4 max-w-md text-xs leading-relaxed">
            {activeCategory === "all"
              ? "Browse our complete capsule of luxury, sun-drenched warm silhouettes carefully hand-assembled for seasonal transitions."
              : activeCategoryDetails?.description ||
                `Explore our premium collection of luxury crafted ${activeCategoryDetails?.name}.`}
          </p>
        </div>

        <div className="flex gap-10 lg:gap-14">
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-none">
              <FilterSidebar />
            </div>
          </aside>

          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-soil/50 backdrop-blur-sm"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="bg-chalk absolute left-0 top-0 h-full w-72 overflow-y-auto border-r border-sand/20 px-6 py-8 shadow-xl animate-in slide-in-from-left">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-soil text-xs font-bold tracking-[0.2em] uppercase">
                    Filters
                  </span>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="text-dust hover:text-soil transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <FilterSidebar />
              </div>
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="border-sand/25 flex items-center justify-between border-y py-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="text-soil hover:text-terracotta flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase transition-colors lg:hidden"
                >
                  <SlidersHorizontal className="size-3.5" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-terracotta text-chalk ml-0.5 flex size-4 items-center justify-center rounded-full text-[8px] font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <span className="text-dust text-xs">
                  {sortedProducts.length} Item{sortedProducts.length !== 1 ? "s" : ""}
                </span>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-terracotta text-[10px] font-semibold tracking-wider uppercase transition-colors hover:opacity-80"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="relative flex items-center gap-1.5">
                <span className="text-dust text-xs">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setSortBy(e.target.value);
                  }}
                  className="text-soil bg-transparent pr-4 text-xs font-semibold outline-none appearance-none cursor-pointer"
                >
                  <option value="newest">Newest Drops</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="popular">Highly Rated</option>
                </select>
                <ChevronDown className="text-soil pointer-events-none absolute right-0 size-3" />
              </div>
            </div>

            {loading ? (
              <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((s) => (
                  <div key={s} className="flex animate-pulse flex-col gap-3">
                    <div className="bg-cream aspect-[3/4] w-full" />
                    <div className="bg-cream mt-1 h-4 w-2/3" />
                    <div className="bg-cream h-3 w-1/3" />
                  </div>
                ))}
              </div>
            ) : paginatedProducts.length > 0 ? (
              <div className="collection-grid mt-8 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3">
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="collection-item opacity-0">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-20 text-center">
                <span className="font-playfair text-dust text-xl">
                  No garments found
                </span>
                <p className="text-dust max-w-xs text-xs">
                  Try adjusting your filters or check back for new drops.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="text-terracotta mt-2 text-xs font-semibold tracking-wider uppercase underline underline-offset-4 transition-colors hover:opacity-80"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {totalPages > 1 && !loading && (
              <div className="mt-20 flex items-center justify-center gap-3 text-xs font-semibold">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="border-sand/40 hover:border-terracotta hover:text-terracotta disabled:opacity-30 disabled:pointer-events-none flex size-10 cursor-pointer items-center justify-center rounded-[2px] border transition-colors"
                >
                  &larr;
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const p = idx + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`flex size-10 cursor-pointer items-center justify-center rounded-[2px] border transition-colors ${
                        currentPage === p
                          ? "bg-terracotta text-chalk border-transparent"
                          : "border-sand/40 text-soil hover:border-terracotta hover:text-terracotta"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="border-sand/40 hover:border-terracotta hover:text-terracotta disabled:opacity-30 disabled:pointer-events-none flex size-10 cursor-pointer items-center justify-center rounded-[2px] border transition-colors"
                >
                  &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
