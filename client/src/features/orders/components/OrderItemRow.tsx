import { WriteReviewCta } from "./WriteReviewCta"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { formatPrice } from "@/lib/utils"
import type { OrderItem } from "@/types"

type OrderItemRowProps = {
  item: OrderItem & { product_id?: string }
  orderId?: string
  orderStatus?: string
}

export const OrderItemRow = ({ item, orderId, orderStatus }: OrderItemRowProps) => {
  const showReviewButton = orderStatus === "delivered" && orderId

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-border/40 last:border-b-0 text-left">
      
      {/* Product Image & Specs Details */}
      <div className="flex items-center gap-4 flex-1">
        <div className="w-14">
          <AspectRatio ratio={3 / 4} className="overflow-hidden bg-muted rounded border border-border/40">
            <img
              src={item.image_url || "/placeholder.webp"}
              alt={item.product_name}
              className="size-full object-cover object-center"
            />
          </AspectRatio>
        </div>

        <div className="flex flex-col gap-0.5">
          <h4 className="text-sm font-semibold tracking-tight text-foreground truncate max-w-[220px]">
            {item.product_name}
          </h4>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground uppercase font-medium">
            <span>Size: {item.variant_size}</span>
            <span>•</span>
            <span>Color: {item.variant_color}</span>
          </div>
          <span className="text-xs font-mono font-semibold text-foreground pt-0.5 sm:hidden">
            {item.quantity} x {formatPrice(item.unit_price)}
          </span>
          {showReviewButton && item.product_id && (
            <div className="pt-2 sm:hidden">
              <WriteReviewCta
                productId={item.product_id}
                orderId={orderId}
                productName={item.product_name}
              />
            </div>
          )}
        </div>
      </div>

      {/* Pricing column details */}
      <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10 w-full sm:w-auto">
        
        {showReviewButton && item.product_id && (
          <div className="hidden sm:block">
            <WriteReviewCta
              productId={item.product_id}
              orderId={orderId}
              productName={item.product_name}
            />
          </div>
        )}

        <div className="flex items-center gap-6 sm:gap-10 ml-auto sm:ml-0">
          <span className="text-xs text-muted-foreground font-mono hidden sm:inline">
            {item.quantity} x {formatPrice(item.unit_price)}
          </span>

          <span className="text-sm font-mono font-semibold text-foreground min-w-[100px] text-right">
            {formatPrice(item.subtotal)}
          </span>
        </div>

      </div>

    </div>
  )
}

export default OrderItemRow
