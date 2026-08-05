import { createFileRoute, redirect } from "@tanstack/react-router"
import { useCustomerAuthStore } from "@/stores/customer-auth-store"

export const Route = createFileRoute("/_public/_auth")({
  beforeLoad: () => {
    if (!useCustomerAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/login" })
    }
  },
})