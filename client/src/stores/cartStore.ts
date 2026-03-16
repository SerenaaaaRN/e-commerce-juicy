import { create } from "zustand";
import type { Product, ProductVariant } from "@/features/shop/types/shop.types";
import { toast } from "sonner";

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
  addItem: (product: Product, variant: ProductVariant, quantity: number) => boolean;
  updateQuantity: (itemId: string, quantity: number, maxStock: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getShippingFee: () => number;
  getTotal: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product: Product, variant: ProductVariant, quantity: number) => {
    const { items } = get();
    const existingItem = items.find((item) => item.variant_id === variant.id);
    const currentQtyInCart = existingItem ? existingItem.quantity : 0;
    const targetQty = currentQtyInCart + quantity;

    if (targetQty > variant.stock) {
      toast.error(`Cannot add. Only ${variant.stock} item(s) available in stock.`);
      return false;
    }

    if (existingItem) {
      const updatedItems = items.map((item) =>
        item.variant_id === variant.id
          ? {
              ...item,
              quantity: targetQty,
              subtotal: targetQty * item.unit_price,
            }
          : item
      );
      set({ items: updatedItems });
    } else {
      const newItem: CartItem = {
        id: `cart-item-${Math.random().toString(36).substring(2, 9)}`,
        variant_id: variant.id,
        product_id: product.id,
        product_name: product.name,
        product_slug: product.slug,
        variant_size: variant.size,
        variant_color: variant.color,
        variant_color_hex: variant.color_hex,
        image_url: product.primary_image,
        unit_price: product.price,
        quantity,
        subtotal: quantity * product.price,
      };
      set({ items: [...items, newItem] });
    }

    toast.success(`${product.name} (${variant.size} / ${variant.color}) added to cart.`);
    return true;
  },

  updateQuantity: (itemId: string, quantity: number, maxStock: number) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }

    if (quantity > maxStock) {
      toast.error(`Only ${maxStock} items available in stock.`);
      return;
    }

    const { items } = get();
    const updatedItems = items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            quantity,
            subtotal: quantity * item.unit_price,
          }
        : item
    );
    set({ items: updatedItems });
  },

  removeItem: (itemId: string) => {
    const { items } = get();
    const itemToRemove = items.find((i) => i.id === itemId);
    set({ items: items.filter((item) => item.id !== itemId) });
    if (itemToRemove) {
      toast.info(`${itemToRemove.product_name} removed from cart.`);
    }
  },

  clearCart: () => {
    set({ items: [] });
  },

  getSubtotal: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  },

  getShippingFee: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    // Free shipping above 2,000,000 IDR, else flat 25,000 IDR
    return subtotal >= 2000000 ? 0 : 25000;
  },

  getTotal: () => {
    return get().getSubtotal() + get().getShippingFee();
  },
}));
