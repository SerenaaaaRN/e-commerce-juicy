import { useEffect, useState, useCallback } from "react"
import { adminApi } from "@/lib/api/admin"
import { toast } from "sonner"
import type { AdminOrder, OrderDetail, OrderStatus, PaymentStatus } from "@/types"

export const useOrders = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const [detailsOpen, setDetailsOpen] = useState(false)
  const [activeOrder, setActiveOrder] = useState<OrderDetail | null>(null)
  const [viewLoading, setViewLoading] = useState(false)

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOrdersData(true)
  }, [loadOrdersData])

  const handleViewDetails = useCallback((orderId: string) => {
    setActiveOrder(null)
    setViewLoading(true)
    setDetailsOpen(true)
    adminApi.getOrderDetail(orderId).then((res) => {
      if (res.success && res.data) {
        setActiveOrder(res.data)
      }
    }).catch(() => {
      // silent fail
    }).finally(() => {
      setViewLoading(false)
    })
  }, [])

  const handleUpdateStatus = useCallback(
    (status: OrderStatus) => {
      if (!activeOrder || updating) return
      const orderId = activeOrder.id
      const prevStatus = activeOrder.status
      setActiveOrder((prev) => (prev ? { ...prev, status } : null))
      setOrders((curr) => curr.map((o) => (o.id === orderId ? { ...o, status } : o)))
      setUpdating(true)
      adminApi.updateOrderStatus(orderId, status).then((res) => {
        if (res.success) {
          toast.success(`Fulfillment status updated to: ${status}`)
        } else {
          setActiveOrder((prev) => (prev ? { ...prev, status: prevStatus } : null))
          setOrders((curr) => curr.map((o) => (o.id === orderId ? { ...o, status: prevStatus } : o)))
          toast.error(res.message || "Failed to update order status.")
        }
      }).catch(() => {
        setActiveOrder((prev) => (prev ? { ...prev, status: prevStatus } : null))
        setOrders((curr) => curr.map((o) => (o.id === orderId ? { ...o, status: prevStatus } : o)))
        toast.error("Failed to update status workflow.")
      }).finally(() => {
        setUpdating(false)
      })
    },
    [activeOrder, updating]
  )

  const handleUpdatePaymentStatus = useCallback(
    (paymentStatus: PaymentStatus) => {
      if (!activeOrder || updating) return
      const orderId = activeOrder.id
      const prevPayment = activeOrder.payment_status
      setActiveOrder((prev) => (prev ? { ...prev, payment_status: paymentStatus } : null))
      setOrders((curr) => curr.map((o) => (o.id === orderId ? { ...o, payment_status: paymentStatus } : o)))
      setUpdating(true)
      adminApi.updateOrderPaymentStatus(orderId, paymentStatus).then((res) => {
        if (res.success) {
          toast.success(`Payment status marked as: ${paymentStatus}`)
        } else {
          setActiveOrder((prev) => (prev ? { ...prev, payment_status: prevPayment } : null))
          setOrders((curr) => curr.map((o) => (o.id === orderId ? { ...o, payment_status: prevPayment } : o)))
          toast.error(res.message || "Failed to update payment status.")
        }
      }).catch(() => {
        setActiveOrder((prev) => (prev ? { ...prev, payment_status: prevPayment } : null))
        setOrders((curr) => curr.map((o) => (o.id === orderId ? { ...o, payment_status: prevPayment } : o)))
        toast.error("Failed to transition payment status.")
      }).finally(() => {
        setUpdating(false)
      })
    },
    [activeOrder, updating]
  )

  return {
    orders,
    loading,
    updating,
    detailsOpen,
    setDetailsOpen,
    activeOrder,
    viewLoading,
    handleViewDetails,
    handleUpdateStatus,
    handleUpdatePaymentStatus,
  }
}
