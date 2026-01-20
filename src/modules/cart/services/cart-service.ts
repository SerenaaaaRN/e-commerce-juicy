import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

/**
 * Service layer untuk fitur Cart.
 * Seluruh akses Supabase terkait keranjang ditempatkan di sini.
 */
export const cartService = {
  /**
   * Mengambil data keranjang berdasarkan cookie `cartId`.
   */
  async getCart() {
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
  },

  /**
   * Memastikan cartId tersedia (buat baru jika belum ada) dan simpan ke cookie.
   */
  async getOrCreateCartId(): Promise<string> {
    const cookieStore = await cookies();
    let cartId = cookieStore.get("cartId")?.value;

    const supabase = await createClient();

    if (!cartId) {
      const { data: newCart, error: createError } = await supabase.from("carts").insert({}).select().single();

      if (createError || !newCart) {
        throw new Error("Gagal membuat keranjang.");
      }

      cartId = newCart.id as string;
      cookieStore.set("cartId", cartId, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return cartId as string;
  },

  /**
   * Menambahkan produk ke dalam keranjang (atau increment quantity jika sudah ada).
   */
  async addItem(productId: string) {
    const supabase = await createClient();
    const cartId = await this.getOrCreateCartId();

    // cek produk ini sudah ada di dalam keranjang tersebut atau belum
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
  },

  /**
   * Mengubah jumlah barang di keranjang.
   */
  async updateItemQuantity(itemId: string, quantity: number) {
    if (quantity < 1) return;

    const supabase = await createClient();
    const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", itemId);

    if (error) {
      console.error("Cart Error Update: ", error);
      throw new Error("Gagal update quantity");
    }
  },

  /**
   * Menghapus item dari keranjang.
   */
  async removeItem(itemId: string) {
    const supabase = await createClient();

    const { error } = await supabase.from("cart_items").delete().eq("id", itemId);

    if (error) {
      console.error("[Cart Error] Delete", error);
      throw new Error("Gagal menghapus item.");
    }
  },
};
