import { useEffect, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { adminApi } from "@/lib/api/admin"
import { formatPrice, formatDate } from "@/lib/utils/format"
import { HugeiconsIcon } from "@hugeicons/react"
import { SearchIcon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { useDataTableFilter } from "@/features/admin/hook/useDataTableFilter"
import { PageHeader } from "@/features/admin/components/PageHeader"
import { EmptyState } from "@/features/admin/components/DataEmpty"
import { DefferedContainer } from "@/features/admin/components/DefferedContainer"
import type { Order, OrderDetail, OrderStatus, PaymentStatus } from "@/types"

const FULFILLMENT_STEPS: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered"]
const PAYMENT_STEPS: PaymentStatus[] = ["unpaid", "paid", "refunded"]

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case "pending": return <Badge variant="secondary">Pending</Badge>
    case "confirmed": return <Badge>Confirmed</Badge>
    case "processing": return <Badge variant="secondary">Processing</Badge>
    case "shipped": return <Badge>Shipped</Badge>
    case "delivered": return <Badge variant="default">Delivered</Badge>
    default: return <Badge variant="outline">{status}</Badge>
  }
}

const getPaymentBadge = (status: PaymentStatus) => {
  switch (status) {
    case "unpaid": return <Badge variant="destructive">Unpaid</Badge>
    case "paid": return <Badge variant="default">Paid</Badge>
    case "refunded": return <Badge variant="secondary">Refunded</Badge>
    default: return <Badge variant="outline">{status}</Badge>
  }
}

