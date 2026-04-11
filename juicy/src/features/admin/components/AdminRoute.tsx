import React from "react"
import { Navigate } from "react-router-dom"
import { useAdminAuthStore } from "@/stores/adminAuthStore"

type AdminRouteProps = {
  children: React.ReactNode
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}

export default AdminRoute
