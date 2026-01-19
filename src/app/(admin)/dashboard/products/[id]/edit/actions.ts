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

export async function updateProduct(id: string, prevState: ActionState, formData: FormData): Promise<ActionState> {
  // 1. Validasi (Menggunakan aturan yang sama persis dengan Create)
  const validation = productSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validation.success) {
    return {
      error: "Validasi gagal.",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  // 2. Update Database
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({
      ...validation.data,
      updated_at: new Date().toISOString(), // Update timestamp
    })
    .eq("id", id);

  if (error) {
    console.error("Database Error:", error);
    if (error.code === "23505") {
      return {
        error: "Slug sudah digunakan.",
        fieldErrors: { slug: ["Slug harus unik"] },
      };
    }
    return { error: "Gagal memperbarui produk." };
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}
