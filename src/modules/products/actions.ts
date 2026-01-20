"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { productSchema } from "@/lib/validation/product";

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  timestamp?: number; 
} | null;

/**
 * Server Action untuk membuat produk baru.
 */
export async function createProduct(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();

  // validasi input dengan Zod
  const rawData = Object.fromEntries(formData.entries());

  // konversi checkbox "is_active" & "is_featured" dari string "on" ke boolean
  const validatedFields = productSchema.safeParse({
    ...rawData,
    price: Number(rawData.price),
    stock: Number(rawData.stock),
    is_active: rawData.is_active === "on",
  });

  if (!validatedFields.success) {
    return {
      error: "Validasi gagal. Mohon periksa input anda.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      timestamp: Date.now(),
    };
  }

  const { data } = validatedFields;

  // insert ke Database (Supabase)
  const { error } = await supabase.from("products").insert({
    name: data.name,
    slug: data.slug, // Pastikan slug digenerate di client atau di sini
    description: data.description,
    price: data.price,
    stock: data.stock,
    category_id: data.category_id,
    image_url: data.images?.[0] || null, 
    is_active: data.is_active,
  });

  if (error) {
    console.error("[createProduct] DB Error:", error.message);
    return {
      error: "Gagal menyimpan produk ke database. Coba lagi nanti.",
      timestamp: Date.now(),
    };
  }

  // revalidate & Redirect
  revalidatePath("/dashboard/products");
  revalidatePath("/"); 
  redirect("/dashboard/products");
}

/**
 * Server Action untuk mengupdate produk.
 */
export async function updateProduct(
  id: string,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const rawData = Object.fromEntries(formData.entries());

  // 1. Validasi Input (Reuse Schema yang sama)
  const validatedFields = productSchema.safeParse({
    ...rawData,
    price: Number(rawData.price),
    stock: Number(rawData.stock),
    is_active: rawData.is_active === "on",
  });

  if (!validatedFields.success) {
    return {
      error: "Validasi gagal. Periksa input anda.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      timestamp: Date.now(),
    };
  }

  const { data } = validatedFields;

  // 2. Update ke Database
  const { error } = await supabase
    .from("products")
    .update({
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      stock: data.stock,
      category_id: data.category_id,
      image_url: data.images?.[0] || rawData.existing_image_url, // Handle logic gambar
      is_active: data.is_active,
    })
    .eq("id", id);

  if (error) {
    console.error("[updateProduct] DB Error:", error.message);
    return { error: "Gagal mengupdate produk.", timestamp: Date.now() };
  }

  // 3. Revalidate & Redirect
  revalidatePath("/dashboard/products");
  revalidatePath("/");
  redirect("/dashboard/products");
}

/**
 * Server Action untuk menghapus produk.
 */
export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("[deleteProduct] DB Error:", error.message);
    // Di real app, sebaiknya return state error ke UI, tapi untuk simpelnya kita log dulu
    throw new Error("Gagal menghapus produk");
  }

  revalidatePath("/dashboard/products");
}