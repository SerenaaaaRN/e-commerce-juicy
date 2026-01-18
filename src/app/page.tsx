import { createClient } from "@/utils/supabase/server";
import Image from "next/image";

// Ini adalah Server Component (async)
export default async function Home() {
  // 1. Init Supabase Client di Server
  const supabase = await createClient();

  // 2. Fetch Data (Direct ke DB)
  const { data: products, error } = await supabase
    .from("products")
    .select("*, categories(*)") // Join tabel categories kalau mau nama kategorinya
    .eq("is_active", true); // Hanya ambil produk aktif

  // 3. Error Handling sederhana
  if (error) {
    return <div className="p-10 text-red-500">Error: {error.message}</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Supabase Smoke Test 🚀</h1>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image Section */}
              <div className="relative h-48 w-full bg-gray-200">
                {product.image_url ? (
                  <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-4">
                <div className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wide">
                  {product.categories?.name || "Uncategorized"}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h2>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{product.description}</p>

                <div className="flex justify-between items-center mt-4 border-t pt-4">
                  <span className="text-lg font-bold text-gray-900">Rp {product.price.toLocaleString("id-ID")}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Stok: {product.stock}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {products?.length === 0 && (
          <p className="text-center text-gray-500 mt-10">Belum ada produk. Cek database kamu.</p>
        )}
      </div>
    </main>
  );
}
