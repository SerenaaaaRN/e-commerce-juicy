import { Separator } from "@/components/ui/separator"
import { ROUTES } from "@/constants/paths"
import { useRemoveCartItemMutation, useUpdateCartItemMutation } from "@/features/cart/hooks/useCartMutations"
import { useCartQuery } from "@/features/cart/hooks/useCartQueries"
import { useCustomerAuthStore } from "@/stores/customer-auth-store"
import { Navigate, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { CartItem } from "./components/CartItem"
import { CartSummary } from "./components/CartSummary"
import { EmptyCart } from "./components/EmptyCart"

export const CartPage = () => {
  const navigate = useNavigate()
  const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated)
  const { data: cart } = useCartQuery()
  const updateQtyMutation = useUpdateCartItemMutation()
  const removeItemMutation = useRemoveCartItemMutation()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />
  }

  const items = cart?.items ?? []
  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)

  if (items.length === 0) {
    return <EmptyCart />
  }

  const handleUpdateQty = async (itemId: string, qty: number, name: string) => {
    updateQtyMutation.mutate(
      { itemId, quantity: qty },
      {
        onSuccess: () => toast.success(`Updated ${name} quantity to ${qty}`),
        onError: () => toast.error("Failed to update quantity"),
      }
    )
  }

  const handleRemoveItem = async (itemId: string, name: string) => {
    removeItemMutation.mutate(itemId, {
      onSuccess: () => toast.success(`${name} removed from cart`),
      onError: () => toast.error("Failed to remove item"),
    })
  }

  const handleCheckout = () => {
    navigate(ROUTES.checkout)
  }

  return (
    <div className="my-32 bg-background md:my-42">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <header className="mb-12 flex flex-col gap-2 text-left">
          <span className="text-xs tracking-[0.15em] text-muted-foreground uppercase">Atelier Customer Cart</span>
          <h1 className="font-serif text-3xl text-foreground">Shopping Cart</h1>
          <p className="max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
            Review your selected designs and silhouettes before proceeding to checkout.
          </p>
        </header>

        {/* Dynamic Cart Layout split grid */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Items List Column */}
          <div className="flex flex-col lg:col-span-8">
            {items.map((item, index) => (
              <div key={item.id}>
                {index > 0 && <Separator />}
                <CartItem
                  item={item}
                  onUpdateQty={(itemId, qty) => handleUpdateQty(itemId, qty, item.product_name)}
                  onRemove={(itemId) => handleRemoveItem(itemId, item.product_name)}
                />
              </div>
            ))}
          </div>

          {/* Checkout Summary Column */}
          <div className="w-full lg:col-span-4">
            <CartSummary subtotal={subtotal} onCheckout={handleCheckout} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