export const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const {
    search,
    setSearch,
    filteredData: searchFilteredOrders,
    isStale,
  } = useDataTableFilter(orders, (o, searchLower) =>
    o.order_number.toLowerCase().includes(searchLower)
  )
  const [statusFilter, setStatusFilter] = useState("all")

  const [detailsOpen, setDetailsOpen] = useState(false)
  const [activeOrder, setActiveOrder] = useState<OrderDetail | null>(null)

  const loadOrdersData = async (shouldTriggerLoader = false) => {
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
  }

  useEffect(() => {
    loadOrdersData(true)
  }, [])

  const handleViewDetails = (orderId: string) => {
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
  }

  const handleUpdateStatus = (status: OrderStatus) => {
    if (!activeOrder) return
    startTransition(async () => {
      try {
        const res = await adminApi.updateOrderStatus(activeOrder.id, status)
        if (res.success) {
          toast.success(`Fulfillment status updated to: ${status}`)
          setActiveOrder((prev) => (prev ? { ...prev, status } : null))
          setOrders((curr) => curr.map((o) => (o.id === activeOrder.id ? { ...o, status } : o)))
        } else {
          toast.error(res.message || "Failed to update order status.")
        }
      } catch {
        toast.error("Failed to update status workflow.")
      }
    })
  }

  const handleUpdatePaymentStatus = (paymentStatus: PaymentStatus) => {
    if (!activeOrder) return
    startTransition(async () => {
      try {
        const res = await adminApi.updateOrderPaymentStatus(activeOrder.id, paymentStatus)
        if (res.success) {
          toast.success(`Payment status marked as: ${paymentStatus}`)
          setActiveOrder((prev) => (prev ? { ...prev, payment_status: paymentStatus } : null))
          setOrders((curr) => curr.map((o) => (o.id === activeOrder.id ? { ...o, payment_status: paymentStatus } : o)))
        } else {
          toast.error(res.message || "Failed to update payment status.")
        }
      } catch {
        toast.error("Failed to transition payment status.")
      }
    })
  }

  const filteredOrders = searchFilteredOrders.filter((o) =>
    statusFilter === "all" || o.status === statusFilter
  )

  if (loading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <Spinner className="size-8 text-primary" />
          <p className="text-xs text-muted-foreground tracking-wider uppercase font-medium">
            Loading Customer Orders...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 text-left">
      <PageHeader
        title="Fulfillment Registry"
        description="Monitor incoming customer orders, manage daily shipments tracking, and capture direct invoice payments."
      />

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card border border-border/60 p-4 rounded-lg shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
            <HugeiconsIcon icon={SearchIcon} className="size-4" />
          </span>
          <Input
            type="text"
            placeholder="Search invoice number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background border-border/80 w-full"
          />
        </div>

        <div className="w-full sm:max-w-xs">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Fulfillment Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fulfillment Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DefferedContainer
        isStale={isStale}
        className="border border-border/60 rounded-lg bg-card shadow-sm"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-4">Invoice ID</TableHead>
              <TableHead className="px-6 py-4">Fulfillment Status</TableHead>
              <TableHead className="px-6 py-4">Invoice Payment</TableHead>
              <TableHead className="px-6 py-4">Ordered Items</TableHead>
              <TableHead className="px-6 py-4">Invoice Amount</TableHead>
              <TableHead className="px-6 py-4">Ordered At</TableHead>
              <TableHead className="px-6 py-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <EmptyState message="No boutique orders found matching your search." />
            ) : (
              filteredOrders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="px-6 py-4 font-mono font-bold text-foreground">
                    {o.order_number}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {getStatusBadge(o.status)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {getPaymentBadge(o.payment_status)}
                  </TableCell>
                  <TableCell className="px-6 py-4 font-medium text-muted-foreground">
                    {o.item_count || 0} unit(s)
                  </TableCell>
                  <TableCell className="px-6 py-4 font-bold text-foreground">
                    {formatPrice(o.total)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-muted-foreground text-xs">
                    {formatDate(o.created_at)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(o.id)}>
                      Fulfill Order
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </DefferedContainer>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl bg-card border overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold font-heading">
              Invoice Order Detail: {activeOrder?.order_number || "Fulfillment"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Review line-items, verify payments capture, print packing labels, and coordinate delivery shipments.
            </DialogDescription>
          </DialogHeader>

          {isPending ? (
            <div className="flex h-64 w-full items-center justify-center">
              <Spinner className="size-8 text-primary" />
            </div>
          ) : !activeOrder ? (
            <div className="text-center py-12 text-xs text-muted-foreground border border-dashed rounded-lg bg-muted/20">
              Failed to load order detailed specifications.
            </div>
          ) : (
            <div className="text-left py-4 flex flex-col gap-6">
              <div className="grid gap-4 sm:grid-cols-2 bg-muted/15 border p-4 rounded-lg">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Fulfillment Status Flow</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {FULFILLMENT_STEPS.map((st) => (
                      <Button
                        key={st}
                        variant={activeOrder.status === st ? "default" : "outline"}
                        size="xs"
                        onClick={() => handleUpdateStatus(st)}
                        disabled={isPending}
                        className="text-[10px] uppercase font-bold py-1 h-auto"
                      >
                        {st}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Invoice Capture</span>
                  <div className="flex gap-1.5">
                    {PAYMENT_STEPS.map((pst) => (
                      <Button
                        key={pst}
                        variant={activeOrder.payment_status === pst ? "default" : "outline"}
                        size="xs"
                        onClick={() => handleUpdatePaymentStatus(pst)}
                        disabled={isPending}
                        className="text-[10px] uppercase font-bold py-1 h-auto"
                      >
                        {pst}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 flex flex-col gap-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Snapshotted Cart items</h3>
                  <div className="flex flex-col gap-3">
                    {activeOrder.items?.map((item) => (
                      <div key={item.id} className="p-3 border rounded-lg bg-card flex items-center gap-3 text-xs">
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="size-12 object-cover rounded bg-muted border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200"
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-foreground truncate">{item.product_name}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            {item.variant_size} / {item.variant_color}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-foreground">{formatPrice(item.subtotal)}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            {item.quantity} x {formatPrice(item.unit_price)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 text-xs flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Line subtotal</span>
                      <span className="font-medium text-foreground">{formatPrice(activeOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fulfillment delivery shipping</span>
                      <span className="font-medium text-foreground">{formatPrice(activeOrder.shipping_fee)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold border-t border-border pt-2">
                      <span className="text-foreground">Total Invoice Invoice</span>
                      <span className="text-primary">{formatPrice(activeOrder.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 bg-muted/10 p-4 rounded-lg border h-fit text-xs">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Fulfillment Consignee</span>
                    <div className="font-bold text-foreground">{activeOrder.address.recipient_name}</div>
                    <div className="text-muted-foreground font-mono">{activeOrder.address.phone}</div>
                  </div>

                  <Separator className="my-1" />

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Delivery Destination ({activeOrder.address.label})</span>
                    <div className="text-foreground leading-relaxed">
                      {activeOrder.address.address_line}, {activeOrder.address.city}, {activeOrder.address.province}, {activeOrder.address.postal_code}
                    </div>
                  </div>

                  {activeOrder.notes && (
                    <>
                      <Separator className="my-1" />
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Consignee Delivery Instructions</span>
                        <div className="text-muted-foreground italic leading-relaxed">
                          "{activeOrder.notes}"
                        </div>
                      </div>
                    </>
                  )}

                  <Separator className="my-1" />

                  <div className="flex flex-col gap-1.5 text-[10px] font-medium text-muted-foreground">
                    <div>Placed: {formatDate(activeOrder.created_at)}</div>
                    {activeOrder.shipped_at && <div>Shipped: {formatDate(activeOrder.shipped_at)}</div>}
                    {activeOrder.delivered_at && <div>Delivered: {formatDate(activeOrder.delivered_at)}</div>}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-border pt-4">
            <DialogClose asChild>
              <Button type="button">Close Registry</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OrdersPage
