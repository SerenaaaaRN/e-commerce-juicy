import { LoginPageCust } from "@/features/auth/LoginPageCust"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { useCustomerAuthStore } from "@/stores/customer-auth-store"

export const Route = createFileRoute("/_public/login")({
  beforeLoad: () => {
    if (useCustomerAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/" })
    }
  },
  component: LoginPageCust,
})