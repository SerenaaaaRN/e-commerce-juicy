import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
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
    <div className="flex flex-col gap-6 text-left">
      {/* Colors Section */}
      {uniqueColors.length > 0 ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm tracking-widest text-foreground uppercase">Color</span>
            {selectedColor ? <span className="text-sm text-muted-foreground">— {selectedColor}</span> : null}
          </div>
          <ToggleGroup
            type="single"
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
                  className={`min-w-[4rem] cursor-pointer rounded-none border px-4 py-3 text-sm transition-all duration-300 disabled:cursor-not-allowed disabled:line-through disabled:opacity-40 ${
                    selectedColor === color
                      ? "border-foreground bg-foreground text-background"
                      : "border-muted text-foreground hover:border-foreground"
                  }`}
                >
                  {color}
                </ToggleGroupItem>
              )
            })}
          </ToggleGroup>
        </div>
      ) : null}

      {/* Sizes Section */}
      {uniqueSizes.length > 0 ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm tracking-widest text-foreground uppercase">Size</span>
            {selectedSize ? <span className="text-sm text-muted-foreground">— {selectedSize}</span> : null}
          </div>
          <ToggleGroup
            type="single"
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
                  className={`min-w-[4rem] cursor-pointer rounded-none border px-4 py-3 text-sm transition-all duration-300 disabled:cursor-not-allowed disabled:line-through disabled:opacity-40 ${
                    selectedSize === size
                      ? "border-foreground bg-foreground text-background"
                      : "border-muted text-foreground hover:border-foreground"
                  }`}
                >
                  {size}
                </ToggleGroupItem>
              )
            })}
          </ToggleGroup>
        </div>
      ) : null}

      {/* Stock Availability indicator */}
      {activeVariant ? (
        <div className="pt-2 text-xs">
          {activeVariant.stock > 0 ? (
            <span className="text-emerald-700 tracking-wider">In Stock: {activeVariant.stock} available</span>
          ) : (
            <span className="text-destructive tracking-wider">Sold Out</span>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default VariantSelector
