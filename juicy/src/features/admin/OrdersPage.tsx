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
import type { Order, OrderDetail, OrderStatus, PaymentStatus } from "@/types"

// Fallback lists for offline sandbox demos
const fallbackOrders: Order[] = [
  {
    id: "ord_1",
    order_number: "JUICY-20260525-9A4F81",
    status: "pending",
    payment_status: "unpaid",
    total: 128000,
    item_count: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "ord_2",
    order_number: "JUICY-20260524-7C9E43",
    status: "shipped",
    payment_status: "paid",
    total: 224000,
    item_count: 3,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "ord_3",
    order_number: "JUICY-20260522-3B2D45",
    status: "delivered",
    payment_status: "paid",
    total: 310000,
    item_count: 4,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  }
]

const fallbackOrderDetails: Record<string, OrderDetail> = {
  "ord_1": {
    id: "ord_1",
    order_number: "JUICY-20260525-9A4F81",
    customer_id: "cust_1",
    status: "pending",
    payment_status: "unpaid",
    subtotal: 128000,
    shipping_fee: 15000,
    total: 143000,
    notes: "Leave package at the front porch table, please call upon arrival.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    address: {
      id: "addr_1",
      label: "Apartment",
      recipient_name: "Alexandra Sterling",
      phone: "+628123456789",
      address_line: "Pakuwon Tower Unit 24B, Casablanca St Kav 88",
      city: "South Jakarta",
      province: "DKI Jakarta",
      postal_code: "12870",
      is_default: true,
    },
    items: [
      { id: "oi_1", order_id: "ord_1", product_name: "Crimson Beet Cleanse", variant_size: "250ml", variant_color: "Beet Red", image_url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200", quantity: 2, unit_price: 48000, subtotal: 96000 },
      { id: "oi_2", order_id: "ord_1", product_name: "Golden Ginger Defense", variant_size: "60ml", variant_color: "Turmeric Yellow", image_url: "https://images.unsplash.com/photo-1610970881699-44a5587caaec?auto=format&fit=crop&q=80&w=200", quantity: 1, unit_price: 32000, subtotal: 32000 }
    ]
  },
  "ord_2": {
    id: "ord_2",
    order_number: "JUICY-20260524-7C9E43",
    customer_id: "cust_2",
    status: "shipped",
    payment_status: "paid",
    subtotal: 209000,
    shipping_fee: 15000,
    total: 224000,
    shipped_at: new Date(Date.now() - 40000000).toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 40000000).toISOString(),
    address: {
      id: "addr_2",
      label: "Home Office",
      recipient_name: "Jonathan Wright",
      phone: "+628198765432",
      address_line: "Bukit Dago Blok D12 No 4, Pamulang St",
      city: "Tangerang Selatan",
      province: "Banten",
      postal_code: "15414",
      is_default: true,
    },
    items: [
      { id: "oi_3", order_id: "ord_2", product_name: "Crimson Beet Cleanse", variant_size: "500ml", variant_color: "Beet Red", image_url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200", quantity: 3, unit_price: 66000, subtotal: 198000 }
    ]
  },
  "ord_3": {
    id: "ord_3",
    order_number: "JUICY-20260522-3B2D45",
    customer_id: "cust_3",
    status: "delivered",
    payment_status: "paid",
    subtotal: 295000,
    shipping_fee: 15000,
    total: 310000,
    shipped_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    delivered_at: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    address: {
      id: "addr_3",
      label: "Main Residence",
      recipient_name: "Eleanor Vance",
      phone: "+628177228833",
      address_line: "Pondok Indah Townhouse A-8, Metro St",
      city: "South Jakarta",
      province: "DKI Jakarta",
      postal_code: "12310",
      is_default: true,
    },
    items: [
      { id: "oi_4", order_id: "ord_3", product_name: "Crimson Beet Cleanse", variant_size: "250ml", variant_color: "Beet Red", image_url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200", quantity: 4, unit_price: 48000, subtotal: 192000 }
    ]
  }
}

export const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  // Filters state
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  // Details dialog state
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [activeOrder, setActiveOrder] = useState<OrderDetail | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  // Submitting statuses state
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const res = await adminApi.getOrders()
      if (res.success && res.data) {
        setOrders(res.data)
      } else {
        setOrders(fallbackOrders)
        setUsingFallback(true)
      }
    } catch {
      setOrders(fallbackOrders)
      setUsingFallback(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // View order details
  const handleViewDetails = async (orderId: string) => {
    try {
      setLoadingDetails(true)
      setActiveOrder(null)
      setDetailsOpen(true)

      if (usingFallback) {
        setActiveOrder(fallbackOrderDetails[orderId] || null)
      } else {
        const res = await adminApi.getOrderDetail(orderId)
        if (res.success && res.data) {
          setActiveOrder(res.data)
        } else {
          setActiveOrder(fallbackOrderDetails[orderId] || null)
        }
      }
    } catch {
      setActiveOrder(fallbackOrderDetails[orderId] || null)
    } finally {
      setLoadingDetails(false)
    }
  }

  // Update order status
  const handleUpdateStatus = async (status: OrderStatus) => {
    if (!activeOrder) return
    setUpdatingStatus(true)
    try {
      if (usingFallback) {
        const updatedDetail = { ...activeOrder, status }
        setActiveOrder(updatedDetail)
        setOrders(orders.map((o) => (o.id === activeOrder.id ? { ...o, status } : o)))
        toast.success(`Fulfillment status updated to: ${status} (Mocked)`)
      } else {
        const res = await adminApi.updateOrderStatus(activeOrder.id, status)
        if (res.success) {
          toast.success(`Fulfillment status updated to: ${status}`)
          const updatedDetail = { ...activeOrder, status }
          setActiveOrder(updatedDetail)
          loadData()
        } else {
          toast.error(res.message || "Failed to update order status.")
        }
      }
    } catch {
      toast.error("Failed to update status workflow.")
    } finally {
      setUpdatingStatus(false)
    }
  }

  // Update payment status
  const handleUpdatePaymentStatus = async (paymentStatus: PaymentStatus) => {
    if (!activeOrder) return
    setUpdatingStatus(true)
    try {
      if (usingFallback) {
        const updatedDetail = { ...activeOrder, payment_status: paymentStatus }
        setActiveOrder(updatedDetail)
        setOrders(orders.map((o) => (o.id === activeOrder.id ? { ...o, payment_status: paymentStatus } : o)))
        toast.success(`Payment status marked as: ${paymentStatus} (Mocked)`)
      } else {
        const res = await adminApi.updateOrderPaymentStatus(activeOrder.id, paymentStatus)
        if (res.success) {
          toast.success(`Payment status marked as: ${paymentStatus}`)
          const updatedDetail = { ...activeOrder, payment_status: paymentStatus }
          setActiveOrder(updatedDetail)
          loadData()
        } else {
          toast.error(res.message || "Failed to update payment status.")
        }
      }
    } catch {
      toast.error("Failed to transition payment status.")
    } finally {
      setUpdatingStatus(false)
    }
  }

  // Badge stylings
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-500/30 bg-yellow-500/5">Pending</Badge>
      case "confirmed":
        return <Badge variant="outline" className="text-blue-600 border-blue-500/30 bg-blue-500/5">Confirmed</Badge>
      case "processing":
        return <Badge variant="outline" className="text-purple-600 border-purple-500/30 bg-purple-500/5">Processing</Badge>
      case "shipped":
        return <Badge variant="outline" className="text-indigo-600 border-indigo-500/30 bg-indigo-500/5">Shipped</Badge>
      case "delivered":
        return <Badge variant="outline" className="text-green-600 border-green-500/30 bg-green-500/5">Delivered</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentBadge = (status: PaymentStatus) => {
    switch (status) {
      case "unpaid":
        return <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/5">Unpaid</Badge>
      case "paid":
        return <Badge variant="outline" className="text-green-600 border-green-500/30 bg-green-500/5">Paid</Badge>
      case "refunded":
        return <Badge variant="outline" className="text-orange-600 border-orange-500/30 bg-orange-500/5">Refunded</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Filtering
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.order_number.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "" || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
      
      {/* Header block */}
      <div>
        <h1 className="text-3xl font-heading font-extrabold tracking-tight text-foreground">
          Fulfillment Registry
        </h1>
        <p className="text-xs text-muted-foreground">
          Monitor incoming customer orders, manage daily shipments tracking, and capture direct invoice payments.
        </p>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card border border-border/60 p-4 rounded-lg shadow-sm">
        
        {/* Search */}
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

        {/* Status Selection */}
        <div className="w-full sm:max-w-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Fulfillment Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

      </div>

      {/* Orders Table */}
      <div className="border border-border/60 rounded-lg bg-card overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-muted/40 font-bold border-b border-border">
            <tr>
              <th className="px-6 py-4">Invoice ID</th>
              <th className="px-6 py-4">Fulfillment Status</th>
              <th className="px-6 py-4">Invoice Payment</th>
              <th className="px-6 py-4">Ordered Items</th>
              <th className="px-6 py-4">Invoice Amount</th>
              <th className="px-6 py-4">Ordered At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                  No boutique orders found matching your search.
                </td>
              </tr>
            ) : (
              filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-muted/20 transition-colors">
                  
                  {/* Order Number */}
                  <td className="px-6 py-4 font-mono font-bold text-foreground">
                    {o.order_number}
                  </td>

                  {/* Status badge */}
                  <td className="px-6 py-4">
                    {getStatusBadge(o.status)}
                  </td>

                  {/* Payment status badge */}
                  <td className="px-6 py-4">
                    {getPaymentBadge(o.payment_status)}
                  </td>

                  {/* Item count */}
                  <td className="px-6 py-4 font-medium text-muted-foreground">
                    {o.item_count || 0} unit(s)
                  </td>

                  {/* Total */}
                  <td className="px-6 py-4 font-bold text-foreground">
                    {formatPrice(o.total)}
                  </td>

                  {/* Ordered date */}
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {formatDate(o.created_at)}
                  </td>

                  {/* Inspect Details trigger */}
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(o.id)} className="cursor-pointer">
                      Fulfill Order
                    </Button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- FULFILLMENT ORDER DETAIL DIALOG --- */}
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

          {loadingDetails ? (
            <div className="flex h-64 w-full items-center justify-center">
              <Spinner className="size-8 text-primary" />
            </div>
          ) : !activeOrder ? (
            <div className="text-center py-12 text-xs text-muted-foreground border border-dashed rounded-lg bg-muted/20">
              Failed to load order detailed specifications.
            </div>
          ) : (
            <div className="text-left py-4 flex flex-col gap-6">
              
              {/* Status and payment controls rows */}
              <div className="grid gap-4 sm:grid-cols-2 bg-muted/15 border p-4 rounded-lg">
                
                {/* Fulfillment Status controller */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Fulfillment Status Flow</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {(["pending", "confirmed", "processing", "shipped", "delivered"] as OrderStatus[]).map((st) => (
                      <Button
                        key={st}
                        variant={activeOrder.status === st ? "default" : "outline"}
                        size="xs"
                        onClick={() => handleUpdateStatus(st)}
                        disabled={updatingStatus}
                        className="text-[10px] uppercase font-bold py-1 h-auto cursor-pointer"
                      >
                        {st}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Payment controller */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Invoice Capture</span>
                  <div className="flex gap-1.5">
                    {(["unpaid", "paid", "refunded"] as PaymentStatus[]).map((pst) => (
                      <Button
                        key={pst}
                        variant={activeOrder.payment_status === pst ? "default" : "outline"}
                        size="xs"
                        onClick={() => handleUpdatePaymentStatus(pst)}
                        disabled={updatingStatus}
                        className="text-[10px] uppercase font-bold py-1 h-auto cursor-pointer"
                      >
                        {pst}
                      </Button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Two column detail panels */}
              <div className="grid gap-6 md:grid-cols-3">
                
                {/* Left side: Items list */}
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

                  {/* Summary math */}
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

                {/* Right side: client and shipping address */}
                <div className="flex flex-col gap-4 bg-muted/10 p-4 rounded-lg border h-fit text-xs">
                  
                  {/* Recipient info */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Fulfillment Consignee</span>
                    <div className="font-bold text-foreground">{activeOrder.address.recipient_name}</div>
                    <div className="text-muted-foreground font-mono">{activeOrder.address.phone}</div>
                  </div>

                  <hr className="border-border/60 my-1" />

                  {/* Address info */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Delivery Destination ({activeOrder.address.label})</span>
                    <div className="text-foreground leading-relaxed">
                      {activeOrder.address.address_line}, {activeOrder.address.city}, {activeOrder.address.province}, {activeOrder.address.postal_code}
                    </div>
                  </div>

                  {activeOrder.notes && (
                    <>
                      <hr className="border-border/60 my-1" />
                      {/* Notes info */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Consignee Delivery Instructions</span>
                        <div className="text-muted-foreground italic leading-relaxed">
                          "{activeOrder.notes}"
                        </div>
                      </div>
                    </>
                  )}

                  <hr className="border-border/60 my-1" />

                  {/* Dates tracker */}
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
              <Button type="button" className="cursor-pointer">Close Registry</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default OrdersPage
