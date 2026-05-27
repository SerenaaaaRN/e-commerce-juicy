import { Navigate, Outlet } from "react-router-dom"
import { ROUTES } from "@/constants/routes"
import { useCustomerAuthStore } from "@/stores/customerAuthStore"

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
