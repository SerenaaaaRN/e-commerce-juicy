import { productService } from "@/modules/products/services/product-service";
import { CreateProductForm } from "@/modules/products/components/create-product-form";

export default async function CreateProductPage() {
  // fetch data yang dibutuhkan form (Categories) via Service
  const categories = await productService.getCategories();

  // render Form Component
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center gap-4">
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight">Create Product</h1>
      </div>

      <CreateProductForm categories={categories} />
    </div>
  );
}
