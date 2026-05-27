import { ORDER_STATUS, ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/constants/orderStatus"

export const getOrderStatusLabel = (status: string) =>
  ORDER_STATUS_LABELS[status.toLowerCase()] ?? status

export const getOrderStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case ORDER_STATUS.PENDING:
      return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20"
    case ORDER_STATUS.CONFIRMED:
      return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20"
    case ORDER_STATUS.PROCESSING:
      return "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
    case ORDER_STATUS.SHIPPED:
      return "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20"
    case ORDER_STATUS.DELIVERED:
      return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export const getPaymentStatusLabel = (status: string) =>
  PAYMENT_STATUS_LABELS[status.toLowerCase()] ?? status
