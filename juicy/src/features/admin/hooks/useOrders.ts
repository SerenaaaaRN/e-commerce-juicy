import { useEffect, useState, useTransition, useCallback } from "react"
import { adminApi } from "@/lib/api/admin"
import { toast } from "sonner"
import type { AdminOrder, OrderDetail, OrderStatus, PaymentStatus } from "@/types"

export const useOrders = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const [detailsOpen, setDetailsOpen] = useState(false)
  const [activeOrder, setActiveOrder] = useState<OrderDetail | null>(null)

  const loadOrdersData = useCallback(async (shouldTriggerLoader = false) => {
    if (shouldTriggerLoader) setLoading(true)
    try {
      const res = await adminApi.getOrders()
      if (res.success && res.data) {
        setOrders(res.data)
      }
    } catch {
      // silent fail
    } finally {
      if (shouldTriggerLoader) setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOrdersData(true)
  }, [loadOrdersData])

  const handleViewDetails = useCallback(
    (orderId: string) => {
      setActiveOrder(null)
      setDetailsOpen(true)

      startTransition(async () => {
        try {
          const res = await adminApi.getOrderDetail(orderId)
          if (res.success && res.data) {
            setActiveOrder(res.data)
          }
        } catch {
          // silent fail
        }
      })
    },
    []
  )

  const handleUpdateStatus = useCallback(
    (status: OrderStatus) => {
      if (!activeOrder) return
      startTransition(async () => {
        try {
          const res = await adminApi.updateOrderStatus(activeOrder.id, status)
          if (res.success) {
            toast.success(`Fulfillment status updated to: ${status}`)
            setActiveOrder((prev) => (prev ? { ...prev, status } : null))
            setOrders((curr) =>
              curr.map((o) =>
                o.id === activeOrder.id ? { ...o, status } : o
              )
            )
          } else {
            toast.error(res.message || "Failed to update order status.")
          }
        } catch {
          toast.error("Failed to update status workflow.")
        }
      })
    },
    [activeOrder]
  )

  const handleUpdatePaymentStatus = useCallback(
    (paymentStatus: PaymentStatus) => {
      if (!activeOrder) return
      startTransition(async () => {
        try {
          const res = await adminApi.updateOrderPaymentStatus(activeOrder.id, paymentStatus)
          if (res.success) {
            toast.success(`Payment status marked as: ${paymentStatus}`)
            setActiveOrder((prev) =>
              prev ? { ...prev, payment_status: paymentStatus } : null
            )
            setOrders((curr) =>
              curr.map((o) =>
                o.id === activeOrder.id
                  ? { ...o, payment_status: paymentStatus }
                  : o
              )
            )
          } else {
            toast.error(res.message || "Failed to update payment status.")
          }
        } catch {
          toast.error("Failed to transition payment status.")
        }
      })
    },
    [activeOrder]
  )

  return {
    orders,
    loading,
    isPending,
    detailsOpen,
    setDetailsOpen,
    activeOrder,
    handleViewDetails,
    handleUpdateStatus,
    handleUpdatePaymentStatus,
  }
}
