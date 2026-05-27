import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { ROUTES } from "@/constants/routes"
import { useAdminAuthStore } from "@/stores/adminAuthStore"

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
