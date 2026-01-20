import { notFound } from "next/navigation";
import { productService } from "@/modules/products/services/product-service";
import { EditProductForm } from "@/modules/products/components/edit-product-form";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  // Fetch data paralel (Product & Categories) via Service
  const [product, categories] = await Promise.all([productService.getById(id), productService.getCategories()]);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center gap-4">
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight">Edit Product</h1>
        <span className="text-muted-foreground ml-2 text-sm">ID: {product.id.slice(0, 8)}...</span>
      </div>

      <EditProductForm product={product} categories={categories} />
    </div>
  );
}
