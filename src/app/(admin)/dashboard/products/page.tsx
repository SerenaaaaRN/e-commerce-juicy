import { productService } from "@/modules/products/services/product-service";
import { ProductListingView } from "@/modules/products/components/product-listing-view";

export default async function ProductsPage(props: { searchParams: Promise<{ q?: string }> }) {
  // mengambil params dari URL (untuk search)
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";

  // fetch data pakai service
  const products = await productService.getAll(query);

  // return View Component
  return <ProductListingView products={products} query={query} />;
}
