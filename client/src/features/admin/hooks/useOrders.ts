import { adminApi } from "@/lib/api/admin"
import type { AdminOrder, OrderDetail, OrderStatus, PaymentStatus } from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback, useState } from "react"
import { toast } from "sonner"

export const useOrders = () => {
  const queryClient = useQueryClient()

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await adminApi.getOrders()
      if (!res.success) throw new Error(res.error?.message || "Failed to load orders")
      return res.data as AdminOrder[]
    },
  })

  const [detailsOpen, setDetailsOpen] = useState(false)
  const [activeOrder, setActiveOrder] = useState<OrderDetail | null>(null)
  const [viewLoading, setViewLoading] = useState(false)

  const handleViewDetails = useCallback((orderId: string) => {
    setActiveOrder(null)
    setViewLoading(true)
    setDetailsOpen(true)
    adminApi
      .getOrderDetail(orderId)
      .then((res) => {
        if (res.success && res.data) {
          setActiveOrder(res.data)
        }
      })
      .catch(() => {
        // silent fail
      })
      .finally(() => {
        setViewLoading(false)
      })
  }, [])

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await adminApi.updateOrderStatus(id, status)
      if (!res.success) throw new Error(res.error?.message || "Failed to update status")
    },
    onMutate: async ({ status }) => {
      const prevActive = activeOrder
      setActiveOrder((prev) => (prev ? { ...prev, status: status as OrderStatus } : null))
      return { prevActive }
    },
    onError: (_err, _vars, context) => {
      if (context?.prevActive) {
        const prevStatus = context.prevActive.status
        setActiveOrder((prev) => (prev ? { ...prev, status: prevStatus } : null))
      }
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] })
      toast.error("Failed to update status workflow.")
    },
    onSuccess: (_data, { status }) => {
      toast.success(`Fulfillment status updated to: ${status}`)
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] })
    },
  })

  const paymentMutation = useMutation({
    mutationFn: async ({ id, paymentStatus }: { id: string; paymentStatus: string }) => {
      const res = await adminApi.updateOrderPaymentStatus(id, paymentStatus)
      if (!res.success) throw new Error(res.error?.message || "Failed to update payment")
    },
    onMutate: async ({ paymentStatus }) => {
      const prevActive = activeOrder
      setActiveOrder((prev) => (prev ? { ...prev, payment_status: paymentStatus as PaymentStatus } : null))
      return { prevActive }
    },
    onError: (_err, _vars, context) => {
      if (context?.prevActive) {
        const prevPayment = context.prevActive.payment_status
        setActiveOrder((prev) => (prev ? { ...prev, payment_status: prevPayment } : null))
      }
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] })
      toast.error("Failed to transition payment status.")
    },
    onSuccess: (_data, { paymentStatus }) => {
      toast.success(`Payment status marked as: ${paymentStatus}`)
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] })
    },
  })

  const handleUpdateStatus = useCallback(
    (status: OrderStatus) => {
      if (!activeOrder || statusMutation.isPending) return
      statusMutation.mutate({ id: activeOrder.id, status })
    },
    [activeOrder, statusMutation]
  )

  const handleUpdatePaymentStatus = useCallback(
    (paymentStatus: PaymentStatus) => {
      if (!activeOrder || paymentMutation.isPending) return
      paymentMutation.mutate({ id: activeOrder.id, paymentStatus })
    },
    [activeOrder, paymentMutation]
  )

  return {
    orders,
    loading: isLoading,
    updating: statusMutation.isPending || paymentMutation.isPending,
    viewLoading,
    detailsOpen,
    setDetailsOpen,
    activeOrder,
    handleViewDetails,
    handleUpdateStatus,
    handleUpdatePaymentStatus,
  }
}
