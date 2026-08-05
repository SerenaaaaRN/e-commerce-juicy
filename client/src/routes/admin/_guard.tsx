import { AdminLayout } from "@/components/layout/AdminLayout"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { useAdminAuthStore } from "@/stores/admin-auth-store"

export const Route = createFileRoute("/admin/_guard")({
  beforeLoad: () => {
    if (!useAdminAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/admin/login" })
    }
  },
  component: AdminLayout,
})