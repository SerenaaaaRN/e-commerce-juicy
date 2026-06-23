import type { ApiResponse, Cart } from "@/types"
import { customerClient } from "./customerClient"

export type AddCartItemPayload = {
  variant_id: string
  quantity: number
}

export type UpdateCartItemQtyPayload = {
  quantity: number
}

export const cartApi = {
  getCart: async (): Promise<ApiResponse<Cart>> => {
    const response = await customerClient.get<ApiResponse<Cart>>("/cart")
    return response.data
  },

  addItem: async (payload: AddCartItemPayload): Promise<ApiResponse<null>> => {
    const response = await customerClient.post<ApiResponse<null>>("/cart/items", payload)
    return response.data
  },

  updateQuantity: async (itemId: string, payload: UpdateCartItemQtyPayload): Promise<ApiResponse<null>> => {
    const response = await customerClient.put<ApiResponse<null>>(`/cart/items/${itemId}`, payload)
    return response.data
  },

  removeItem: async (itemId: string): Promise<ApiResponse<null>> => {
    const response = await customerClient.delete<ApiResponse<null>>(`/cart/items/${itemId}`)
    return response.data
  },

  clearCart: async (): Promise<ApiResponse<null>> => {
    const response = await customerClient.delete<ApiResponse<null>>("/cart")
    return response.data
  },
}

export default cartApi
