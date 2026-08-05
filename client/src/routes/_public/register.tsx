import { RegisterPage } from "@/features/auth/RegisterPage"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { useCustomerAuthStore } from "@/stores/customer-auth-store"

export const Route = createFileRoute("/_public/register")({
  beforeLoad: () => {
    if (useCustomerAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/" })
    }
  },
  component: RegisterPage,
})