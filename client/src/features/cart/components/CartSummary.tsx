import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { formatPrice } from "@/lib/utils"

type CartSummaryProps = {
  subtotal: number
  onCheckout: () => void
}

export const CartSummary = ({ subtotal, onCheckout }: CartSummaryProps) => {
  const shippingFee = 0
  const grandTotal = subtotal + shippingFee

  return (
    <Card className="border border-border/80 shadow-md">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-semibold tracking-tight text-foreground uppercase">
          Order Summary
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col gap-4 text-left">
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
            <span className="text-emerald-700 font-semibold animate-pulse">
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
      </CardContent>

      <CardFooter className="p-4">
        {/* Checkout CTA */}
        <Button
          onClick={onCheckout}
          size="lg"
          className="w-full"
        >
          Proceed to Checkout
          <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={1.8} data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CartSummary
