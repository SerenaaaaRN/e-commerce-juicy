import { useMemo } from "react"
import { useCustomerAuthStore } from "@/stores/customerAuthStore"

export const useAuth = () => {
  const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated)
  const customer = useCustomerAuthStore((s) => s.customer)
  const logout = useCustomerAuthStore((s) => s.logout)

  return useMemo(
    () => ({ isLoggedIn: isAuthenticated, customer, logout }),
    [isAuthenticated, customer, logout]
  )
}

export default useAuth
