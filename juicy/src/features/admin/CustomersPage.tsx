import { useEffect, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { adminApi } from "@/lib/api/admin"
import { formatPrice, formatDate } from "@/lib/utils/format"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SearchIcon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useConfirm } from "@/hooks/useConfirm"
import { useDataTableFilter } from "@/features/admin/hook/useDataTableFilter"
import { PageHeader } from "@/features/admin/components/PageHeader"
import { EmptyState } from "@/features/admin/components/DataEmpty"
import { DefferedContainer } from "@/features/admin/components/DefferedContainer"
import type { Customer, Order } from "@/types"

type ClientStatistics = Customer & {
  order_count: number
  total_spent: number
  is_active?: boolean
  created_at: string
}

export const CustomersPage = () => {
  const [clients, setClients] = useState<ClientStatistics[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const {
    search,
    setSearch,
    filteredData: filteredClients,
    isStale,
  } = useDataTableFilter(clients, (c, searchLower) => {
    return (
      c.full_name.toLowerCase().includes(searchLower) ||
      c.email.toLowerCase().includes(searchLower) ||
      !!c.phone?.includes(searchLower)
    )
  })

  const [detailsOpen, setDetailsOpen] = useState(false)
  const [activeClient, setActiveClient] = useState<ClientStatistics | null>(
    null
  )
  const [clientHistory, setClientHistory] = useState<Order[]>([])

  const { confirm: confirmDelete, dialog: confirmDialog } = useConfirm()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminApi.getCustomers()
        if (res.success && res.data) {
          setClients(res.data as ClientStatistics[])
        }
      } catch {
        // silent fail
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleViewClientDetails = (client: ClientStatistics) => {
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
  }

  const handleToggleClientStatus = async (client: ClientStatistics) => {
    const nextStatus = !(client.is_active ?? true)
    const promptMsg = nextStatus
      ? `Reactivate account credentials for ${client.full_name}?`
      : `Suspend account credentials for ${client.full_name}? This prevents checkout or carts management.`

    if (!(await confirmDelete(promptMsg))) return

    startTransition(async () => {
      try {
        const res = await adminApi.toggleCustomerStatus(client.id, nextStatus)
        if (res.success) {
          toast.success(`Account credentials modified successfully!`)
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
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <Spinner className="size-8 text-primary" />
          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Loading Customer Directory...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 text-left">
      <PageHeader
        title="Customers CRM"
        description="Browse customer profile details, toggle checkout access credentials, and monitor lifecycle sales averages."
      />

      <div className="flex flex-col items-center gap-4 rounded-lg border border-border/60 bg-card p-4 shadow-sm sm:flex-row">
        <div className="relative w-full sm:max-w-md">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
            <HugeiconsIcon icon={SearchIcon} className="size-4" />
          </span>
          <Input
            type="text"
            placeholder="Search full name, email address, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-border/80 bg-background pl-9"
          />
        </div>
      </div>

      <DefferedContainer
        isStale={isStale}
        className="rounded-lg border border-border/60 bg-card shadow-sm"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-4">Client</TableHead>
              <TableHead className="px-6 py-4">Phone Number</TableHead>
              <TableHead className="px-6 py-4">Registration</TableHead>
              <TableHead className="px-6 py-4">Lifecycle Orders</TableHead>
              <TableHead className="px-6 py-4">Lifecycle Spent</TableHead>
              <TableHead className="px-6 py-4">Account Health</TableHead>
              <TableHead className="px-6 py-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length === 0 ? (
              <EmptyState message="No customers found matching your search term." />
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary uppercase">
                        {client.full_name.substring(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {client.full_name}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {client.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-4 font-mono text-xs text-foreground">
                    {client.phone || "-"}
                  </TableCell>

                  <TableCell className="px-6 py-4 text-xs text-muted-foreground">
                    {formatDate(client.created_at)}
                  </TableCell>

                  <TableCell className="px-6 py-4 font-semibold text-foreground">
                    {client.order_count} unit(s)
                  </TableCell>

                  <TableCell className="px-6 py-4 font-bold text-foreground">
                    {formatPrice(client.total_spent)}
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <Badge
                      variant={
                        (client.is_active ?? true) ? "default" : "destructive"
                      }
                    >
                      {(client.is_active ?? true)
                        ? "Active Health"
                        : "Suspended"}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewClientDetails(client)}
                      >
                        CRM Log
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isPending}
                        onClick={() => handleToggleClientStatus(client)}
                        className={cn(
                          "size-8 rounded-full border hover:bg-muted",
                          (client.is_active ?? true)
                            ? "text-destructive hover:bg-destructive/10"
                            : "text-primary hover:bg-primary/10"
                        )}
                      >
                        {(client.is_active ?? true) ? (
                          <HugeiconsIcon
                            icon={Cancel01Icon}
                            className="size-4"
                          />
                        ) : (
                          <HugeiconsIcon
                            icon={CheckmarkCircle01Icon}
                            className="size-4"
                          />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </DefferedContainer>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto border bg-card">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold">
              Client CRM File: {activeClient?.full_name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Check historically placed orders, lifecycle totals spent, and
              account status modifications.
            </DialogDescription>
          </DialogHeader>

          {isPending ? (
            <div className="flex h-64 w-full items-center justify-center">
              <Spinner className="size-8 text-primary" />
            </div>
          ) : !activeClient ? (
            <div className="rounded-lg border border-dashed bg-muted/20 py-12 text-center text-xs text-muted-foreground">
              Failed to load detailed client credentials files.
            </div>
          ) : (
            <div className="flex flex-col gap-6 py-4 text-left">
              <div className="grid gap-4 rounded-lg border bg-muted/15 p-4 text-xs sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Email Address
                  </span>
                  <span className="font-semibold text-foreground">
                    {activeClient.email}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Mobile Contact
                  </span>
                  <span className="font-semibold text-foreground">
                    {activeClient.phone || "Unassigned"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Account Health
                  </span>
                  <div>
                    <Badge
                      variant={
                        (activeClient.is_active ?? true)
                          ? "default"
                          : "destructive"
                      }
                    >
                      {(activeClient.is_active ?? true)
                        ? "Active Access"
                        : "Suspended"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Placed Order History
                  </h3>
                  <div className="text-xs font-bold text-foreground">
                    Total Spent:{" "}
                    <span className="text-primary">
                      {formatPrice(activeClient.total_spent)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {clientHistory.length === 0 ? (
                    <div className="rounded-lg border border-dashed bg-muted/20 py-12 text-center text-xs text-muted-foreground">
                      No order lifecycle invoices captured under this account.
                    </div>
                  ) : (
                    clientHistory.map((ord) => (
                      <div
                        key={ord.id}
                        className="flex items-center justify-between rounded-lg border bg-card p-3 text-xs transition-colors hover:border-primary"
                      >
                        <div className="flex flex-col items-start gap-1">
                          <span className="font-mono font-bold text-foreground">
                            {ord.order_number}
                          </span>
                          <span className="mt-0.5 text-[10px] text-muted-foreground">
                            {formatDate(ord.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right font-bold text-foreground">
                            {formatPrice(ord.total)}
                          </div>
                          <Badge
                            variant={
                              ord.status === "delivered"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {ord.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-border pt-4">
            <DialogClose asChild>
              <Button type="button">Close CRM Log</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {confirmDialog}
    </div>
  )
}

export default CustomersPage
