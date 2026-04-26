import { customerClient } from "./customerClient"
import type { ApiResponse, Address, OrderDetail, Order } from "@/types"

type CheckoutPayload = {
  address_id: string
  notes?: string
  payment_method: string
}

type AddressPayload = Omit<Address, "id" | "customer_id" | "is_default">

export const ordersApi = {
  // Get all saved customer addresses
  getAddresses: async (): Promise<ApiResponse<Address[]>> => {
    const response = await customerClient.get<ApiResponse<Address[]>>("/addresses")
    return response.data
  },

  // Save a new address
  createAddress: async (payload: AddressPayload): Promise<ApiResponse<Address>> => {
    const response = await customerClient.post<ApiResponse<Address>>("/addresses", payload)
    return response.data
  },

  // Update an existing address
  updateAddress: async (id: string, payload: AddressPayload): Promise<ApiResponse<Address>> => {
    const response = await customerClient.put<ApiResponse<Address>>(`/addresses/${id}`, payload)
    return response.data
  },

  // Submit checkout order
  checkout: async (payload: CheckoutPayload): Promise<ApiResponse<{ order_number: string }>> => {
    const response = await customerClient.post<ApiResponse<{ order_number: string }>>("/orders/checkout", payload)
    return response.data
  },

  // Retrieve customer order history
  getCustomerOrders: async (): Promise<ApiResponse<Order[]>> => {
    const response = await customerClient.get<ApiResponse<Order[]>>("/orders")
    return response.data
  },

  // Retrieve single order details
  getOrderDetail: async (orderNumber: string): Promise<ApiResponse<OrderDetail>> => {
    const response = await customerClient.get<ApiResponse<OrderDetail>>(`/orders/${orderNumber}`)
    return response.data
  },

  // Delete a saved address
  deleteAddress: async (id: string): Promise<ApiResponse<null>> => {
    const response = await customerClient.delete<ApiResponse<null>>(`/addresses/${id}`)
    return response.data
  },

  // Mark an address as the default option
  setDefaultAddress: async (id: string): Promise<ApiResponse<null>> => {
    const response = await customerClient.put<ApiResponse<null>>(`/addresses/${id}/default`)
    return response.data
  },

  // Submit a product review
  submitReview: async (payload: {
    product_id: string
    order_id: string
    rating: number
    body?: string
  }): Promise<ApiResponse<null>> => {
    const response = await customerClient.post<ApiResponse<null>>("/reviews", payload)
    return response.data
  },
}

export default ordersApi
