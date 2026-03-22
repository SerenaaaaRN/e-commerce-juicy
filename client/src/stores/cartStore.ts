import { create } from "zustand";
import type { Product, ProductVariant } from "@/features/shop/shop.types";
import { toast } from "sonner";
import { customerApi, withFallback } from "@/lib/api";

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

const mapApiCartItem = (item: CartItem): CartItem => ({
  ...item,
  variant_size: item.variant_size as CartItem["variant_size"],
});

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,

  fetchCart: async () => {
    if (!localStorage.getItem("juicy_admin_token") && !localStorage.getItem("mock-customer-token")) return;
    set({ loading: true });
    try {
      const cart = await withFallback(
        () => customerApi.getCart(),
        () => {
          const { items } = get();
          return { items: items as any, total: items.reduce((s, i) => s + i.subtotal, 0) };
        },
      );
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

  addItem: async (product: Product, variant: ProductVariant, quantity: number) => {
    const { items } = get();
    const existingItem = items.find((item) => item.variant_id === variant.id);
    const currentQtyInCart = existingItem ? existingItem.quantity : 0;
    const targetQty = currentQtyInCart + quantity;

    if (targetQty > variant.stock) {
      toast.error(`Cannot add. Only ${variant.stock} item(s) available in stock.`);
      return false;
    }

    const success = await withFallback(
      async () => {
        await customerApi.addCartItem(variant.id, targetQty);
        await get().fetchCart();
        return true;
      },
      async () => {
        if (existingItem) {
          const updatedItems = items.map((item) =>
            item.variant_id === variant.id
              ? { ...item, quantity: targetQty, subtotal: targetQty * item.unit_price }
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
        return true;
      },
    );

    if (success) {
      toast.success(`${product.name} (${variant.size} / ${variant.color}) added to cart.`);
    }
    return success;
  },

  updateQuantity: async (itemId: string, quantity: number, maxStock: number) => {
    if (quantity <= 0) {
      await get().removeItem(itemId);
      return;
    }

    if (quantity > maxStock) {
      toast.error(`Only ${maxStock} items available in stock.`);
      return;
    }

    await withFallback(
      async () => {
        await customerApi.updateCartItem(itemId, quantity);
        await get().fetchCart();
      },
      () => {
        const { items } = get();
        set({
          items: items.map((item) =>
            item.id === itemId
              ? { ...item, quantity, subtotal: quantity * item.unit_price }
              : item
          ),
        });
      },
    );
  },

  removeItem: async (itemId: string) => {
    const { items } = get();
    const itemToRemove = items.find((i) => i.id === itemId);

    await withFallback(
      async () => {
        await customerApi.removeCartItem(itemId);
        await get().fetchCart();
      },
      () => {
        set({ items: items.filter((item) => item.id !== itemId) });
      },
    );

    if (itemToRemove) {
      toast.info(`${itemToRemove.product_name} removed from cart.`);
    }
  },

  clearCart: async () => {
    await withFallback(
      async () => {
        await customerApi.clearCart();
        set({ items: [] });
      },
      () => {
        set({ items: [] });
      },
    );
  },

  getSubtotal: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.subtotal, 0);
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
