import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { DeliveryTruck02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type PaymentSelectorProps = {
  selectedPaymentMethod: string
  onSelectPaymentMethod: (method: string) => void
}

export const PaymentSelector = ({ selectedPaymentMethod, onSelectPaymentMethod }: PaymentSelectorProps) => {
  return (
    <div className="flex w-full flex-col gap-4 border-t border-border/60 pt-4 text-left">
      <h3 className="text-sm font-semibold tracking-tight text-foreground uppercase">Payment Method</h3>

      <ToggleGroup
        type="single"
        variant="outline"
        value={selectedPaymentMethod}
        onValueChange={(val) => val && onSelectPaymentMethod(val)}
        className="flex w-full flex-col items-stretch gap-2"
      >
        <ToggleGroupItem
          value="cod"
          className="flex h-auto w-full cursor-pointer items-center justify-start gap-3 rounded-md border p-5 text-left transition-all hover:bg-muted/50 data-[state=on]:border-primary data-[state=on]:bg-accent/40"
        >
          <HugeiconsIcon icon={DeliveryTruck02Icon} strokeWidth={1.8} />
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-foreground">Cash on Delivery (COD)</span>
            <span className="font-sans text-xs text-muted-foreground">
              Pay with cash upon delivery at your shipping address. (Stubbed MVP payment option)
            </span>
          </div>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

export default PaymentSelector
