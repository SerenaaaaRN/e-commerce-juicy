import { CartPage } from "@/features/cart/CartPage"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_public/_auth/cart")({
  component: CartPage,
})