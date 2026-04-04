import { create } from "zustand"
import type { CartItem } from "@/types"

type CartState = {
  items: CartItem[]
  isLoading: boolean
  error: string | null
  
  // Computed values
  totalItems: () => number
  totalPrice: () => number

  // Actions
  fetchCart: () => Promise<void>
  addItem: (item: Omit<CartItem, "subtotal">) => Promise<void>
  updateQty: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => void
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
    // Stub or actual call. Since this is Milestone 1 setup, we do a basic fetch or keep local.
    set({ isLoading: true })
    try {
      // Fetch cart from backend if authenticated
      set({ isLoading: false })
    } catch {
      set({ error: "Failed to load cart", isLoading: false })
    }
  },

  addItem: async (item) => {
    set({ isLoading: true })
    try {
      const existing = get().items.find((i) => i.variant_id === item.variant_id)
      let newItems: CartItem[]

      if (existing) {
        newItems = get().items.map((i) =>
          i.variant_id === item.variant_id
            ? { ...i, quantity: i.quantity + item.quantity, subtotal: (i.quantity + item.quantity) * i.unit_price }
            : i
        )
      } else {
        newItems = [...get().items, { ...item, subtotal: item.quantity * item.unit_price }]
      }

      set({ items: newItems, isLoading: false })
    } catch {
      set({ error: "Failed to add item", isLoading: false })
    }
  },

  updateQty: async (itemId, quantity) => {
    set({ items: get().items.map((i) => i.id === itemId ? { ...i, quantity, subtotal: quantity * i.unit_price } : i) })
  },

  removeItem: async (itemId) => {
    set({ items: get().items.filter((i) => i.id !== itemId) })
  },

  clearCart: () => {
    set({ items: [] })
  },
}))

export default useCartStore
