import { useCustomerAuthStore } from "@/stores/customerAuthStore"

export const useAuth = () => {
  const { isAuthenticated, customer, logout } = useCustomerAuthStore()

  return {
    isLoggedIn: isAuthenticated,
    customer,
    logout,
  }
}

export default useAuth
