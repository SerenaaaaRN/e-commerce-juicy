import { create } from "zustand"
import { productApi } from "@/lib/api/products"
import { ordersApi } from "@/lib/api/orders"
import type { Review } from "@/types"

type ReviewState = {
  reviews: Review[]
  loading: boolean
  error: string | null
  fetchReviews: (slug: string) => Promise<void>
  submitReview: (payload: { product_id: string; order_id: string; rating: number; body?: string }) => Promise<{ success: boolean; message?: string }>
}

export const useReviewStore = create<ReviewState>((set) => ({
  reviews: [],
  loading: false,
  error: null,

  fetchReviews: async (slug: string) => {
    set({ loading: true, error: null })
    try {
      const res = await productApi.getProductReviews(slug)
      if (res.success && res.data) {
        set({ reviews: res.data })
      } else {
        set({ error: "Failed to load reviews." })
      }
    } catch {
      set({ error: "Failed to establish API connection." })
    } finally {
      set({ loading: false })
    }
  },

  submitReview: async (payload) => {
    set({ loading: true, error: null })
    try {
      const res = await ordersApi.submitReview(payload)
      return res
    } catch {
      return { success: false, message: "Network connection failure." }
    } finally {
      set({ loading: false })
    }
  },
}))

export default useReviewStore
