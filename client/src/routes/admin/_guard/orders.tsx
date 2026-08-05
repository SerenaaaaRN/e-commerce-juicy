import { OrdersPage } from "@/features/admin/OrdersPage"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/admin/_guard/orders")({
  component: OrdersPage,
})