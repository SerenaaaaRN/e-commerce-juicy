import { create } from "zustand";
import type { Address } from "./customerAuthStore";
import type { CartItem } from "./cartStore";
import { toast } from "sonner";
import { customerApi } from "@/lib/api";

export type OrderItem = {
  product_name: string;
  product_slug: string;
  variant_size: "XS" | "S" | "M" | "L";
  variant_color: string;
  variant_color_hex: string;
  image_url: string;
  quantity: number;
  unit_price: number;
};

export type Order = {
  id: string;
  order_number: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered";
  payment_status: "paid" | "unpaid";
  subtotal: number;
  shipping_fee: number;
  total: number;
  shipped_at: string | null;
  delivered_at: string | null;
  address: Address;
  items: OrderItem[];
  notes?: string;
  payment_method: string;
  created_at: string;
  item_count?: number;
};

type OrderState = {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;

  fetchOrders: () => Promise<void>;
  fetchOrderDetail: (orderNumber: string) => Promise<void>;
  placeOrder: (items: CartItem[], address: Address, notes?: string, paymentMethod?: string) => Promise<string | null>;
  getOrder: (orderNumber: string) => Order | undefined;
};

const mapApiOrder = (apiOrder: any): Order => ({
  id: apiOrder.id,
  order_number: apiOrder.order_number,
  status: (apiOrder.status || "pending") as Order["status"],
  payment_status: (apiOrder.payment_status || "unpaid") as Order["payment_status"],
  subtotal: apiOrder.subtotal || 0,
  shipping_fee: apiOrder.shipping_fee || 0,
  total: apiOrder.total || 0,
  shipped_at: apiOrder.shipped_at || null,
  delivered_at: apiOrder.delivered_at || null,
  address: {
    id: "",
    label: "",
    recipient_name: apiOrder.address?.recipient_name || "",
    phone: apiOrder.address?.phone || "",
    address_line: apiOrder.address?.address_line || "",
    city: apiOrder.address?.city || "",
    province: apiOrder.address?.province || "",
    postal_code: apiOrder.address?.postal_code || "",
    is_default: false,
  },
  items: (apiOrder.items || []).map((i: any) => ({
    product_name: i.product_name,
    product_slug: i.product_slug || "",
    variant_size: (i.variant_size || "S") as OrderItem["variant_size"],
    variant_color: i.variant_color || "",
    variant_color_hex: i.variant_color_hex || "",
    image_url: i.image_url || "",
    quantity: i.quantity,
    unit_price: i.unit_price,
  })),
  notes: apiOrder.notes,
  payment_method: apiOrder.payment_method || "",
  created_at: apiOrder.created_at || "",
  item_count: apiOrder.item_count || (apiOrder.items ? apiOrder.items.length : 0),
});

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,

  fetchOrders: async () => {
    set({ loading: true });
    try {
      const result = await customerApi.listOrders();
      set({ orders: result.orders.map(mapApiOrder), loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchOrderDetail: async (orderNumber) => {
    set({ loading: true });
    try {
      const detail = await customerApi.getOrderDetail(orderNumber);
      set({ currentOrder: mapApiOrder(detail), loading: false });
    } catch {
      set({ loading: false });
    }
  },

  placeOrder: async (items, address, notes?, paymentMethod = "cod") => {
    if (items.length === 0) {
      toast.error("Cart is empty.");
      return null;
    }
    try {
      const result = await customerApi.checkout({
        address_id: address.id,
        notes: notes || null,
        payment_method: paymentMethod,
      });
      await get().fetchOrders();
      toast.success("Order placed successfully.");
      return result.order_number;
    } catch {
      toast.error("Failed to place order. Please try again.");
      return null;
    }
  },

  getOrder: (orderNumber) => {
    return get().orders.find((ord) => ord.order_number === orderNumber);
  },
}));
