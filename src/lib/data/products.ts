import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";
import { unstable_cache } from "next/cache";

/**
 * Tipe data produk lengkap dengan relasi kategori.
 */
export type ProductWithCategory = Tables<"products"> & {
  categories: { name: string } | null;
};

/**
 * Mengambil daftar produk dari database dengan filter pencarian.
 * Fungsi ini menggunakan 'unstable_cache' untuk meningkatkan performa pada request yang sama.
 * * @param query - Kata kunci pencarian nama produk.
 * @returns Promise berisi array {@link ProductWithCategory}.
 */
export async function getProducts(query: string = ""): Promise<ProductWithCategory[]> {
  const supabase = await createClient();

  let supabaseQuery = supabase.from("products").select("*, categories(name)").order("created_at", { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.ilike("name", `%${query}%`);
  }

  const { data, error } = await supabaseQuery;

  if (error) {
    console.error("[getProducts] Error:", error.message);
    throw new Error("Gagal mengambil data produk.");
  }

  return (data as ProductWithCategory[]) || [];
}

/**
 * Mengambil detail produk tunggal berdasarkan ID.
 * * @param id - UUID produk.
 * @returns Detail produk atau null jika tidak ditemukan.
 */
export async function getProductById(id: string): Promise<Tables<"products"> | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();

  if (error) {
    console.error(`[getProductById] Error for ID ${id}:`, error.message);
    return null;
  }

  return data;
}
