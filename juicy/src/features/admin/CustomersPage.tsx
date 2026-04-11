import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { adminApi } from "@/lib/api/admin"
import { formatPrice, formatDate } from "@/lib/utils/format"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SearchIcon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
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
  }
]

const fallbackClientOrders: Record<string, Order[]> = {
  "cust_1": [
    { id: "ord_1", order_number: "JUICY-20260525-9A4F81", status: "pending", payment_status: "unpaid", total: 128000, created_at: new Date().toISOString() },
    { id: "ord_11", order_number: "JUICY-20260518-8A3B22", status: "delivered", payment_status: "paid", total: 245000, created_at: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: "ord_12", order_number: "JUICY-20260510-4A3C99", status: "delivered", payment_status: "paid", total: 412000, created_at: new Date(Date.now() - 15 * 86400000).toISOString() }
  ],
  "cust_2": [
    { id: "ord_2", order_number: "JUICY-20260524-7C9E43", status: "shipped", payment_status: "paid", total: 224000, created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: "ord_21", order_number: "JUICY-20260515-5A3D11", status: "delivered", payment_status: "paid", total: 121000, created_at: new Date(Date.now() - 10 * 86400000).toISOString() }
  ],
  "cust_3": [
    { id: "ord_3", order_number: "JUICY-20260522-3B2D45", status: "delivered", payment_status: "paid", total: 128000, created_at: new Date(Date.now() - 3 * 86400000).toISOString() }
  ]
}

export const CustomersPage = () => {
  const [clients, setClients] = useState<ClientStatistics[]>([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  // Filters
  const [search, setSearch] = useState("")

  // Detail Modal trigger states
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [activeClient, setActiveClient] = useState<ClientStatistics | null>(null)
  const [clientHistory, setClientHistory] = useState<Order[]>([])
  const [loadingDetails, setLoadingDetails] = useState(false)

  // Account suspension process state
  const [togglingStatus, setTogglingStatus] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
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

  useEffect(() => {
    loadData()
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

    if (!window.confirm(promptMsg)) return

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
          <p className="text-xs text-muted-foreground tracking-wider uppercase font-medium">
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
        <h1 className="text-3xl font-heading font-extrabold tracking-tight text-foreground">
          Customers CRM
        </h1>
        <p className="text-xs text-muted-foreground">
          Browse customer profile details, toggle checkout access credentials, and monitor lifecycle sales averages.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card border border-border/60 p-4 rounded-lg shadow-sm">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
            <HugeiconsIcon icon={SearchIcon} className="size-4" />
          </span>
          <Input
            type="text"
            placeholder="Search full name, email address, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background border-border/80 w-full"
          />
        </div>

      </div>

      {/* Customer table Grid */}
      <div className="border border-border/60 rounded-lg bg-card overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-muted/40 font-bold border-b border-border">
            <tr>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Phone Number</th>
              <th className="px-6 py-4">Registration</th>
              <th className="px-6 py-4">Lifecycle Orders</th>
              <th className="px-6 py-4">Lifecycle Spent</th>
              <th className="px-6 py-4">Account Health</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                  No customers found matching your search term.
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-muted/20 transition-colors">
                  
                  {/* Client info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary uppercase">
                        {client.full_name.substring(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{client.full_name}</div>
                        <div className="text-[11px] text-muted-foreground">{client.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="px-6 py-4 font-mono text-xs text-foreground">
                    {client.phone || "-"}
                  </td>

                  {/* Registration date */}
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {formatDate(client.created_at)}
                  </td>

                  {/* Orders count */}
                  <td className="px-6 py-4 font-semibold text-foreground">
                    {client.order_count} unit(s)
                  </td>

                  {/* Total spent */}
                  <td className="px-6 py-4 font-bold text-foreground">
                    {formatPrice(client.total_spent)}
                  </td>

                  {/* Account status */}
                  <td className="px-6 py-4">
                    <Badge variant={client.is_active ?? true ? "outline" : "secondary"} className={client.is_active ?? true ? "text-green-600 border-green-600 bg-green-500/5" : "text-destructive border-destructive bg-destructive/5"}>
                      {client.is_active ?? true ? "Active Health" : "Suspended"}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewClientDetails(client)} className="cursor-pointer">
                        CRM Log
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={togglingStatus}
                        onClick={() => handleToggleClientStatus(client)}
                        className={cn(
                          "size-8 rounded-full border cursor-pointer hover:bg-muted",
                          client.is_active ?? true ? "text-destructive hover:bg-destructive/10" : "text-green-600 hover:bg-green-600/10"
                        )}
                      >
                        {client.is_active ?? true ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                        )}
                      </Button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- CUSTOMER PROFILE CRM DRAWER DIALOG --- */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl bg-card border overflow-y-auto max-h-[90vh]">
          
          <DialogHeader>
            <DialogTitle className="text-lg font-bold font-heading">
              Client CRM File: {activeClient?.full_name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Check historically placed orders, lifecycle totals spent, and account status modifications.
            </DialogDescription>
          </DialogHeader>

          {loadingDetails ? (
            <div className="flex h-64 w-full items-center justify-center">
              <Spinner className="size-8 text-primary" />
            </div>
          ) : !activeClient ? (
            <div className="text-center py-12 text-xs text-muted-foreground border border-dashed rounded-lg bg-muted/20">
              Failed to load detailed client credentials files.
            </div>
          ) : (
            <div className="text-left py-4 flex flex-col gap-6">
              
              {/* Profile Overview Card */}
              <div className="grid gap-4 sm:grid-cols-3 bg-muted/15 border p-4 rounded-lg text-xs">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</span>
                  <span className="font-semibold text-foreground">{activeClient.email}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Mobile Contact</span>
                  <span className="font-semibold text-foreground">{activeClient.phone || "Unassigned"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Account Health</span>
                  <div>
                    <Badge variant={activeClient.is_active ?? true ? "outline" : "secondary"} className={activeClient.is_active ?? true ? "text-green-600 border-green-600 bg-green-500/5" : "text-destructive border-destructive bg-destructive/5"}>
                      {activeClient.is_active ?? true ? "Active Access" : "Suspended"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Historical Orders section */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Placed Order History</h3>
                  <div className="text-xs font-bold text-foreground">
                    Total Spent: <span className="text-primary">{formatPrice(activeClient.total_spent)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {clientHistory.length === 0 ? (
                    <div className="text-center py-12 text-xs text-muted-foreground border border-dashed rounded-lg bg-muted/20">
                      No order lifecycle invoices captured under this account.
                    </div>
                  ) : (
                    clientHistory.map((ord) => (
                      <div key={ord.id} className="p-3 border rounded-lg bg-card flex items-center justify-between text-xs hover:border-primary transition-colors">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="font-mono font-bold text-foreground">{ord.order_number}</span>
                          <span className="text-[10px] text-muted-foreground mt-0.5">{formatDate(ord.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right font-bold text-foreground">{formatPrice(ord.total)}</div>
                          <Badge variant="outline" className={cn(
                            "text-[10px] uppercase font-bold",
                            ord.status === "delivered" ? "text-green-600 border-green-600" : "text-yellow-600 border-yellow-600"
                          )}>
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
              <Button type="button" className="cursor-pointer">Close CRM Log</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default CustomersPage
