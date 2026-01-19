"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod"; // Asumsi pakai Zod untuk validasi

// Schema validasi (Best Practice: taruh di file terpisah misal schema.ts)
const productSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  slug: z.string().min(3, "Slug minimal 3 karakter"),
  description: z.string().optional(),
  price: z.coerce.number().min(100, "Harga tidak valid"),
  stock: z.coerce.number().min(0),
  category_id: z.coerce.number(),
  is_active: z.string().optional(), // Switch biasanya kirim string "true" atau null
  image_url: z.string().optional(),
});

export type ActionState = {
  error?: string;
  fieldErrors?: {
    [key: string]: string[] | undefined;
  };
} | null;

/**
 * Memperbarui data produk yang sudah ada di database.
 * * @param id - ID Unik (UUID) dari produk yang akan diedit.
 * @param prevState - State sebelumnya dari hook useActionState.
 * @param formData - Data form raw yang dikirim dari client.
 * * @returns Promise<ActionState> - Object berisi error jika validasi/database gagal.
 * * @example
 * // Penggunaan dengan bind di komponen client:
 * const updateProductWithId = updateProduct.bind(null, product.id);
 * const [state, action] = useActionState(updateProductWithId, null);
 */
export async function updateProduct(id: string, prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();

  // 1. Konversi FormData ke Object
  const rawData = Object.fromEntries(formData.entries());

  // 2. Validasi Data
  const validatedFields = productSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: "Validasi gagal. Mohon periksa input anda.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 3. Siapkan Payload (bersihkan data)
  const payload = {
    name: validatedFields.data.name,
    slug: validatedFields.data.slug,
    description: validatedFields.data.description,
    price: validatedFields.data.price,
    stock: validatedFields.data.stock,
    category_id: validatedFields.data.category_id,
    image_url: validatedFields.data.image_url,
    is_active: rawData.is_active === "true", // Handle switch logic
    updated_at: new Date().toISOString(),
  };

  // 4. Update Database
  const { error } = await supabase.from("products").update(payload).eq("id", id);

  if (error) {
    console.error("Database Error:", error);
    return { error: "Gagal memperbarui produk. Silakan coba lagi." };
  }

  // 5. Revalidate & Redirect
  // Hapus cache halaman products agar data baru muncul
  revalidatePath("/dashboard/products");
  // Redirect kembali ke tabel
  redirect("/dashboard/products");
}
