import { useEffect, useState } from "react";
import { useProductStore } from "@/stores/productStore";
import ProductCard from "@/components/shop/ProductCard";
import { JuicyMotion } from "@/lib/gsap";
import { ButtonLink } from "@/components/ui/button";

const FeaturedSection = () => {
  const [loaded, setLoaded] = useState(false);
  const products = useProductStore((s) => s.products);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 3);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (featuredProducts.length > 0 && !loaded) {
      setLoaded(true);
      JuicyMotion.fadeUp(".featured-fade");
      JuicyMotion.gridStagger(".featured-item");
    }
  }, [featuredProducts, loaded]);

  return (
    <section className="py-20 sm:py-28 px-4 max-w-[1400px] mx-auto font-dm-sans bg-transparent">
      {/* Editorial Title Header */}
      <div className="featured-fade flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-terracotta">
            The Selection
          </span>
          <h2 className="font-playfair text-4xl sm:text-5xl font-normal text-soil leading-tight tracking-tight">
            Seasonal Bestsellers
          </h2>
        </div>
        <p className="text-xs text-dust leading-relaxed font-normal max-w-sm">
          A careful curation of our signature pieces, cut from premium sand linen and soft clays designed to breathe under the summer sun.
        </p>
      </div>

      {/* Grid of Product Cards */}
      <div className="featured-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {featuredProducts.map((product) => (
          <div key={product.id} className="featured-item opacity-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Bottom shop trigger link */}
      <div className="featured-fade text-center mt-16">
        <ButtonLink
          to="/collection"
          variant="outline"
          size="sm"
          className="uppercase tracking-widest text-[11px] font-semibold"
        >
          View All Products
        </ButtonLink>
      </div>
    </section>
  );
};

export default FeaturedSection;
