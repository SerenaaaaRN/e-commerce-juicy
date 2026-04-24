import { useState, useEffect } from "react"
import { useParams, Link, Navigate } from "react-router-dom"
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
import { cn, formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor, getPaymentStatusLabel } from "@/lib/utils"
import type { OrderDetail } from "@/types"

export const OrderTrackingPage = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>()
  const { isAuthenticated } = useCustomerAuthStore()

  // State
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)

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

  // Guest restriction redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center py-20 px-4">
        <div className="flex flex-col items-center gap-4">
          <Spinner size={32} className="text-primary" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            Locating Order Records...
          </span>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center py-20 px-4">
        <Empty className="border-none max-w-md bg-transparent">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-primary/5 text-primary size-12 rounded-full mb-3 flex items-center justify-center">
              <HugeiconsIcon icon={ShoppingBag01Icon} strokeWidth={1.8} className="size-6 text-primary" />
            </EmptyMedia>
            <EmptyTitle className="text-2xl font-bold tracking-tight">
              Order File Not Found
            </EmptyTitle>
            <EmptyDescription className="text-sm text-muted-foreground mt-2">
              We couldn't retrieve the specific checkout details for order reference: {orderNumber}.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="mt-6">
            <Button asChild variant="outline">
              <Link to="/shop">Back to Shop</Link>
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
        
        {/* Navigation Breadcrumb trail */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8 text-left uppercase tracking-widest font-semibold">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground truncate">Order #{orderNumber}</span>
        </div>

        {/* Order Header Card */}
        <Card className="border border-border/80 shadow-md mb-8">
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
            
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                Order Tracking
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground font-heading">
                Order Reference: #{order.order_number}
              </h1>
              <span className="text-xs text-muted-foreground uppercase font-medium mt-1">
                Placed on {formatDate(order.created_at)}
              </span>
            </div>

            <div className="flex flex-col md:items-end gap-2">
              <Badge className={cn("font-semibold text-xs uppercase px-3 py-1 text-center w-fit border", getOrderStatusColor(order.status))}>
                Status: {getOrderStatusLabel(order.status)}
              </Badge>
              <Badge variant="outline" className="font-semibold text-[10px] uppercase px-3 py-1 text-center w-fit border-border">
                Payment: {getPaymentStatusLabel(order.payment_status)}
              </Badge>
            </div>

          </CardContent>
        </Card>

        {/* Details Layout split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Info Tracking Column */}
          <div className="lg:col-span-8 flex flex-col gap-8 w-full">
            
            {/* Visual Milestones timeline */}
            <Card className="border border-border/80 shadow-md">
              <CardContent className="p-6">
                <OrderStatusTimeline status={order.status} />
              </CardContent>
            </Card>

            {/* List of Purchased Items */}
            <Card className="border border-border/80 shadow-md">
              <CardHeader className="pb-0">
                <CardTitle className="text-sm font-semibold tracking-tight text-foreground uppercase text-left">
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
          <div className="lg:col-span-4 flex flex-col gap-6 w-full text-left">
            
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
                    <span className="font-bold text-sm text-foreground">
                      {shippingAddress.recipient_name}
                    </span>
                    <span className="text-muted-foreground leading-relaxed pt-1 font-sans">
                      {shippingAddress.address_line}, {shippingAddress.city}, {shippingAddress.province}, {shippingAddress.postal_code}
                    </span>
                    <span className="font-mono font-medium text-foreground pt-1.5">
                      Contact: {shippingAddress.phone}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
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
                <div className="flex flex-col gap-2.5 text-xs text-muted-foreground uppercase tracking-wider font-medium">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-foreground font-semibold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span className="font-mono text-foreground font-semibold">
                      {formatPrice(shippingFee)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-baseline text-foreground pt-1">
                  <span className="text-xs uppercase tracking-wider font-bold">Total Settled</span>
                  <span className="text-xl font-bold font-mono">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Back action */}
            <div className="pt-2">
              <Button asChild variant="outline" className="w-full uppercase tracking-wider text-xs py-5 h-auto cursor-pointer">
                <Link to="/shop">Return to Shop</Link>
              </Button>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default OrderTrackingPage
