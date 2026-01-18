"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().optional(),
  price: z.coerce.number().min(100),
  stock: z.coerce.number().min(0),
  category_id: z.string().min(1),
  is_active: z.boolean(),
});

export async function createProduct(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    category_id: formData.get("category_id"),
    is_active: formData.get("is_active") === "true",
  };

  const validatedFields = productSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: "Validasi gagal. Cek kembali input anda.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.from("products").insert([validatedFields.data]);

  if (error) {
    console.error("Supabase Error:", error);
    return { error: "Gagal menyimpan produk: " + error.message };
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}
