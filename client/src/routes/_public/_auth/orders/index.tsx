import { OrderHistoryPage } from "@/features/orders/OrderHistoryPage"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_public/_auth/orders/")({
  component: OrderHistoryPage,
})