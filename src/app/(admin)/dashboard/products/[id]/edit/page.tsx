import { notFound } from "next/navigation";
import { getProductById } from "@/lib/data/products";
import { createClient } from "@/utils/supabase/server";
import EditProductForm from "./edit-form";

/**
 * Server Component untuk halaman Edit Produk.
 * Menangani pengambilan data di sisi server sebelum dikirim ke Client Form.
 */
export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const supabase = await createClient();

  // Ambil data secara paralel untuk efisiensi
  const [product, { data: categories }] = await Promise.all([
    getProductById(id),
    supabase.from("categories").select("*"),
  ]);

  // Jika produk tidak ada, tampilkan halaman 404 standar Next.js
  if (!product) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
      </div>
      <EditProductForm product={product} categories={categories || []} />
    </div>
  );
}
