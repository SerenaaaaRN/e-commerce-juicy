import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { HugeiconsIcon } from "@hugeicons/react"
import { DeliveryTruck02Icon } from "@hugeicons/core-free-icons"

type PaymentSelectorProps = {
  selectedPaymentMethod: string
  onSelectPaymentMethod: (method: string) => void
}

export const PaymentSelector = ({
  selectedPaymentMethod,
  onSelectPaymentMethod,
}: PaymentSelectorProps) => {
  return (
    <div className="flex flex-col gap-4 text-left w-full pt-4 border-t border-border/60">
      
      <h3 className="text-sm font-semibold tracking-tight text-foreground uppercase">
        Payment Method
      </h3>

      <ToggleGroup
        type="single"
        variant="outline"
        value={selectedPaymentMethod}
        onValueChange={(val) => val && onSelectPaymentMethod(val)}
        className="flex flex-col gap-2 items-stretch w-full"
      >
        <ToggleGroupItem
          value="cod"
          className="p-5 h-auto justify-start text-left flex items-center gap-3 w-full border cursor-pointer hover:bg-muted/50 data-[state=on]:bg-accent/40 data-[state=on]:border-primary transition-all rounded-md"
        >
          <HugeiconsIcon icon={DeliveryTruck02Icon} strokeWidth={1.8} />
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-sm text-foreground">
              Cash on Delivery (COD)
            </span>
            <span className="text-xs text-muted-foreground font-sans">
              Pay with cash upon delivery at your shipping address. (Stubbed MVP payment option)
            </span>
          </div>
        </ToggleGroupItem>
      </ToggleGroup>

    </div>
  )
}

export default PaymentSelector
