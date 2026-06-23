import { ordersApi } from "@/lib/api/orders"
import type { Order, OrderDetail } from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useCustomerOrdersQuery = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await ordersApi.getCustomerOrders()
      if (!res.success || !res.data) {
        throw new Error(res.message || "Failed to load your purchase history.")
      }
      return (res.data.items ?? []) as Order[]
    },
  })
}

export const useOrderDetailQuery = (orderNumber: string | undefined) => {
  return useQuery({
    queryKey: ["order", orderNumber],
    queryFn: async () => {
      if (!orderNumber) throw new Error("Order reference number is missing.")
      const res = await ordersApi.getOrderDetail(orderNumber)
      if (!res.success || !res.data) {
        throw new Error(res.message || "Failed to load order tracking details.")
      }
      return res.data as OrderDetail
    },
    enabled: !!orderNumber,
  })
}

export const useCompleteOrderMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (orderNumber: string) => {
      const res = await ordersApi.completeOrder(orderNumber)
      if (!res.success) {
        throw new Error(res.message || "Failed to complete order.")
      }
      return res
    },
    onSuccess: (_, orderNumber) => {
      queryClient.invalidateQueries({ queryKey: ["order", orderNumber] })
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })
}

export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (orderNumber: string) => {
      const res = await ordersApi.cancelOrder(orderNumber)
      if (!res.success) {
        throw new Error(res.message || "Failed to cancel order.")
      }
      return res
    },
    onSuccess: (_, orderNumber) => {
      queryClient.invalidateQueries({ queryKey: ["order", orderNumber] })
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })
}
