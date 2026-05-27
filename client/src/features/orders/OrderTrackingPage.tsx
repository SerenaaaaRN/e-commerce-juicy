import { useState, useEffect } from "react"
import { useParams, Link, Navigate } from "react-router-dom"
import { ROUTES } from "@/constants/routes"
import { ORDER_STATUS, PAYMENT_STATUS } from "@/constants/orderStatus"
import { useCustomerAuthStore } from "@/stores/customerAuthStore"
import { OrderStatusTimeline } from "./components/OrderStatusTimeline"
import { OrderItemRow } from "./components/OrderItemRow"
import { ordersApi } from "@/lib/api/orders"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from "@/components/ui/empty"
import { HugeiconsIcon } from "@hugeicons/react"
import { ShoppingBag01Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { useConfirm } from "@/hooks/useConfirm"
import {
  cn,
  formatPrice,
  formatDate,
  getOrderStatusLabel,
  getOrderStatusColor,
  getPaymentStatusLabel,
} from "@/lib/utils"
import type { OrderDetail } from "@/types"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export const OrderTrackingPage = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>()
  const { isAuthenticated } = useCustomerAuthStore()

  // State
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [completing, setCompleting] = useState(false)
  const { confirm: confirmAction, dialog: confirmDialog } = useConfirm()

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) return
      setLoading(true)
      try {
        const res = await ordersApi.getOrderDetail(orderNumber)
        if (res.success && res.data) {
          setOrder(res.data)
        } else {
          toast.error(res.message || "Failed to load order tracking details.")
        }
      } catch {
        toast.error("Failed to retrieve order details.")
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderNumber])

  const handleCompleteOrder = async () => {
    const confirmed = await confirmAction(
      "Are you sure you want to confirm receipt of this order? This action cannot be undone."
    )
    if (!confirmed || !orderNumber) return

    setCompleting(true)
    try {
      const res = await ordersApi.completeOrder(orderNumber)
      if (res.success) {
        toast.success("Order marked as received. Thank you!")
        setOrder((prev) => (prev ? { ...prev, status: ORDER_STATUS.DELIVERED, payment_status: PAYMENT_STATUS.PAID } : null))
      } else {
        toast.error(res.message || "Failed to complete order.")
      }
    } catch {
      toast.error("Failed to complete order.")
    } finally {
      setCompleting(false)
    }
  }

  const handleCancelOrder = async () => {
    const confirmed = await confirmAction(
      "Are you sure you want to cancel this order? This action cannot be undone. Any paid amount will be refunded according to our policy."
    )
    if (!confirmed || !orderNumber) return

    setCancelling(true)
    try {
      const res = await ordersApi.cancelOrder(orderNumber)
      if (res.success) {
        toast.success("Order cancelled successfully.")
        setOrder((prev) => (prev ? { ...prev, status: ORDER_STATUS.CANCELLED } : null))
      } else {
        toast.error(res.message || "Failed to cancel order.")
      }
    } catch {
      toast.error("Failed to cancel order.")
    } finally {
      setCancelling(false)
    }
  }

  // Guest restriction redirect
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />
  }

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-20">
        <div className="flex flex-col items-center gap-4">
          <Spinner size={32} className="text-primary" />
          <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Locating Order Records...
          </span>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-20">
        <Empty className="max-w-md border-none bg-transparent">
          <EmptyHeader>
            <EmptyMedia
              variant="icon"
              className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/5 text-primary"
            >
              <HugeiconsIcon icon={ShoppingBag01Icon} strokeWidth={1.8} className="size-6 text-primary" />
            </EmptyMedia>
            <EmptyTitle className="text-2xl font-bold tracking-tight">Order File Not Found</EmptyTitle>
            <EmptyDescription className="mt-2 text-sm text-muted-foreground">
              We couldn't retrieve the specific checkout details for order reference: {orderNumber}.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="mt-6">
            <Button asChild variant="outline">
              <Link to={ROUTES.shop}>Back to Shop</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  const shippingAddress = order.address
  const subtotal = order.subtotal
  const shippingFee = order.shipping_fee
  const grandTotal = order.total

  return (
    <div className="bg-background py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb className="mb-8 text-left text-xs font-bold uppercase">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={ROUTES.home}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbPage className="font-bold text-primary">Order #{orderNumber}</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Order Header Card */}
        <Card className="mb-8 border border-border/80 shadow-md">
          <CardContent className="flex flex-col justify-between gap-6 p-6 text-left md:flex-row md:items-center md:p-8">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold tracking-wider text-primary uppercase">Order Tracking</span>
              <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
                Order Reference: #{order.order_number}
              </h1>
              <span className="mt-1 text-xs font-medium text-muted-foreground uppercase">
                Placed on {formatDate(order.created_at)}
              </span>
            </div>

            <div className="flex flex-col gap-2 md:items-end">
              <Badge
                className={cn(
                  "w-fit border px-3 py-1 text-center text-xs font-semibold uppercase",
                  getOrderStatusColor(order.status)
                )}
              >
                Status: {getOrderStatusLabel(order.status)}
              </Badge>
              <Badge
                variant="outline"
                className="w-fit border-border px-3 py-1 text-center text-[10px] font-semibold uppercase"
              >
                Payment: {getPaymentStatusLabel(order.payment_status)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Details Layout split grid */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Main Info Tracking Column */}
          <div className="flex w-full flex-col gap-8 lg:col-span-8">
            {/* Visual Milestones timeline */}
            <Card className="border border-border/80 shadow-md">
              <CardContent className="p-6">
                <OrderStatusTimeline status={order.status} />
              </CardContent>
            </Card>

            {/* List of Purchased Items */}
            <Card className="border border-border/80 shadow-md">
              <CardHeader className="pb-0">
                <CardTitle className="text-left text-sm font-semibold tracking-tight text-foreground uppercase">
                  Itemized Silhouette Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col pt-4">
                <div className="flex flex-col">
                  {order.items.map((item, index) => (
                    <OrderItemRow
                      key={`${item.product_name}-${item.variant_size}-${item.variant_color}-${index}`}
                      item={item}
                      orderId={order.id}
                      orderStatus={order.status}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery & Shipping Info Sidebar Column */}
          <div className="flex w-full flex-col gap-6 text-left lg:col-span-4">
            {/* Delivery address card */}
            <Card className="border border-border/80 shadow-md">
              <CardHeader className="pb-0">
                <CardTitle className="text-sm font-semibold tracking-tight text-foreground uppercase">
                  Shipping Destination
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 pt-4">
                {shippingAddress ? (
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="text-sm font-bold text-foreground">{shippingAddress.recipient_name}</span>
                    <span className="pt-1 font-sans leading-relaxed text-muted-foreground">
                      {shippingAddress.address_line}, {shippingAddress.city}, {shippingAddress.province},{" "}
                      {shippingAddress.postal_code}
                    </span>
                    <span className="pt-1.5 font-mono font-medium text-foreground">
                      Contact: {shippingAddress.phone}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs tracking-wider text-muted-foreground uppercase">
                    No destination address specified.
                  </span>
                )}
              </CardContent>
            </Card>

            {/* Financial totals Card */}
            <Card className="border border-border/80 shadow-md">
              <CardHeader className="pb-0">
                <CardTitle className="text-sm font-semibold tracking-tight text-foreground uppercase">
                  Pricing Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 pt-4">
                <div className="flex flex-col gap-2.5 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono font-semibold text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span className="font-mono font-semibold text-foreground">{formatPrice(shippingFee)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-baseline justify-between pt-1 text-foreground">
                  <span className="text-xs font-bold tracking-wider uppercase">Total Settled</span>
                  <span className="font-mono text-xl font-bold">{formatPrice(grandTotal)}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              {/* Confirm received action */}
              <Button size="lg" onClick={handleCompleteOrder} disabled={completing}>
                {completing ? (
                  <>
                    <Spinner data-icon="inline-start" />
                    "Confirming..."
                  </>
                ) : (
                  "Confirm Received"
                )}
              </Button>

              {/* Cancel order action */}
              {(order.status === ORDER_STATUS.PENDING || order.status === ORDER_STATUS.CONFIRMED) && (
                <Button variant="destructive" size="lg" onClick={handleCancelOrder} disabled={cancelling}>
                  {cancelling && <Spinner data-icon="inline-start" />}
                  {cancelling ? "Cancelling..." : "Cancel Order"}
                </Button>
              )}
              <Button asChild variant="outline" size="lg">
                <Link to={ROUTES.shop}>Return to Shop</Link>
              </Button>
            </div>

            {confirmDialog}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderTrackingPage
