import { create } from "zustand"
import type { Customer } from "@/types"

type CustomerAuthState = {
  token: string | null
  customer: Customer | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (token: string, customer: Customer) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useCustomerAuthStore = create<CustomerAuthState>((set) => ({
  token: null,
  customer: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: (token, customer) => {
    set({
      token,
      customer,
      isAuthenticated: true,
      error: null,
    })
  },

  logout: () => {
    set({
      token: null,
      customer: null,
      isAuthenticated: false,
      error: null,
    })
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))

export default useCustomerAuthStore
