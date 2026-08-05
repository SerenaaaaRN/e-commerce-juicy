import { OrderTrackingPage } from "@/features/orders/OrderTrackingPage"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_public/_auth/orders/$orderNumber")({
  component: OrderTrackingPage,
})