import { useEffect, useState, useTransition, useCallback } from "react"
import { adminApi } from "@/lib/api/admin"
import { toast } from "sonner"
import type { AdminOrder } from "@/types"
import type { ClientStatistics } from "@/features/admin/types"

export const useCustomers = () => {
  const [clients, setClients] = useState<ClientStatistics[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const [detailsOpen, setDetailsOpen] = useState(false)
  const [activeClient, setActiveClient] = useState<ClientStatistics | null>(null)
  const [clientHistory, setClientHistory] = useState<AdminOrder[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminApi.getCustomers()
        if (res.success && res.data) {
          setClients(res.data)
        }
      } catch {
        // silent fail
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleViewClientDetails = useCallback(
    (client: ClientStatistics) => {
      setActiveClient(client)
      setClientHistory([])
      setDetailsOpen(true)

      startTransition(async () => {
        try {
          const res = await adminApi.getCustomerDetail(client.id)
          if (res.success && res.data) {
            setClientHistory(res.data.order_history || [])
          }
        } catch {
          // silent fail
        }
      })
    },
    []
  )

  const handleToggleClientStatus = useCallback(
    async (
      client: ClientStatistics,
      confirmFn: (msg: string) => Promise<boolean>
    ) => {
      const nextStatus = !(client.is_active ?? true)
      const promptMsg = nextStatus
        ? `Reactivate account credentials for ${client.full_name}?`
        : `Suspend account credentials for ${client.full_name}? This prevents checkout or carts management.`

      if (!(await confirmFn(promptMsg))) return

      startTransition(async () => {
        try {
          const res = await adminApi.toggleCustomerStatus(client.id, nextStatus)
          if (res.success) {
            toast.success("Account credentials modified successfully!")
            setClients((prev) =>
              prev.map((c) =>
                c.id === client.id ? { ...c, is_active: nextStatus } : c
              )
            )
            setActiveClient((prev) =>
              prev?.id === client.id ? { ...prev, is_active: nextStatus } : prev
            )
          } else {
            toast.error(res.message || "Failed to update account status.")
          }
        } catch {
          toast.error("Failed to execute account status transition.")
        }
      })
    },
    []
  )

  return {
    clients,
    loading,
    isPending,
    detailsOpen,
    setDetailsOpen,
    activeClient,
    clientHistory,
    handleViewClientDetails,
    handleToggleClientStatus,
  }
}
