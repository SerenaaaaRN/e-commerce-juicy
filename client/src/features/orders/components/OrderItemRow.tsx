import { WriteReviewCta } from "./WriteReviewCta"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ORDER_STATUS } from "@/constants/orderStatus"
import { formatPrice } from "@/lib/utils"
import type { OrderItem } from "@/types"

type OrderItemRowProps = {
  item: OrderItem & { product_id?: string }
  orderId?: string
  orderStatus?: string
}

export const OrderItemRow = ({ item, orderId, orderStatus }: OrderItemRowProps) => {
  const showReviewButton = orderStatus === ORDER_STATUS.DELIVERED && orderId

  return (
    <div className="flex flex-col items-start justify-between gap-4 border-b border-border/40 py-4 text-left last:border-b-0 sm:flex-row sm:items-center">
      {/* Product Image & Specs Details */}
      <div className="flex flex-1 items-center gap-4">
        <div className="w-14">
          <AspectRatio ratio={3 / 4} className="overflow-hidden rounded border border-border/40 bg-muted">
            <img
              src={item.image_url || "/placeholder.webp"}
              alt={item.product_name}
              className="size-full object-cover object-center"
            />
          </AspectRatio>
        </div>

        <div className="flex flex-col gap-0.5">
          <h4 className="max-w-55 truncate text-sm font-semibold tracking-tight text-foreground">
            {item.product_name}
          </h4>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
            <span>Size: {item.variant_size}</span>
            <span>•</span>
            <span>Color: {item.variant_color}</span>
          </div>
          <span className="pt-0.5 font-mono text-xs font-semibold text-foreground sm:hidden">
            {item.quantity} x {formatPrice(item.unit_price)}
          </span>
          {showReviewButton && item.product_id && (
            <div className="pt-2 sm:hidden">
              <WriteReviewCta productId={item.product_id} orderId={orderId} productName={item.product_name} />
            </div>
          )}
        </div>
      </div>

      {/* Pricing column details */}
      <div className="flex w-full items-center justify-between gap-6 sm:w-auto sm:justify-end sm:gap-10">
        {showReviewButton && item.product_id && (
          <div className="hidden sm:block">
            <WriteReviewCta productId={item.product_id} orderId={orderId} productName={item.product_name} />
          </div>
        )}

        <div className="ml-auto flex items-center gap-6 sm:ml-0 sm:gap-10">
          <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
            {item.quantity} x {formatPrice(item.unit_price)}
          </span>

          <span className="min-w-25 text-right font-mono text-sm font-semibold text-foreground">
            {formatPrice(item.subtotal)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default OrderItemRow
