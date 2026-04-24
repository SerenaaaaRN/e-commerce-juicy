import { Navigate, useNavigate } from "react-router-dom"
import { useCartStore } from "@/stores/cartStore"
import { useCustomerAuthStore } from "@/stores/customerAuthStore"
import { CartItem } from "./components/CartItem"
import { CartSummary } from "./components/CartSummary"
import { EmptyCart } from "./components/EmptyCart"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export const CartPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useCustomerAuthStore()
  const { items, totalPrice, updateQty, removeItem } = useCartStore()

  // Guest restriction redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const subtotal = totalPrice()

  if (items.length === 0) {
    return <EmptyCart />
  }

  const handleUpdateQty = async (itemId: string, qty: number, name: string) => {
    try {
      await updateQty(itemId, qty)
      toast.success(`Updated ${name} quantity to ${qty}`)
    } catch (err: any) {
      toast.error(err.message || "Failed to update quantity")
    }
  }

  const handleRemoveItem = async (itemId: string, name: string) => {
    try {
      await removeItem(itemId)
      toast.success(`${name} removed from cart`)
    } catch (err: any) {
      toast.error(err.message || "Failed to remove item")
    }
  }

  const handleCheckout = () => {
    navigate("/checkout")
  }

  return (
    <div className="bg-background py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="text-left flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">
            Atelier Customer Cart
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-foreground font-heading">
            Shopping Cart
          </h1>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Review your selected designs and silhouettes before proceeding to checkout.
          </p>
        </div>

        <Separator className="my-8" />

        {/* Dynamic Cart Layout split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Items List Column */}
          <div className="lg:col-span-8 flex flex-col">
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
          <div className="lg:col-span-4 w-full">
            <CartSummary
              subtotal={subtotal}
              onCheckout={handleCheckout}
            />
          </div>

        </div>

      </div>
    </div>
  )
}

export default CartPage
