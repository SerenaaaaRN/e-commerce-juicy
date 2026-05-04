import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { formatPrice } from "@/lib/utils"
import type { CartItem as CartItemType } from "@/types"

type CartItemProps = {
  item: CartItemType
  onUpdateQty: (itemId: string, qty: number) => void
  onRemove: (itemId: string) => void
}

export const CartItem = ({ item, onUpdateQty, onRemove }: CartItemProps) => {
  const handleQtyChange = (val: string) => {
    const parsed = parseInt(val, 10)
    if (!isNaN(parsed) && parsed > 0) {
      onUpdateQty(item.id, parsed)
    }
  }

  return (
    <div className="flex flex-col items-start justify-between gap-4 py-6 text-left sm:flex-row sm:items-center">
      {/* Product Image & Info Details */}
      <div className="flex flex-1 items-center gap-4">
        <div className="w-20">
          <AspectRatio ratio={3 / 4} className="overflow-hidden rounded-md border border-border/60 bg-muted">
            <img
              src={item.image_url || "/placeholder.webp"}
              alt={item.product_name}
              className="size-full object-cover object-center"
            />
          </AspectRatio>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="max-w-50 truncate text-sm font-semibold tracking-tight text-foreground">
            {item.product_name}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
            {item.variant_size && <span>Size: {item.variant_size}</span>}
            {item.variant_size && item.variant_color && <span>•</span>}
            {item.variant_color && <span>Color: {item.variant_color}</span>}
          </div>
          <span className="pt-1 font-mono text-xs font-semibold text-foreground sm:hidden">
            {formatPrice(item.unit_price)}
          </span>
        </div>
      </div>

      {/* Stepper, Subtotal, and Actions column */}
      <div className="flex w-full items-center justify-between gap-6 sm:w-auto sm:justify-end">
        {/* Stepper selection layout */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdateQty(item.id, Math.max(item.quantity - 1, 1))}
            disabled={item.quantity <= 1}
            className="size-8 cursor-pointer rounded-md"
          >
            -
          </Button>
          <Input
            type="number"
            value={item.quantity}
            onChange={(e) => handleQtyChange(e.target.value)}
            className="h-8 w-12 rounded-md p-0 text-center font-mono text-xs font-semibold"
            min={1}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdateQty(item.id, item.quantity + 1)}
            className="size-8 cursor-pointer rounded-md"
          >
            +
          </Button>
        </div>

        {/* Item Total (Price * Qty) */}
        <div className="hidden min-w-25 flex-col items-end gap-0.5 text-right sm:flex">
          <span className="font-mono text-sm font-semibold text-foreground">{formatPrice(item.subtotal)}</span>
          {item.quantity > 1 ? (
            <span className="font-mono text-[10px] font-medium text-muted-foreground">
              {formatPrice(item.unit_price)} each
            </span>
          ) : null}
        </div>

        {/* Delete Trigger */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item.id)}
          className="size-8 cursor-pointer rounded-full text-muted-foreground hover:text-destructive"
        >
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.8} data-icon />
        </Button>
      </div>
    </div>
  )
}

export default CartItem
