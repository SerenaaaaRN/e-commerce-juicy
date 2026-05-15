import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { HugeiconsIcon } from "@hugeicons/react"
import { ShoppingBag01Icon } from "@hugeicons/core-free-icons"
import type { ComponentProps } from "react"

type AddToCartButtonProps = ComponentProps<"button"> & {
  isLoading?: boolean
  stock: number
}

export const AddToCartButton = ({ onClick, disabled = false, isLoading = false, stock }: AddToCartButtonProps) => {
  const isOutOfStock = stock <= 0

  return (
    <Button onClick={onClick} disabled={disabled || isOutOfStock || isLoading} size="lg">
      {isLoading ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <HugeiconsIcon icon={ShoppingBag01Icon} strokeWidth={1.8} data-icon="inline-start" />
      )}
      {isOutOfStock ? "Out of Stock" : isLoading ? "Adding to Cart..." : "Add to Cart"}
    </Button>
  )
}

export default AddToCartButton
