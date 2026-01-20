"use server";

import { revalidatePath } from "next/cache";
import { cartService } from "./services/cart-service";

/**
 * Server Actions untuk fitur Cart.
 * Bertanggung jawab pada orchestration (validasi ringan, revalidate, dsb)
 * dan mendelegasikan seluruh akses DB ke `cartService`.
 */

export async function addToCart(productId: string) {
  try {
    await cartService.addItem(productId);
    // Revalidate path agar UI cart terupdate realtime
    revalidatePath("/", "layout");
  } catch (error) {
    console.error("[addToCart] Error:", error);
    throw error;
  }
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  try {
    await cartService.updateItemQuantity(itemId, quantity);
    revalidatePath("/cart");
    revalidatePath("/", "layout");
  } catch (error) {
    console.error("[updateCartItemQuantity] Error:", error);
    throw error;
  }
}

export async function removeCartItem(itemId: string) {
  try {
    await cartService.removeItem(itemId);
    revalidatePath("/cart");
    revalidatePath("/", "layout");
  } catch (error) {
    console.error("[removeCartItem] Error:", error);
    throw error;
  }
}
