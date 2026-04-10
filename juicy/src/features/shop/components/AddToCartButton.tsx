import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { HugeiconsIcon } from "@hugeicons/react"
import { ShoppingBag01Icon } from "@hugeicons/core-free-icons"

type AddToCartButtonProps = {
  onClick: () => void
  disabled?: boolean
  isLoading?: boolean
  stock: number
}

export const AddToCartButton = ({
  onClick,
  disabled = false,
  isLoading = false,
  stock,
}: AddToCartButtonProps) => {
  const isOutOfStock = stock <= 0

  return (
    <Button
      onClick={onClick}
      disabled={disabled || isOutOfStock || isLoading}
      size="lg"
      className="w-full font-medium uppercase tracking-widest text-xs py-6 h-auto cursor-pointer transition-transform hover:scale-[1.01] active:scale-95 duration-200"
    >
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
