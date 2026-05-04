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
        <CardTitle className="text-sm font-semibold tracking-tight text-foreground uppercase">Order Summary</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 text-left">
        <div className="flex flex-col gap-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
          {/* Subtotal row */}
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-mono font-semibold text-foreground">{formatPrice(subtotal)}</span>
          </div>

          {/* Shipping row */}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="animate-pulse font-semibold text-emerald-700">FREE</span>
          </div>
        </div>

        <Separator />

        {/* Grand Total row */}
        <div className="flex items-baseline justify-between text-foreground">
          <span className="text-xs font-bold tracking-wider uppercase">Total Cost</span>
          <span className="font-mono text-xl font-bold">{formatPrice(grandTotal)}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4">
        {/* Checkout CTA */}
        <Button onClick={onCheckout} size="lg" className="w-full">
          Proceed to Checkout
          <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={1.8} data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CartSummary
