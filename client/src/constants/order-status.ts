import type { OrderStatus, PaymentStatus } from "@/types"

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending Confirmation",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
}

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  unpaid: "Unpaid",
  paid: "Paid",
  refunded: "Refunded",
}

export const STATUS_BADGE: Record<OrderStatus, { label: string; variant: BadgeVariant }> = {
  pending: { label: "Pending", variant: "secondary" },
  confirmed: { label: "Confirmed", variant: "default" },
  processing: { label: "Processing", variant: "secondary" },
  shipped: { label: "Shipped", variant: "default" },
  delivered: { label: "Delivered", variant: "default" },
  cancelled: { label: "Cancelled", variant: "outline" },
  returned: { label: "Returned", variant: "secondary" },
}

export const PAYMENT_BADGE: Record<PaymentStatus, { label: string; variant: BadgeVariant }> = {
  unpaid: { label: "Unpaid", variant: "destructive" },
  paid: { label: "Paid", variant: "default" },
  refunded: { label: "Refunded", variant: "secondary" },
}

export const ORDER_STEPS: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered"]
export const PAYMENT_STEPS: PaymentStatus[] = ["unpaid", "paid", "refunded"]

export const getOrderStatusLabel = (status: string) => ORDER_STATUS_LABELS[status.toLowerCase()] ?? status
export const getPaymentStatusLabel = (status: string) => PAYMENT_STATUS_LABELS[status.toLowerCase()] ?? status

export const getOrderStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20"
    case "confirmed":
      return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20"
    case "processing":
      return "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
    case "shipped":
      return "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20"
    case "delivered":
      return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}
