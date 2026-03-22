import { create } from "zustand";
import type { Product, ProductVariant } from "@/features/shop/shop.types";
import { toast } from "sonner";
import { customerApi } from "@/lib/api";

export type CartItem = {
  id: string;
  variant_id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  variant_size: "XS" | "S" | "M" | "L";
  variant_color: string;
  variant_color_hex: string;
  image_url: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
};

type CartState = {
  items: CartItem[];
  loading: boolean;

  fetchCart: () => Promise<void>;
  addItem: (product: Product, variant: ProductVariant, quantity: number) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number, maxStock: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getSubtotal: () => number;
  getShippingFee: () => number;
  getTotal: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const cart = await customerApi.getCart();
      set({
        items: cart.items.map((i) => ({
          id: i.id,
          variant_id: i.variant_id,
          product_id: "",
          product_name: i.product_name,
          product_slug: "",
          variant_size: i.variant_size as CartItem["variant_size"],
          variant_color: i.variant_color,
          variant_color_hex: "",
          image_url: i.image_url || "",
          unit_price: i.unit_price,
          quantity: i.quantity,
          subtotal: i.subtotal,
        })),
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  addItem: async (product, variant, quantity) => {
    try {
      await customerApi.addCartItem(variant.id, quantity);
      await get().fetchCart();
      toast.success(`${product.name} (${variant.size} / ${variant.color}) added to cart.`);
      return true;
    } catch {
      toast.error("Failed to add item to cart.");
      return false;
    }
  },

  updateQuantity: async (itemId, quantity, maxStock) => {
    if (quantity <= 0) {
      await get().removeItem(itemId);
      return;
    }
    if (quantity > maxStock) {
      toast.error(`Only ${maxStock} items available in stock.`);
      return;
    }
    try {
      await customerApi.updateCartItem(itemId, quantity);
      await get().fetchCart();
    } catch {
      toast.error("Failed to update quantity.");
    }
  },

  removeItem: async (itemId) => {
    try {
      await customerApi.removeCartItem(itemId);
      await get().fetchCart();
    } catch {
      toast.error("Failed to remove item.");
    }
  },

  clearCart: async () => {
    try {
      await customerApi.clearCart();
      set({ items: [] });
    } catch {
      toast.error("Failed to clear cart.");
    }
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.subtotal, 0);
  },

  getShippingFee: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal >= 2000000 ? 0 : 25000;
  },

  getTotal: () => {
    return get().getSubtotal() + get().getShippingFee();
  },
}));
