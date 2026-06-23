import type { ClientStatistics } from "@/features/admin/types"
import { adminApi } from "@/lib/api/admin"
import type { AdminOrder } from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback, useState } from "react"
import { toast } from "sonner"

export const useCustomers = () => {
  const queryClient = useQueryClient()

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const res = await adminApi.getCustomers()
      if (!res.success) throw new Error(res.error?.message || "Failed to load customers")
      return res.data as ClientStatistics[]
    },
  })

  const [detailsOpen, setDetailsOpen] = useState(false)
  const [activeClient, setActiveClient] = useState<ClientStatistics | null>(null)
  const [clientHistory, setClientHistory] = useState<AdminOrder[]>([])

  const handleViewClientDetails = useCallback((client: ClientStatistics) => {
    setActiveClient(client)
    setClientHistory([])
    setDetailsOpen(true)

    adminApi
      .getCustomerDetail(client.id)
      .then((res) => {
        if (res.success && res.data) {
          setClientHistory(res.data.order_history || [])
        } else {
          toast.error(res.error?.message || "Failed to load customer details.")
        }
      })
      .catch(() => {
        toast.error("Failed to load customer details.")
      })
  }, [])

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await adminApi.toggleCustomerStatus(id, isActive)
      if (!res.success) throw new Error(res.error?.message || "Failed to update status")
    },
    onSuccess: () => {
      toast.success("Account credentials modified successfully!")
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to execute account status transition.")
    },
  })

  const handleToggleClientStatus = useCallback(
    async (client: ClientStatistics, confirmFn: (msg: string) => Promise<boolean>) => {
      const nextStatus = !(client.is_active ?? true)
      const promptMsg = nextStatus
        ? `Reactivate account credentials for ${client.full_name}?`
        : `Suspend account credentials for ${client.full_name}? This prevents checkout or carts management.`
      if (!(await confirmFn(promptMsg))) return
      toggleMutation.mutate({ id: client.id, isActive: nextStatus })
    },
    [toggleMutation]
  )

  return {
    clients,
    loading: isLoading,
    isPending: toggleMutation.isPending,
    detailsOpen,
    setDetailsOpen,
    activeClient,
    clientHistory,
    handleViewClientDetails,
    handleToggleClientStatus,
  }
}
