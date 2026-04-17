import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"

type CartSummaryProps = {
  subtotal: number
  onCheckout: () => void
}

export const CartSummary = ({ subtotal, onCheckout }: CartSummaryProps) => {

  // Shipping cost placeholder details (COD MVP stub)
  const shippingFee = 0 // Free Shipping for first release
  const grandTotal = subtotal + shippingFee

  return (
    <Card className="border border-border/80 shadow-md">
      <CardContent className="p-6 flex flex-col gap-5 text-left">
        
        <h3 className="text-sm font-semibold tracking-tight text-foreground uppercase">
          Order Summary
        </h3>
        
        <Separator />

        <div className="flex flex-col gap-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">
          
          {/* Subtotal row */}
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-mono text-foreground font-semibold">
              {formatPrice(subtotal)}
            </span>
          </div>

          {/* Shipping row */}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-emerald-700 font-semibold">
              FREE
            </span>
          </div>

        </div>

        <Separator />

        {/* Grand Total row */}
        <div className="flex justify-between items-baseline text-foreground">
          <span className="text-xs uppercase tracking-wider font-bold">Total Cost</span>
          <span className="text-xl font-bold font-mono">
            {formatPrice(grandTotal)}
          </span>
        </div>

        {/* Checkout CTA */}
        <Button
          onClick={onCheckout}
          className="w-full font-medium uppercase tracking-widest text-xs py-6 h-auto cursor-pointer transition-transform hover:scale-[1.01] active:scale-95 duration-200 mt-2"
        >
          Proceed to Checkout
        </Button>

      </CardContent>
    </Card>
  )
}

export default CartSummary
