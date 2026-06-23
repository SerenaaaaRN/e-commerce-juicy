import { ROUTES } from "@/constants/paths"
import { useCustomerAuthStore } from "@/stores/customer-auth-store"
import { Navigate, Outlet } from "react-router-dom"

type ProtectedRouteProps = {
  children?: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useCustomerAuthStore()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />
  }

  return children ? <>{children}</> : <Outlet />
}

export default ProtectedRoute
