import { productService } from "@/modules/products/services/product-service";
import { HeroSection } from "@/modules/store/components/hero-section";
import ProductCard from "@/modules/store/components/product-card";

export default async function StorePage() {
  const products = await productService.getFeatured(8);

  return (
    <div className="flex flex-col gap-8 pb-10">
      <HeroSection />

      {/* PRODUCT GRID SECTION */}
      <ProductCard products={products} />
    </div>
  );
}
