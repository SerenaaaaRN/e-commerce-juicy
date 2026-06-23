import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn, formatDate, formatPrice } from "@/lib/utils"
import { getOrderStatusColor, getOrderStatusLabel } from "@/constants/order-status"
import type { Order } from "@/types"
import { Link } from "react-router-dom"

type OrderCardProps = {
  order: Order
}

export const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <Card className="relative border border-border/80 shadow-sm transition-all duration-200 hover:shadow-md">
      <CardContent className="flex flex-col justify-between gap-4 p-5 text-left md:flex-row md:items-center">
        {/* Info detail block */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-foreground">Order Reference #{order.order_number}</span>
            <Badge
              className={cn("border px-1.5 py-0.5 text-[9px] font-bold uppercase", getOrderStatusColor(order.status))}
            >
              {getOrderStatusLabel(order.status)}
            </Badge>
          </div>

          <span className="text-xs font-medium text-muted-foreground uppercase">
            Placed on {formatDate(order.created_at)}
          </span>

          <span className="pt-1 font-mono text-xs font-bold text-foreground">
            Total Amount: {formatPrice(order.total)}
          </span>
        </div>

        {/* Action Link trigger */}
        <div className="flex gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 cursor-pointer text-[10px] font-semibold uppercase"
          >
            <Link to={`/orders/${order.order_number}`}>Track Order</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default OrderCard
