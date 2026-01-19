"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteProduct(productId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("id", productId);

  if (error) {
    console.error("Error deleting product:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/products");
}
