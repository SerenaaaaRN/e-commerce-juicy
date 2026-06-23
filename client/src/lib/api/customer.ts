import type { ApiResponse, Customer } from "@/types"
import { customerClient } from "./customerClient"

type LoginPayload = {
  email: string
  password: string
}

type RegisterPayload = {
  email: string
  password: string
  full_name: string
  phone?: string
}

type ProfileUpdatePayload = {
  full_name: string
  phone?: string
}

type ChangePasswordPayload = {
  current_password: string
  new_password: string
}

export const customerApi = {
  // Submit customer credentials for login
  login: async (payload: LoginPayload): Promise<ApiResponse<{ token: string; customer: Customer }>> => {
    const response = await customerClient.post<ApiResponse<{ token: string; customer: Customer }>>(
      "/customers/login",
      payload
    )
    return response.data
  },

  // Register a new customer account
  register: async (payload: RegisterPayload): Promise<ApiResponse<Customer>> => {
    const response = await customerClient.post<ApiResponse<Customer>>("/customers/register", payload)
    return response.data
  },

  // Get active customer details
  getProfile: async (): Promise<ApiResponse<Customer>> => {
    const response = await customerClient.get<ApiResponse<Customer>>("/customers/profile")
    return response.data
  },

  // Update customer name/phone
  updateProfile: async (payload: ProfileUpdatePayload): Promise<ApiResponse<Customer>> => {
    const response = await customerClient.put<ApiResponse<Customer>>("/customers/profile", payload)
    return response.data
  },

  // Change password securely
  changePassword: async (payload: ChangePasswordPayload): Promise<ApiResponse<null>> => {
    const response = await customerClient.put<ApiResponse<null>>("/customers/profile/password", payload)
    return response.data
  },
}

export default customerApi
