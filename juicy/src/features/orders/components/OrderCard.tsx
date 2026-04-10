import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn, formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor } from "@/lib/utils"
import type { Order } from "@/types"

type OrderCardProps = {
  order: Order
}

export const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <Card className="border border-border/80 shadow-sm relative hover:shadow-md transition-all duration-200">
      <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        
        {/* Info detail block */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-foreground">
              Order Reference #{order.order_number}
            </span>
            <Badge className={cn("font-bold text-[9px] uppercase px-1.5 py-0.5 border", getOrderStatusColor(order.status))}>
              {getOrderStatusLabel(order.status)}
            </Badge>
          </div>
          
          <span className="text-xs text-muted-foreground uppercase font-medium">
            Placed on {formatDate(order.created_at)}
          </span>
          
          <span className="text-xs font-mono font-bold text-foreground pt-1">
            Total Amount: {formatPrice(order.total)}
          </span>
        </div>

        {/* Action Link trigger */}
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="text-[10px] uppercase font-semibold h-9 cursor-pointer">
            <Link to={`/orders/${order.order_number}`}>
              Track Order
            </Link>
          </Button>
        </div>

      </CardContent>
    </Card>
  )
}

export default OrderCard
