import { create } from "zustand"
import { wishlistApi, type WishlistItem } from "@/lib/api/wishlist"

type WishlistState = {
  items: WishlistItem[]
  loading: boolean
  wishlistIds: Set<string>
  fetchWishlist: () => Promise<void>
  addItem: (variantId: string) => Promise<boolean>
  removeItem: (variantId: string) => Promise<boolean>
  isInWishlist: (variantId: string) => boolean
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  loading: false,
  wishlistIds: new Set(),

  fetchWishlist: async () => {
    set({ loading: true })
    try {
      const res = await wishlistApi.getWishlist()
      if (res.success && res.data) {
        set({
          items: res.data,
          wishlistIds: new Set(res.data.map((i) => i.variant_id)),
        })
      }
    } catch {
      // silent
    } finally {
      set({ loading: false })
    }
  },

  addItem: async (variantId: string) => {
    try {
      const res = await wishlistApi.addItem(variantId)
      if (res.success) {
        set((state) => {
          const next = new Set(state.wishlistIds)
          next.add(variantId)
          return { wishlistIds: next }
        })
        get().fetchWishlist()
        return true
      }
    } catch {
      // silent
    }
    return false
  },

  removeItem: async (variantId: string) => {
    try {
      const res = await wishlistApi.removeItem(variantId)
      if (res.success) {
        set((state) => {
          const next = new Set(state.wishlistIds)
          next.delete(variantId)
          return { wishlistIds: next }
        })
        get().fetchWishlist()
        return true
      }
    } catch {
      // silent
    }
    return false
  },

  isInWishlist: (variantId: string) => {
    return get().wishlistIds.has(variantId)
  },
}))
