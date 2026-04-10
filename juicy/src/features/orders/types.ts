import type { OrderStatus } from "@/types"

export type OrderTimelineStep = {
  label: string
  description: string
  key: OrderStatus
}

export type OrderStatusDisplay = {
  label: string
  colorClass: string
}
