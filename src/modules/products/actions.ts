"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { productSchema } from "@/lib/validation/product";

// Helper function untuk bikin slug (misal: "Ayam Goreng" -> "ayam-goreng")
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Ganti karakter aneh dengan strip
    .replace(/^-+|-+$/g, ""); // Hapus strip di awal/akhir
}

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  timestamp?: number;
} | null;

/**
 * CREATE PRODUCT
 */
export async function createProduct(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const rawData = Object.fromEntries(formData.entries());

  // 1. PRE-PROCESSING
  // Ambil status dari Select dengan name="status"
  // Jika value="active" -> true, selain itu false
  const isActive = rawData.status === "active";

  // Auto-generate slug dari name
  const generatedSlug = generateSlug(rawData.name as string);

  const payload = {
    ...rawData,
    slug: generatedSlug, // Masukkan slug otomatis
    is_active: isActive,
    price: rawData.price === "" ? undefined : rawData.price,
    stock: rawData.stock === "" ? undefined : rawData.stock,
  };

  // 2. VALIDASI
  const validatedFields = productSchema.safeParse(payload);

  if (!validatedFields.success) {
    return {
      error: "Validasi gagal. Mohon periksa input anda.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      timestamp: Date.now(),
    };
  }

  const { data } = validatedFields;

  // 3. INSERT DB
  const { error } = await supabase.from("products").insert({
    name: data.name,
    slug: data.slug!, // Pasti ada karena udah digenerate
    description: data.description,
    price: data.price,
    stock: data.stock,
    category_id: data.category_id,
    image_url: data.image_url || null, // Pake key yang benar (image_url)
    is_active: data.is_active,
  });

  if (error) {
    console.error("[createProduct] DB Error:", error.message);
    return { error: `Gagal menyimpan: ${error.message}`, timestamp: Date.now() };
  }

  revalidatePath("/dashboard/products");
  revalidatePath("/");
  redirect("/dashboard/products");
}

/**
 * UPDATE PRODUCT
 */
export async function updateProduct(id: string, prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const rawData = Object.fromEntries(formData.entries());

  // Logic Status & Slug (Slug bisa diupdate kalau nama berubah, atau biarkan tetap)
  const isActive = rawData.status === "active";
  const generatedSlug = generateSlug(rawData.name as string);

  const payload = {
    ...rawData,
    slug: generatedSlug,
    is_active: isActive,
    price: rawData.price === "" ? undefined : rawData.price,
    stock: rawData.stock === "" ? undefined : rawData.stock,
  };

  const validatedFields = productSchema.safeParse(payload);

  if (!validatedFields.success) {
    return {
      error: "Validasi gagal.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      timestamp: Date.now(),
    };
  }

  const { data } = validatedFields;

  // Logic Gambar: Prioritas upload baru > existing
  const finalImageUrl = data.image_url || (rawData.existing_image_url as string) || null;

  const { error } = await supabase
    .from("products")
    .update({
      name: data.name,
      slug: data.slug!,
      description: data.description,
      price: data.price,
      stock: data.stock,
      category_id: data.category_id,
      image_url: finalImageUrl,
      is_active: data.is_active,
    })
    .eq("id", id);

  if (error) {
    console.error("[updateProduct] DB Error:", error.message);
    return { error: `Gagal update: ${error.message}`, timestamp: Date.now() };
  }

  revalidatePath("/dashboard/products");
  revalidatePath("/");
  redirect("/dashboard/products");
}

/**
 * DELETE PRODUCT
 */
export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error("Gagal menghapus produk");
  revalidatePath("/dashboard/products");
}
