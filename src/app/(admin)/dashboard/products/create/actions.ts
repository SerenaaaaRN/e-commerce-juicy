"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { productSchema } from "@/lib/validation/product"; 

export type ActionState = {
  error?: string;
  fieldErrors?: {
    [key: string]: string[] | undefined;
  };
} | null;

export async function createProduct(prevState: ActionState, formData: FormData): Promise<ActionState> {
  // 1. Validasi menggunakan Schema terpusat
  // Object.fromEntries mengubah FormData jadi object biasa
  const validation = productSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validation.success) {
    return {
      error: "Validasi gagal. Mohon periksa input anda.",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  // 2. Simpan ke Database
  const supabase = await createClient();
  const { error } = await supabase.from("products").insert(validation.data);

  if (error) {
    console.error("Database Error:", error);
    // Cek duplikasi slug (kode error PostgreSQL untuk unique violation: 23505)
    if (error.code === "23505") {
      return {
        error: "Slug sudah digunakan produk lain.",
        fieldErrors: { slug: ["Slug harus unik"] },
      };
    }
    return { error: "Gagal menyimpan produk." };
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}
