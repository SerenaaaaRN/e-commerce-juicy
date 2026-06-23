import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import type { CartItem } from "@/types"

type OrderSummaryProps = {
  items: CartItem[]
  subtotal: number
}

export const OrderSummary = ({ items, subtotal }: OrderSummaryProps) => {
  const shippingFee = 0
  const grandTotal = subtotal + shippingFee

  return (
    <Card className="border border-border/80 shadow-md">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-semibold tracking-tight text-foreground uppercase">
          Review Silhouettes
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-5 text-left">
        {/* Purchase Items List */}
        <div className="flex max-h-72 scrollbar-thin flex-col overflow-y-auto pr-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 border-b border-border/40 py-3 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-12">
                  <div className="aspect-3/4 overflow-hidden rounded border border-border/40 bg-muted">
                    <img
                      src={item.image_url || "/placeholder.webp"}
                      alt={item.product_name}
                      className="size-full object-cover object-center"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="max-w-37.5 truncate text-xs font-semibold text-foreground">{item.product_name}</span>
                  <span className="text-[10px] font-medium text-muted-foreground uppercase">
                    {item.variant_size} / {item.variant_color}
                  </span>
                  <span className="mt-0.5 text-[10px] text-muted-foreground">Qty: {item.quantity}</span>
                </div>
              </div>

              <span className="font-mono text-xs font-semibold text-foreground">{formatPrice(item.subtotal)}</span>
            </div>
          ))}
        </div>

        <Separator />

        {/* Pricing calculations breakdown */}
        <div className="flex flex-col gap-2.5 text-xs font-medium tracking-wider text-muted-foreground uppercase">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-mono font-semibold text-foreground">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="animate-pulse font-semibold text-emerald-700">FREE</span>
          </div>
        </div>

        <Separator />

        {/* Final Order Total */}
        <div className="flex items-baseline justify-between text-foreground">
          <span className="text-xs font-bold tracking-wider uppercase">Total Due</span>
          <span className="font-mono text-lg font-bold">{formatPrice(grandTotal)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default OrderSummary
