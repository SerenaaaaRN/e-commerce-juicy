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
  // Extract unique sizes and colors
  const uniqueSizes = Array.from(new Set(variants.map((v) => v.size)))
  const uniqueColors = Array.from(new Set(variants.map((v) => v.color)))

  // Helper to check if a size option has stock given current color selection
  const isSizeOutOfStock = (size: string) => {
    if (!selectedColor) {
      // If no color selected yet, check if there is any variant in this size with stock > 0
      return !variants.some((v) => v.size === size && v.stock > 0)
    }
    // Find variant for this size + current color
    const matched = variants.find((v) => v.size === size && v.color === selectedColor)
    return !matched || matched.stock <= 0
  }

  // Helper to check if a color option has stock given current size selection
  const isColorOutOfStock = (color: string) => {
    if (!selectedSize) {
      return !variants.some((v) => v.color === color && v.stock > 0)
    }
    const matched = variants.find((v) => v.size === selectedSize && v.color === color)
    return !matched || matched.stock <= 0
  }

  // Get active combination details if size and color are fully selected
  const activeVariant = variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  )

  return (
    <div className="flex flex-col gap-5 text-left border-t border-foreground/5 pt-5">
      
      {/* Sizes Section */}
      {uniqueSizes.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground">
              Select Size
            </span>
            {selectedSize && (
              <span className="text-[10px] tracking-widest text-muted-foreground uppercase font-medium">
                Active: {selectedSize}
              </span>
            )}
          </div>
          <ToggleGroup
            type="single"
            variant="outline"
            value={selectedSize}
            onValueChange={(val) => onSizeChange(val || "")}
            className="flex flex-wrap gap-2 justify-start"
          >
            {uniqueSizes.map((size) => {
              const oos = isSizeOutOfStock(size)
              return (
                <ToggleGroupItem
                  key={size}
                  value={size}
                  disabled={oos}
                  className="size-11 uppercase font-semibold text-xs tracking-wider cursor-pointer rounded-none border border-foreground/15 hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {size}
                </ToggleGroupItem>
              )
            })}
          </ToggleGroup>
        </div>
      )}

      {/* Colors Section */}
      {uniqueColors.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground">
              Select Color
            </span>
            {selectedColor && (
              <span className="text-[10px] tracking-widest text-muted-foreground uppercase font-medium">
                Active: {selectedColor}
              </span>
            )}
          </div>
          <ToggleGroup
            type="single"
            variant="outline"
            value={selectedColor}
            onValueChange={(val) => onColorChange(val || "")}
            className="flex flex-wrap gap-2 justify-start"
          >
            {uniqueColors.map((color) => {
              const oos = isColorOutOfStock(color)
              const variantObj = variants.find((v) => v.color === color)
              const hex = variantObj?.color_hex || "#ccc"

              return (
                <ToggleGroupItem
                  key={color}
                  value={color}
                  disabled={oos}
                  className="px-4 py-2 uppercase font-medium text-[10px] tracking-widest cursor-pointer rounded-none border border-foreground/15 hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span
                    className="size-3.5 inline-block border border-white/20"
                    style={{ backgroundColor: hex }}
                  />
                  {color}
                </ToggleGroupItem>
              )
            })}
          </ToggleGroup>
        </div>
      )}

      {/* Stock Availability indicator */}
      {activeVariant && (
        <div className="pt-1 text-[10px] uppercase tracking-widest font-semibold">
          {activeVariant.stock > 0 ? (
            <span className="text-emerald-700">In Stock: {activeVariant.stock} available</span>
          ) : (
            <span className="text-destructive">Sold Out</span>
          )}
        </div>
      )}

    </div>
  )
}

export default VariantSelector
