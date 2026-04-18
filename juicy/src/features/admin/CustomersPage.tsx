import { useEffect, useState } from "react"
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
import type { Customer, Order } from "@/types"

// Customer with statistics fields returned by index endpoint
type ClientStatistics = Customer & {
  order_count: number
  total_spent: number
  is_active?: boolean
  created_at: string
}

// Fallback lists for offline sandbox demos
const fallbackClients: ClientStatistics[] = [
  {
    id: "cust_1",
    full_name: "Alexandra Sterling",
    email: "alexandra@sterling.com",
    phone: "+628123456789",
    order_count: 5,
    total_spent: 785000,
    is_active: true,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "cust_2",
    full_name: "Jonathan Wright",
    email: "jonathan.wright@gmail.com",
    phone: "+628198765432",
    order_count: 2,
    total_spent: 345000,
    is_active: true,
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: "cust_3",
    full_name: "Eleanor Vance",
    email: "eleanor@vance.org",
    phone: "+628177228833",
    order_count: 1,
    total_spent: 128000,
    is_active: false,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
]

const fallbackClientOrders: Record<string, Order[]> = {
  cust_1: [
    {
      id: "ord_1",
      order_number: "JUICY-20260525-9A4F81",
      status: "pending",
      payment_status: "unpaid",
      total: 128000,
      created_at: new Date().toISOString(),
    },
    {
      id: "ord_11",
      order_number: "JUICY-20260518-8A3B22",
      status: "delivered",
      payment_status: "paid",
      total: 245000,
      created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
      id: "ord_12",
      order_number: "JUICY-20260510-4A3C99",
      status: "delivered",
      payment_status: "paid",
      total: 412000,
      created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    },
  ],
  cust_2: [
    {
      id: "ord_2",
      order_number: "JUICY-20260524-7C9E43",
      status: "shipped",
      payment_status: "paid",
      total: 224000,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "ord_21",
      order_number: "JUICY-20260515-5A3D11",
      status: "delivered",
      payment_status: "paid",
      total: 121000,
      created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
  ],
  cust_3: [
    {
      id: "ord_3",
      order_number: "JUICY-20260522-3B2D45",
      status: "delivered",
      payment_status: "paid",
      total: 128000,
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
  ],
}

export const CustomersPage = () => {
  const [clients, setClients] = useState<ClientStatistics[]>([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  // Filters
  const [search, setSearch] = useState("")

  // Detail Modal trigger states
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [activeClient, setActiveClient] = useState<ClientStatistics | null>(
    null
  )
  const [clientHistory, setClientHistory] = useState<Order[]>([])
  const [loadingDetails, setLoadingDetails] = useState(false)

  const { confirm: confirmDelete, dialog: confirmDialog } = useConfirm()

  // Account suspension process state
  const [togglingStatus, setTogglingStatus] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminApi.getCustomers()
        if (res.success && res.data) {
          setClients(res.data as ClientStatistics[])
        } else {
          setClients(fallbackClients)
          setUsingFallback(true)
        }
      } catch {
        setClients(fallbackClients)
        setUsingFallback(true)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // View Customer profile history
  const handleViewClientDetails = async (client: ClientStatistics) => {
    try {
      setLoadingDetails(true)
      setActiveClient(client)
      setClientHistory([])
      setDetailsOpen(true)

      if (usingFallback) {
        setClientHistory(fallbackClientOrders[client.id] || [])
      } else {
        const res = await adminApi.getCustomerDetail(client.id)
        if (res.success && res.data) {
          setClientHistory(res.data.order_history || [])
        } else {
          setClientHistory(fallbackClientOrders[client.id] || [])
        }
      }
    } catch {
      setClientHistory(fallbackClientOrders[client.id] || [])
    } finally {
      setLoadingDetails(false)
    }
  }

  // Toggle account block/unblock status
  const handleToggleClientStatus = async (client: ClientStatistics) => {
    const nextStatus = !(client.is_active ?? true)
    const promptMsg = nextStatus
      ? `Reactivate account credentials for ${client.full_name}?`
      : `Suspend account credentials for ${client.full_name}? This prevents checkout or carts management.`

    if (!(await confirmDelete(promptMsg))) return

    setTogglingStatus(true)
    try {
      if (usingFallback) {
        const updatedList = clients.map((c) =>
          c.id === client.id ? { ...c, is_active: nextStatus } : c
        )
        setClients(updatedList)
        if (activeClient && activeClient.id === client.id) {
          setActiveClient({ ...activeClient, is_active: nextStatus })
        }
        toast.success(`Account credentials modified successfully (Mocked)`)
      } else {
        const res = await adminApi.toggleCustomerStatus(client.id, nextStatus)
        if (res.success) {
          toast.success(`Account credentials modified successfully!`)
          const updatedList = clients.map((c) =>
            c.id === client.id ? { ...c, is_active: nextStatus } : c
          )
          setClients(updatedList)
          if (activeClient && activeClient.id === client.id) {
            setActiveClient({ ...activeClient, is_active: nextStatus })
          }
        } else {
          toast.error(res.message || "Failed to update account status.")
        }
      }
    } catch {
      toast.error("Failed to execute account status transition.")
    } finally {
      setTogglingStatus(false)
    }
  }

  // Filtering
  const filteredClients = clients.filter((c) => {
    return (
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
    )
  })

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
      {/* Header block */}
      <div>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
          Customers CRM
        </h1>
        <p className="text-xs text-muted-foreground">
          Browse customer profile details, toggle checkout access credentials,
          and monitor lifecycle sales averages.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col items-center gap-4 rounded-lg border border-border/60 bg-card p-4 shadow-sm sm:flex-row">
        {/* Search */}
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

      {/* Customer table Grid */}
      <div className="rounded-lg border border-border/60 bg-card shadow-sm">
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
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  No customers found matching your search term.
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  {/* Client info */}
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

                  {/* Phone */}
                  <TableCell className="px-6 py-4 font-mono text-xs text-foreground">
                    {client.phone || "-"}
                  </TableCell>

                  {/* Registration date */}
                  <TableCell className="px-6 py-4 text-xs text-muted-foreground">
                    {formatDate(client.created_at)}
                  </TableCell>

                  {/* Orders count */}
                  <TableCell className="px-6 py-4 font-semibold text-foreground">
                    {client.order_count} unit(s)
                  </TableCell>

                  {/* Total spent */}
                  <TableCell className="px-6 py-4 font-bold text-foreground">
                    {formatPrice(client.total_spent)}
                  </TableCell>

                  {/* Account status */}
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

                  {/* Actions */}
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
                        disabled={togglingStatus}
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
      </div>

      {/* --- CUSTOMER PROFILE CRM DRAWER DIALOG --- */}
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

          {loadingDetails ? (
            <div className="flex h-64 w-full items-center justify-center">
              <Spinner className="size-8 text-primary" />
            </div>
          ) : !activeClient ? (
            <div className="rounded-lg border border-dashed bg-muted/20 py-12 text-center text-xs text-muted-foreground">
              Failed to load detailed client credentials files.
            </div>
          ) : (
            <div className="flex flex-col gap-6 py-4 text-left">
              {/* Profile Overview Card */}
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

              {/* Historical Orders section */}
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
