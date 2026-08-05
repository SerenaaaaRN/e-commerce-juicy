import { LoginPageAdmin } from "@/features/auth/LoginPageAdmin"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { useAdminAuthStore } from "@/stores/admin-auth-store"

export const Route = createFileRoute("/admin/login")({
  beforeLoad: () => {
    if (useAdminAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/admin/dashboard" })
    }
  },
  component: LoginPageAdmin,
})