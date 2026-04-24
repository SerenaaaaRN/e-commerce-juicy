import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
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
        <div className="flex flex-col max-h-72 overflow-y-auto pr-1 scrollbar-thin">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 py-3 border-b border-border/40 last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-12">
                  <AspectRatio ratio={3 / 4} className="overflow-hidden bg-muted rounded border border-border/40">
                    <img
                      src={item.image_url || "/placeholder.webp"}
                      alt={item.product_name}
                      className="size-full object-cover object-center"
                    />
                  </AspectRatio>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-foreground truncate max-w-[150px]">
                    {item.product_name}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase font-medium">
                    {item.variant_size} / {item.variant_color}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">
                    Qty: {item.quantity}
                  </span>
                </div>
              </div>
              
              <span className="text-xs font-mono font-semibold text-foreground">
                {formatPrice(item.subtotal)}
              </span>
            </div>
          ))}
        </div>

        <Separator />

        {/* Pricing calculations breakdown */}
        <div className="flex flex-col gap-2.5 text-xs text-muted-foreground uppercase tracking-wider font-medium">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-mono text-foreground font-semibold">
              {formatPrice(subtotal)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-emerald-700 font-semibold animate-pulse">FREE</span>
          </div>
        </div>

        <Separator />

        {/* Final Order Total */}
        <div className="flex justify-between items-baseline text-foreground">
          <span className="text-xs uppercase tracking-wider font-bold">Total Due</span>
          <span className="text-lg font-bold font-mono">
            {formatPrice(grandTotal)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export default OrderSummary
