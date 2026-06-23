import { useCustomerAuthStore } from "@/stores/customer-auth-store"
import { useMemo } from "react"

export const useAuth = () => {
  const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated)
  const customer = useCustomerAuthStore((s) => s.customer)
  const logout = useCustomerAuthStore((s) => s.logout)

  return useMemo(() => ({ isLoggedIn: isAuthenticated, customer, logout }), [isAuthenticated, customer, logout])
}

export default useAuth
