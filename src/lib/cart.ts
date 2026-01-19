"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * mengambil data keranjang belanja berdasarkan Cookie `cartId`.
 *
 * @returns {Promise<object | null>} objek keranjang beserta item produk atau null jika tidak ditemukan.
 */
export async function getCart() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  if (!cartId) return null;

  const supabase = await createClient();
  const { data: cart } = await supabase
    .from("carts")
    .select(
      `
      id,
      cart_items (
        id,
        quantity,
        product: products (
          id,
          name,
          price,
          image_url
        )
      )
    `
    )
    .eq("id", cartId)
    .single();

  return cart;
}

/**
 * menambahkan produk ke dalam keranjang.
 * jika keranjang belum ada, akan dibuatkan baru (Guest Cart).
 * jika produk sudah ada, quantity akan ditambah +1.
 *
 * @param {string} productId - ID (UUID) dari produk yang akan ditambahkan.
 */
export const addToCart = async (productId: string) => {
  const cookieStore = await cookies();
  const supabase = await createClient();
  let cartId = cookieStore.get("cartId")?.value;

  try {
    // cek keranjang, kalo dak ada, buat baru.
    if (!cartId) {
      const { data: newCart, error: createError } = await supabase.from("carts").insert({}).select().single();

      if (createError) throw new Error("Gagal membuat keranjang.");

      cartId = newCart.id;
      cookieStore.set("cartId", cartId, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    // cek produk ini sudah ada di dalam keranjang tersebut atau belum
    // menggunakan .maybeSingle() agar tidak error jika data kosong
    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("cart_id", cartId)
      .eq("product_id", productId)
      .maybeSingle();

    if (existingItem) {
      await supabase
        .from("cart_items")
        .update({ quantity: existingItem.quantity + 1 })
        .eq("id", existingItem.id);
    } else {
      await supabase.from("cart_items").insert({
        cart_id: cartId,
        product_id: productId,
        quantity: 1,
      });
    }

    revalidatePath("/", "layout");
  } catch (error) {
    console.error("[Cart Error]:", error);
    throw error;
  }
};

/**
 * Mengubah jumlah barang di keranjang.
 *
 * @param {string} itemId - UUID dari item di keranjang (cart_items.id).
 * @param {number} quantity - Jumlah baru yang diinginkan.
 */

export const updateItemQuantity = async (itemId: string, quantity: number) => {
  const supabase = await createClient();

  if (quantity < 1) return;

  try {
    const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", itemId);
    if (error) throw new Error("Gagal update quantity");
  } catch (error) {
    console.error("Cart Error Update: ", error);
    throw error;
  }
};

/**
 * Menghapus item dari keranjang.
 *
 * @param {string} itemId - UUID dari item di keranjang.
 */

export const removeItemFromCart = async (itemId: string) => {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from("cart_items").delete().eq("id", itemId);

    if (error) throw new Error("Gagal menghapus item.");

    revalidatePath("/cart");
    revalidatePath("/", "layout");
    
  } catch (error) {
    console.error("[Cart Error] Delete", error);
    throw error;
  }
};
