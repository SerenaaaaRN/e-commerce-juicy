import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";
import { ProductWithCategory } from "../types";

/**
 * service module: products
 * bertanggung jawab untuk semua operasi database (CRUD) yang berkaitan dengan produk.
 * menggunakan pola Singleton Object untuk pengelompokan method.
 *
 * Seluruh akses Supabase terkait produk (read-only) ditempatkan di sini.
 * Mutasi data menggunakan Server Actions pada `modules/products/actions.ts`.
 */
export const productService = {
  /**
   * Mengambil semua daftar produk untuk keperluan Admin Dashboard.
   * Mendukung pencarian (search) berdasarkan nama produk.
   *
   * @param query - (Optional) String untuk filter nama produk
   * @returns Promise<ProductWithCategory[]> - Array produk lengkap dengan nama kategori
   */
  async getAll(query: string = ""): Promise<ProductWithCategory[]> {
    const supabase = await createClient();

    // Query dasar: select semua kolom + join ke tabel categories
    let dbQuery = supabase.from("products").select("*, categories(name)").order("created_at", { ascending: false });

    // Jika ada search query, tambahkan filter ILIKE (case-insensitive)
    if (query) {
      dbQuery = dbQuery.ilike("name", `%${query}%`);
    }

    const { data, error } = await dbQuery;

    if (error) {
      console.error("[productService.getAll] Error:", error.message);
      throw new Error("Gagal mengambil data produk.");
    }

    // Casting data ke tipe yang sesuai
    return (data as ProductWithCategory[]) || [];
  },

  /**
   * Mengambil detail satu produk berdasarkan ID-nya.
   * Biasanya digunakan untuk halaman Edit Produk (admin).
   *
   * @param id - UUID dari produk
   * @returns Promise<Tables<\"products\"> | null> - Object produk atau null jika tidak ketemu
   */
  async getById(id: string): Promise<Tables<"products"> | null> {
    const supabase = await createClient();

    const { data, error } = await supabase.from("products").select("*").eq("id", id).single();

    if (error) {
      console.error(`[productService.getById] Error fetching ID ${id}:`, error.message);
      return null;
    }

    return data;
  },

  /**
   * Mengambil detail produk berdasarkan slug untuk halaman storefront.
   * Meng-join dengan tabel categories agar bisa menampilkan nama kategori.
   */
  async getBySlug(slug: string): Promise<ProductWithCategory | null> {
    const supabase = await createClient();

    const { data, error } = await supabase.from("products").select("*, categories(name)").eq("slug", slug).single();

    if (error) {
      console.error(`[productService.getBySlug] Error fetching slug ${slug}:`, error.message);
      return null;
    }

    return (data as ProductWithCategory) ?? null;
  },

  /**
   * Mengambil produk unggulan untuk ditampilkan di halaman depan (Storefront).
   * Filter: hanya produk yang statusnya 'Active'.
   *
   * @param limit - jumlah produk yang ingin ditampilkan (Default: 8)
   * @returns Promise<ProductWithCategory[]>
   */
  async getFeatured(limit: number = 8): Promise<ProductWithCategory[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .eq("is_active", true) // hanya mengambil yang aktif
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[productService.getFeatured] Error:", error.message);
      return [];
    }

    return (data as ProductWithCategory[]) || [];
  },

  /**
   * Mengambil daftar kategori untuk dropdown form.
   */
  async getCategories() {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories") // Pastikan nama tabel benar
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("[productService.getCategories] Error:", error.message);
      return [];
    }

    return data || [];
  },
};
