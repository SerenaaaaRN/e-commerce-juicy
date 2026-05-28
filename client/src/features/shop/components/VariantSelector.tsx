import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Separator } from "@/components/ui/separator"
import type { ProductVariant } from "@/types"

type VariantSelectorProps = {
  variants: ProductVariant[]
  selectedSize: string
  onSizeChange: (size: string) => void
  selectedColor: string
  onColorChange: (color: string) => void
}

export const VariantSelector = ({
  variants,
  selectedSize,
  onSizeChange,
  selectedColor,
  onColorChange,
}: VariantSelectorProps) => {
  const uniqueSizes = Array.from(new Set(variants.map((v) => v.size)))
  const uniqueColors = Array.from(new Set(variants.map((v) => v.color)))

  const isSizeOutOfStock = (size: string) => {
    if (!selectedColor) {
      return !variants.some((v) => v.size === size && v.stock > 0)
    }
    const matched = variants.find((v) => v.size === size && v.color === selectedColor)
    return !matched || matched.stock <= 0
  }

  const isColorOutOfStock = (color: string) => {
    if (!selectedSize) {
      return !variants.some((v) => v.color === color && v.stock > 0)
    }
    const matched = variants.find((v) => v.size === selectedSize && v.color === color)
    return !matched || matched.stock <= 0
  }

  const activeVariant = variants.find((v) => v.size === selectedSize && v.color === selectedColor)

  return (
    <div className="flex flex-col gap-5 text-left">
      <Separator />

      {/* Sizes Section */}
      {uniqueSizes.length > 0 ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">Select Size</span>
            {selectedSize ? <span className="font-medium text-muted-foreground">Active: {selectedSize}</span> : null}
          </div>
          <ToggleGroup
            type="single"
            variant="outline"
            value={selectedSize}
            onValueChange={(val) => onSizeChange(val || "")}
            className="flex flex-wrap justify-start gap-2"
          >
            {uniqueSizes.map((size) => {
              const oos = isSizeOutOfStock(size)
              return (
                <ToggleGroupItem
                  key={size}
                  value={size}
                  disabled={oos}
                  className="h-10 min-w-10 cursor-pointer px-3 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {size}
                </ToggleGroupItem>
              )
            })}
          </ToggleGroup>
        </div>
      ) : null}

      {/* Colors Section */}
      {uniqueColors.length > 0 ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">Select Color</span>
            {selectedColor ? <span className="font-medium text-muted-foreground">Active: {selectedColor}</span> : null}
          </div>
          <ToggleGroup
            type="single"
            variant="outline"
            value={selectedColor}
            onValueChange={(val) => onColorChange(val || "")}
            className="flex flex-wrap justify-start gap-2"
          >
            {uniqueColors.map((color) => {
              const oos = isColorOutOfStock(color)

              return (
                <ToggleGroupItem
                  key={color}
                  value={color}
                  disabled={oos}
                  className="h-10 cursor-pointer px-3 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {color}
                </ToggleGroupItem>
              )
            })}
          </ToggleGroup>
        </div>
      ) : null}

      {/* Stock Availability indicator */}
      {activeVariant ? (
        <div className="pt-1 text-xs font-semibold">
          {activeVariant.stock > 0 ? (
            <span className="text-emerald-700">In Stock: {activeVariant.stock} available</span>
          ) : (
            <span className="text-destructive">Sold Out</span>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default VariantSelector
