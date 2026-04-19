export const getOrderStatusLabel = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "Pending Confirmation"
    case "confirmed":
      return "Confirmed"
    case "processing":
      return "Processing"
    case "shipped":
      return "Shipped"
    case "delivered":
      return "Delivered"
    default:
      return status
  }
}

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

export const getPaymentStatusLabel = (status: string) => {
  switch (status.toLowerCase()) {
    case "unpaid":
      return "Unpaid"
    case "paid":
      return "Paid"
    default:
      return status
  }
}
