import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type CartSummaryProps = {
  subtotal: number
  onCheckout: () => void
}

export const CartSummary = ({ subtotal, onCheckout }: CartSummaryProps) => {
  const shippingFee = 0
  const grandTotal = subtotal + shippingFee

  return (
    <Card className="rounded-none border border-border shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="font-serif text-xl text-foreground">Order Summary</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 text-left">
        <div className="flex flex-col gap-3 text-sm tracking-wide text-muted-foreground">
          {/* Subtotal row */}
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-foreground">{formatPrice(subtotal)}</span>
          </div>

          {/* Shipping row */}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-emerald-700">Complimentary</span>
          </div>
        </div>

        <Separator />

        {/* Grand Total row */}
        <div className="flex items-baseline justify-between text-foreground">
          <span className="font-serif text-lg">Total Cost</span>
          <span className="text-xl tracking-wide">{formatPrice(grandTotal)}</span>
        </div>
      </CardContent>

      <CardFooter className="p-6">
        {/* Checkout CTA */}
        <Button
          onClick={onCheckout}
          size="lg"
          className="group w-full rounded-none text-xs tracking-[0.15em] uppercase hover:bg-foreground/90"
        >
          Proceed to Checkout
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            strokeWidth={1.5}
            className="ml-2 transition-transform group-hover:translate-x-1"
          />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CartSummary
