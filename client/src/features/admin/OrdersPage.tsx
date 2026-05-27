import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { formatPrice, formatDate } from "@/lib/utils/format"
import { useOrders } from "@/features/admin/hooks/useOrders"
import { useDataTableFilter } from "@/features/admin/hooks/useDataTableFilter"
import { PageHeader } from "@/features/admin/components/PageHeader"
import { EmptyState } from "@/features/admin/components/DataEmpty"
import { DefferedContainer } from "@/features/admin/components/DefferedContainer"
import { FullPageSpinner } from "@/features/admin/components/FullPageSpinner"
import { SearchInput } from "@/features/admin/components/SearchInput"
import type { OrderStatus, PaymentStatus } from "@/types"

const FULFILLMENT_STEPS: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered"]
const PAYMENT_STEPS: PaymentStatus[] = ["unpaid", "paid", "refunded"]

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary">Pending</Badge>
    case "confirmed":
      return <Badge>Confirmed</Badge>
    case "processing":
      return <Badge variant="secondary">Processing</Badge>
    case "shipped":
      return <Badge>Shipped</Badge>
    case "delivered":
      return <Badge variant="default">Delivered</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getPaymentBadge = (status: PaymentStatus) => {
  switch (status) {
    case "unpaid":
      return <Badge variant="destructive">Unpaid</Badge>
    case "paid":
      return <Badge variant="default">Paid</Badge>
    case "refunded":
      return <Badge variant="secondary">Refunded</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export const OrdersPage = () => {
  const {
    orders,
    loading,
    updating,
    viewLoading,
    detailsOpen,
    setDetailsOpen,
    activeOrder,
    handleViewDetails,
    handleUpdateStatus,
    handleUpdatePaymentStatus,
  } = useOrders()

  const {
    search,
    setSearch,
    filteredData: searchFiltered,
    isStale,
  } = useDataTableFilter(orders, (o, s) => o.order_number.toLowerCase().includes(s))

  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = searchFiltered.filter((o) => statusFilter === "all" || o.status === statusFilter)

  if (loading) return <FullPageSpinner label="Loading Customer Orders..." />

  return (
    <div className="flex flex-col gap-8 text-left">
      <PageHeader
        title="Fulfillment Registry"
        description="Monitor incoming customer orders, manage daily shipments tracking, and capture direct invoice payments."
      />

      <div className="flex flex-col items-center gap-4 rounded-lg border border-border/60 bg-card p-4 shadow-sm sm:flex-row">
        <SearchInput
          placeholder="Search invoice number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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

      <DefferedContainer isStale={isStale} className="rounded-lg border border-border/60 bg-card shadow-sm">
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
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <EmptyState message="No boutique orders found matching your search." />
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="px-6 py-4 font-mono font-bold text-foreground">{o.order_number}</TableCell>
                  <TableCell className="px-6 py-4">{getStatusBadge(o.status)}</TableCell>
                  <TableCell className="px-6 py-4">{getPaymentBadge(o.payment_status)}</TableCell>
                  <TableCell className="px-6 py-4 font-medium text-muted-foreground">
                    {o.item_count || 0} unit(s)
                  </TableCell>
                  <TableCell className="px-6 py-4 font-bold text-foreground">{formatPrice(o.total)}</TableCell>
                  <TableCell className="px-6 py-4 text-xs text-muted-foreground">{formatDate(o.created_at)}</TableCell>
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
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto border bg-card sm:min-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold">
              Invoice Order Detail: {activeOrder?.order_number || "Fulfillment"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Review line-items, verify payments capture, print packing labels, and coordinate delivery shipments.
            </DialogDescription>
          </DialogHeader>

          {viewLoading ? (
            <div className="flex h-64 w-full items-center justify-center">
              <Spinner className="size-8 text-primary" />
            </div>
          ) : !activeOrder ? (
            <div className="rounded-lg border border-dashed bg-muted/20 py-12 text-center text-xs text-muted-foreground">
              Failed to load order detailed specifications.
            </div>
          ) : (
            <div className="flex flex-col gap-6 py-4 text-left">
              <div className="grid gap-4 rounded-lg border bg-muted/15 p-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Fulfillment Status Flow
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {FULFILLMENT_STEPS.map((st) => (
                      <Button
                        key={st}
                        variant={activeOrder.status === st ? "default" : "outline"}
                        size="xs"
                        onClick={() => handleUpdateStatus(st)}
                        disabled={updating}
                        className="h-auto py-1 text-[10px] font-bold uppercase"
                      >
                        {st}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Invoice Capture
                  </span>
                  <div className="flex gap-1.5">
                    {PAYMENT_STEPS.map((pst) => (
                      <Button
                        key={pst}
                        variant={activeOrder.payment_status === pst ? "default" : "outline"}
                        size="xs"
                        onClick={() => handleUpdatePaymentStatus(pst)}
                        disabled={updating}
                        className="h-auto py-1 text-[10px] font-bold uppercase"
                      >
                        {pst}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex flex-col gap-4 md:col-span-2">
                  <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Snapshotted Cart items
                  </h3>
                  <div className="flex flex-col gap-3">
                    {activeOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 rounded-lg border bg-card p-3 text-xs">
                        <img
                          src={item.image_url || "/placeholder-product.svg"}
                          alt={item.product_name}
                          className="size-12 rounded border bg-muted object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/placeholder-product.svg"
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-semibold text-foreground">{item.product_name}</div>
                          <div className="mt-0.5 text-[10px] text-muted-foreground">
                            {item.variant_size} / {item.variant_color}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-foreground">{formatPrice(item.subtotal)}</div>
                          <div className="mt-0.5 text-[10px] text-muted-foreground">
                            {item.quantity} x {formatPrice(item.unit_price)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 border-t border-border pt-4 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Line subtotal</span>
                      <span className="font-medium text-foreground">{formatPrice(activeOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fulfillment delivery shipping</span>
                      <span className="font-medium text-foreground">{formatPrice(activeOrder.shipping_fee)}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 text-sm font-bold">
                      <span className="text-foreground">Total Invoice</span>
                      <span className="text-primary">{formatPrice(activeOrder.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex h-fit flex-col gap-4 rounded-lg border bg-muted/10 p-4 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                      Fulfillment Consignee
                    </span>
                    <div className="font-bold text-foreground">{activeOrder.address.recipient_name}</div>
                    <div className="font-mono text-muted-foreground">{activeOrder.address.phone}</div>
                  </div>
                  <Separator className="my-1" />
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                      Delivery Destination
                    </span>
                    <div className="leading-relaxed text-foreground">
                      {activeOrder.address.address_line}, {activeOrder.address.city}, {activeOrder.address.province},{" "}
                      {activeOrder.address.postal_code}
                    </div>
                  </div>
                  {activeOrder.notes ? (
                    <>
                      <Separator className="my-1" />
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                          Consignee Delivery Instructions
                        </span>
                        <div className="leading-relaxed text-muted-foreground italic">"{activeOrder.notes}"</div>
                      </div>
                    </>
                  ) : null}
                  <Separator className="my-1" />
                  <div className="flex flex-col gap-1.5 text-[10px] font-medium text-muted-foreground">
                    <div>Placed: {formatDate(activeOrder.created_at)}</div>
                    {activeOrder.shipped_at && <div>Shipped: {formatDate(activeOrder.shipped_at)}</div>}
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
