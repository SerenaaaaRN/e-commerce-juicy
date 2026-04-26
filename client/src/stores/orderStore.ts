import { create } from "zustand"
import { ordersApi } from "@/lib/api/orders"
import type { Order, OrderDetail } from "@/types"

type OrderState = {
  orders: Order[]
  currentOrder: OrderDetail | null
  loading: boolean
  error: string | null
  fetchOrders: () => Promise<void>
  fetchByOrderNumber: (orderNumber: string) => Promise<void>
  placeOrder: (payload: { address_id: string; payment_method: "cod"; notes?: string }) => Promise<{ success: boolean; data?: unknown; message?: string }>
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null })
    try {
      const res = await ordersApi.getCustomerOrders()
      if (res.success && res.data) {
        set({ orders: res.data })
      } else {
        set({ error: res.message || "Failed to load orders." })
      }
    } catch {
      set({ error: "Failed to establish API connection." })
    } finally {
      set({ loading: false })
    }
  },

  fetchByOrderNumber: async (orderNumber: string) => {
    set({ loading: true, error: null })
    try {
      const res = await ordersApi.getOrderDetail(orderNumber)
      if (res.success && res.data) {
        set({ currentOrder: res.data })
      } else {
        set({ error: res.message || "Failed to load order details." })
      }
    } catch {
      set({ error: "Failed to establish API connection." })
    } finally {
      set({ loading: false })
    }
  },

  placeOrder: async (payload) => {
    set({ loading: true, error: null })
    try {
      const res = await ordersApi.checkout({
        address_id: payload.address_id,
        notes: payload.notes,
        payment_method: payload.payment_method,
      })
      return res
    } catch {
      return { success: false, message: "Network connection failure." }
    } finally {
      set({ loading: false })
    }
  },
}))

export default useOrderStore
