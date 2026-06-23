import type { ApiResponse } from "@/types"
import { customerClient } from "./customerClient"

export type WishlistItem = {
  id: string
  variant_id: string
  product_id: string
  product_name: string
  product_slug: string
  variant_size: string
  variant_color: string
  image_url: string
  price: number
  additional_price: number
  stock: number
  created_at: string
}

export const wishlistApi = {
  getWishlist: async (): Promise<ApiResponse<WishlistItem[]>> => {
    const response = await customerClient.get<ApiResponse<WishlistItem[]>>("/wishlist")
    return response.data
  },

  checkWishlist: async (variantId: string): Promise<ApiResponse<{ in_wishlist: boolean }>> => {
    const response = await customerClient.get<ApiResponse<{ in_wishlist: boolean }>>(`/wishlist/check/${variantId}`)
    return response.data
  },

  addItem: async (variantId: string): Promise<ApiResponse<null>> => {
    const response = await customerClient.post<ApiResponse<null>>("/wishlist/items", { variant_id: variantId })
    return response.data
  },

  removeItem: async (variantId: string): Promise<ApiResponse<null>> => {
    const response = await customerClient.delete<ApiResponse<null>>(`/wishlist/items/${variantId}`)
    return response.data
  },
}
