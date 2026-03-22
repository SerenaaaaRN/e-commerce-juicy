import { create } from "zustand";
import type { Address } from "./customerAuthStore";
import type { CartItem } from "./cartStore";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { toast } from "sonner";
import { customerApi, withFallback } from "@/lib/api";
import type { ProductVariant } from "@/features/shop/shop.types";

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
};

type OrderState = {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;

  fetchOrders: () => Promise<void>;
  fetchOrderDetail: (orderNumber: string) => Promise<void>;
  placeOrder: (items: CartItem[], address: Address, notes?: string, paymentMethod?: string) => Promise<string | null>;
  getOrder: (orderNumber: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
};

const DEFAULT_MOCK_ORDERS: Order[] = [
  {
    id: "ord-1",
    order_number: "JUICY-20260520-X8F2B9",
    status: "delivered",
    payment_status: "paid",
    subtotal: 1250000,
    shipping_fee: 25000,
    total: 1275000,
    shipped_at: "2026-05-21T10:00:00Z",
    delivered_at: "2026-05-23T14:30:00Z",
    payment_method: "cod",
    notes: "Leave with the receptionist",
    address: {
      id: "addr-1",
      label: "Home",
      recipient_name: "Jane Doe",
      phone: "+62812345678",
      address_line: "Jl. Sudirman No. 24, Apartment 8A",
      city: "Jakarta Selatan",
      province: "DKI Jakarta",
      postal_code: "12190",
      is_default: true,
    },
    items: [
      {
        product_name: "La Robe Bahia",
        product_slug: "la-robe-bahia",
        variant_size: "S",
        variant_color: "Ivory",
        variant_color_hex: "#FAF5E9",
        image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
        quantity: 1,
        unit_price: 1250000,
      },
    ],
    created_at: "2026-05-20T08:15:22Z",
  },
];

const mapApiOrderToStore = (apiOrder: any, address?: Address): Order => ({
  id: apiOrder.id,
  order_number: apiOrder.order_number,
  status: (apiOrder.status || "pending") as Order["status"],
  payment_status: (apiOrder.payment_status || "unpaid") as Order["payment_status"],
  subtotal: apiOrder.subtotal || 0,
  shipping_fee: apiOrder.shipping_fee || 0,
  total: apiOrder.total || 0,
  shipped_at: apiOrder.shipped_at || null,
  delivered_at: apiOrder.delivered_at || null,
  address: address || {
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
});

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: DEFAULT_MOCK_ORDERS,
  currentOrder: null,
  loading: false,

  fetchOrders: async () => {
    set({ loading: true });
    try {
      const result = await withFallback(
        () => customerApi.listOrders(),
        () => ({
          orders: get().orders.map((o) => ({
            id: o.id,
            order_number: o.order_number,
            status: o.status,
            total: o.total,
            item_count: o.items.length,
            created_at: o.created_at,
          })),
          meta: { total: get().orders.length, page: 1, per_page: 10 },
        }),
      );
      set({
        orders: result.orders.map((o: any) => mapApiOrderToStore(o)),
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  fetchOrderDetail: async (orderNumber: string) => {
    set({ loading: true });
    try {
      const detail = await withFallback(
        () => customerApi.getOrderDetail(orderNumber),
        () => {
          const local = get().orders.find((o) => o.order_number === orderNumber);
          if (!local) throw new Error("Not found");
          return {
            id: local.id,
            order_number: local.order_number,
            status: local.status,
            payment_status: local.payment_status,
            subtotal: local.subtotal,
            shipping_fee: local.shipping_fee,
            total: local.total,
            shipped_at: local.shipped_at,
            delivered_at: local.delivered_at,
            address: {
              recipient_name: local.address.recipient_name,
              phone: local.address.phone,
              address_line: local.address.address_line,
              city: local.address.city,
              province: local.address.province,
              postal_code: local.address.postal_code,
            },
            items: local.items.map((i) => ({
              product_name: i.product_name,
              variant_size: i.variant_size,
              variant_color: i.variant_color,
              image_url: i.image_url,
              quantity: i.quantity,
              unit_price: i.unit_price,
            })),
            created_at: local.created_at,
          };
        },
      );
      set({ currentOrder: mapApiOrderToStore(detail), loading: false });
    } catch {
      set({ loading: false });
    }
  },

  placeOrder: async (items: CartItem[], address: Address, notes?: string, paymentMethod = "cod") => {
    if (items.length === 0) {
      toast.error("Cart is empty.");
      return null;
    }

    try {
      const result = await withFallback(
        async () => {
          const checkoutResult = await customerApi.checkout({
            address_id: address.id,
            notes: notes || null,
            payment_method: paymentMethod,
          });
          await get().fetchOrders();
          return checkoutResult.order_number;
        },
        () => {
          for (const item of items) {
            const product = MOCK_PRODUCTS.find((p) => p.id === item.product_id);
            if (!product) {
              toast.error(`Product ${item.product_name} not found.`);
              return null;
            }
            const variant = product.variants.find((v: ProductVariant) => v.id === item.variant_id);
            if (!variant) {
              toast.error(`Variant for ${item.product_name} not found.`);
              return null;
            }
            if (variant.stock < item.quantity) {
              toast.error(`Insufficient stock for ${item.product_name}.`);
              return null;
            }
          }

          for (const item of items) {
            const product = MOCK_PRODUCTS.find((p) => p.id === item.product_id);
            const variant = product!.variants.find((v: ProductVariant) => v.id === item.variant_id);
            variant!.stock -= item.quantity;
          }

          const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
          const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
          const orderNumber = `JUICY-${dateStr}-${randomHex}`;
          const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
          const shippingFee = subtotal >= 2000000 ? 0 : 25000;
          const total = subtotal + shippingFee;

          const newOrder: Order = {
            id: `ord-${Math.random().toString(36).substring(2, 9)}`,
            order_number: orderNumber,
            status: "pending",
            payment_status: "unpaid",
            subtotal,
            shipping_fee: shippingFee,
            total,
            shipped_at: null,
            delivered_at: null,
            address,
            notes,
            payment_method: paymentMethod,
            items: items.map((item) => ({
              product_name: item.product_name,
              product_slug: item.product_slug,
              variant_size: item.variant_size,
              variant_color: item.variant_color,
              variant_color_hex: item.variant_color_hex,
              image_url: item.image_url,
              quantity: item.quantity,
              unit_price: item.unit_price,
            })),
            created_at: new Date().toISOString(),
          };

          set({ orders: [newOrder, ...get().orders] });
          return orderNumber;
        },
      );

      if (result) {
        toast.success("Order placed successfully.");
        return result;
      }
      return null;
    } catch {
      toast.error("Failed to place order. Please try again.");
      return null;
    }
  },

  getOrder: (orderNumber: string) => {
    return get().orders.find((ord) => ord.order_number === orderNumber);
  },

  updateOrderStatus: (orderId: string, status: Order["status"]) => {
    const { orders } = get();
    const updated = orders.map((ord) => {
      if (ord.id === orderId) {
        const shipped_at = status === "shipped" || status === "delivered" ? new Date().toISOString() : ord.shipped_at;
        const delivered_at = status === "delivered" ? new Date().toISOString() : ord.delivered_at;
        const payment_status = status === "delivered" ? "paid" as const : ord.payment_status;

        return {
          ...ord,
          status,
          payment_status,
          shipped_at,
          delivered_at,
        };
      }
      return ord;
    });
    set({ orders: updated });
    toast.info(`Order status updated to: ${status.toUpperCase()}`);
  },
}));
