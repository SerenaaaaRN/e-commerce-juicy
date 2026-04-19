import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6 border-b border-border text-left">
      
      {/* Product Image & Info Details */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative aspect-[3/4] w-20 overflow-hidden bg-muted rounded-md border border-border/60">
          <img
            src={item.image_url || "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=400&auto=format&fit=crop"}
            alt={item.product_name}
            className="size-full object-cover object-center"
          />
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold tracking-tight text-foreground truncate max-w-[200px]">
            {item.product_name}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground uppercase font-medium">
            {item.variant_size && (
              <span>Size: {item.variant_size}</span>
            )}
            {item.variant_size && item.variant_color && (
              <span>•</span>
            )}
            {item.variant_color && (
              <span>Color: {item.variant_color}</span>
            )}
          </div>
          <span className="text-xs font-mono font-semibold text-foreground pt-1 sm:hidden">
            {formatPrice(item.unit_price)}
          </span>
        </div>
      </div>

      {/* Stepper, Subtotal, and Actions column */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
        
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
            className="w-12 h-8 text-center p-0 font-semibold text-xs rounded-md font-mono"
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
        <div className="hidden sm:block text-right min-w-[100px] font-mono text-sm font-semibold">
          {formatPrice(item.subtotal)}
        </div>

        {/* Delete Trigger */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item.id)}
          className="text-muted-foreground hover:text-destructive cursor-pointer size-8 rounded-full"
        >
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.8} className="size-4" />
        </Button>

      </div>

    </div>
  )
}

export default CartItem
