import { useState, useCallback } from "react"
import { ordersApi } from "@/lib/api/orders"
import { ORDER_STATUS } from "@/constants/orderStatus"
import type { OrderDetail, OrderStatus } from "@/types"

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case ORDER_STATUS.PENDING:
      return "bg-amber-500/10 text-amber-500 border-amber-500/20"
    case ORDER_STATUS.CONFIRMED:
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    case ORDER_STATUS.PROCESSING:
      return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
    case ORDER_STATUS.SHIPPED:
      return "bg-purple-500/10 text-purple-500 border-purple-500/20"
    case ORDER_STATUS.DELIVERED:
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export const useOrder = () => {
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrderDetail = useCallback(async (orderNumber: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await ordersApi.getOrderDetail(orderNumber)
      if (res.success && res.data) {
        setOrder(res.data)
      } else {
        setError(res.message || "Failed to load order details.")
      }
    } catch {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    order,
    loading,
    error,
    fetchOrderDetail,
    getStatusColor,
  }
}

export default useOrder
