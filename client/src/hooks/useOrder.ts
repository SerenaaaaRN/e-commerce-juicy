import { useCallback, useMemo } from "react"
import { useOrderStore } from "@/stores/orderStore"
import { ORDER_STATUS } from "@/constants/orderStatus"
import type { OrderStatus } from "@/types"

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
  const order = useOrderStore((s) => s.currentOrder)
  const loading = useOrderStore((s) => s.loading)
  const error = useOrderStore((s) => s.error)
  const fetchByOrderNumber = useOrderStore((s) => s.fetchByOrderNumber)

  const fetchOrderDetail = useCallback(
    async (orderNumber: string) => {
      await fetchByOrderNumber(orderNumber)
    },
    [fetchByOrderNumber]
  )

  return useMemo(
    () => ({ order, loading: loading || false, error, fetchOrderDetail, getStatusColor }),
    [order, loading, error, fetchOrderDetail]
  )
}

export default useOrder
