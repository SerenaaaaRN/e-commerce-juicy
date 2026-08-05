import { CheckoutPage } from "@/features/checkout/CheckoutPage"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_public/_auth/checkout")({
  component: CheckoutPage,
})