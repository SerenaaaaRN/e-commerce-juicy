"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// Definisikan tipe untuk state error/success
export type FormState = {
  error?: string;
  fieldErrors?: {
    [key: string]: string[] | undefined;
  };
} | null;

const productSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  slug: z.string().min(3, "Slug minimal 3 karakter"),
  description: z.string().optional(),
  price: z.coerce.number().min(100, "Harga minimal 100 perak"),
  stock: z.coerce.number().min(0, "Stok tidak boleh minus"),
  category_id: z.string().min(1, "Pilih kategori"),
  image_url: z.string().optional(), // Tambahan kolom Image
  is_active: z.boolean(),
});

/**
 * Server Action untuk membuat produk baru.
 * * @param prevState - State sebelumnya (diperlukan oleh useActionState)
 * @param formData - Data form yang dikirim dari client
 * @returns Object state yang berisi error jika gagal, atau redirect jika sukses.
 */

export async function createProduct(prevState: FormState, formData: FormData) {
  const supabase = await createClient();

  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    category_id: formData.get("category_id"),
    image_url: formData.get("image_url"), // Ambil dari hidden input
    is_active: formData.get("is_active") === "true",
  };

  const validatedFields = productSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: "Validasi gagal. Cek input anda.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.from("products").insert(validatedFields.data);

  if (error) {
    console.error("Error creating product:", error);
    return { error: "Gagal membuat produk: " + error.message };
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}
