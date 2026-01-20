import { Tables } from "@/types/supabase";

/**
 * Tipe data Produk yang sudah di-join dengan tabel Kategori.
 * Digunakan untuk listing produk di halaman Admin dan Store.
 */
export type ProductWithCategory = Tables<"products"> & {
  categories: { name: string } | null;
};
