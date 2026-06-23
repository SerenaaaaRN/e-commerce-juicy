import { ROUTES } from "@/constants/paths"
import { useAdminAuthStore } from "@/stores/admin-auth-store"
import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"

type AdminRouteProps = {
  children: ReactNode
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.adminLogin} replace />
  }

  return <>{children}</>
}

export default AdminRoute
