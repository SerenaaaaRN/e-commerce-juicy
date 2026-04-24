import { create } from "zustand"
import type { CartItem } from "@/types"
import { cartApi } from "@/lib/api"

type CartState = {
  items: CartItem[]
  isLoading: boolean
  error: string | null
  
  // Computed values
  totalItems: () => number
  totalPrice: () => number

  // Actions
  fetchCart: () => Promise<void>
  addItem: (variantId: string, quantity: number) => Promise<void>
  updateQty: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  totalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0)
  },

  totalPrice: () => {
    return get().items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
  },

  fetchCart: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await cartApi.getCart()
      if (res.success) {
        set({ items: res.data.items || [], isLoading: false })
      } else {
        const errMsg = res.message || "Failed to load cart"
        set({ error: errMsg, isLoading: false })
      }
    } catch (err) {
      set({ error: "Failed to load cart", isLoading: false })
    }
  },

  addItem: async (variantId, quantity) => {
    set({ isLoading: true, error: null })
    try {
      const res = await cartApi.addItem({ variant_id: variantId, quantity })
      if (res.success) {
        const freshCart = await cartApi.getCart()
        if (freshCart.success) {
          set({ items: freshCart.data.items || [], isLoading: false })
        } else {
          set({ isLoading: false })
        }
      } else {
        const errMsg = res.message || "Failed to add item"
        set({ error: errMsg, isLoading: false })
        console.error("addItem failed:", errMsg)
        throw new Error(errMsg)
      }
    } catch (err: any) {
      console.error("addItem error:", err)
      set({ error: err.message || "Failed to add item", isLoading: false })
      throw err
    }
  },

  updateQty: async (itemId, quantity) => {
    set({ isLoading: true, error: null })
    try {
      const res = await cartApi.updateQuantity(itemId, { quantity })
      if (res.success) {
        const freshCart = await cartApi.getCart()
        if (freshCart.success) {
          set({ items: freshCart.data.items || [], isLoading: false })
        } else {
          set({ isLoading: false })
        }
      } else {
        const errMsg = res.message || "Failed to update quantity"
        set({ error: errMsg, isLoading: false })
        console.error("updateQty failed:", errMsg)
        throw new Error(errMsg)
      }
    } catch (err: any) {
      console.error("updateQty error:", err)
      set({ error: err.message || "Failed to update quantity", isLoading: false })
      throw err
    }
  },

  removeItem: async (itemId) => {
    set({ isLoading: true, error: null })
    try {
      const res = await cartApi.removeItem(itemId)
      if (res.success) {
        const freshCart = await cartApi.getCart()
        if (freshCart.success) {
          set({ items: freshCart.data.items || [], isLoading: false })
        } else {
          set({ isLoading: false })
        }
      } else {
        const errMsg = res.message || "Failed to remove item"
        set({ error: errMsg, isLoading: false })
        console.error("removeItem failed:", errMsg)
        throw new Error(errMsg)
      }
    } catch (err: any) {
      console.error("removeItem error:", err)
      set({ error: err.message || "Failed to remove item", isLoading: false })
      throw err
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await cartApi.clearCart()
      if (res.success) {
        set({ items: [], isLoading: false })
      } else {
        const errMsg = res.message || "Failed to clear cart"
        set({ error: errMsg, isLoading: false })
        console.error("clearCart failed:", errMsg)
        throw new Error(errMsg)
      }
    } catch (err: any) {
      console.error("clearCart error:", err)
      set({ error: err.message || "Failed to clear cart", isLoading: false })
      throw err
    }
  },
}))

export default useCartStore
