import { useState, useEffect, useTransition } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { useCartStore } from "@/stores/cartStore"
import { useCustomerAuthStore } from "@/stores/customerAuthStore"
import { AddressSelector } from "./components/AddressSelector"
import { AddressForm } from "./components/AddressForm"
import { OrderSummary } from "./components/OrderSummary"
import { PaymentSelector } from "./components/PaymentSelector"
import { ordersApi } from "@/lib/api/orders"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import { ShoppingBag01Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import type { Address } from "@/types"

export const CheckoutPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useCustomerAuthStore()
  const { items, totalPrice, clearCart } = useCartStore()

  // Local state
  const [isPending, startTransition] = useTransition()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [fetchingAddresses, setFetchingAddresses] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)

  const subtotal = totalPrice()

  // Fetch addresses
  const loadAddresses = async () => {
    setFetchingAddresses(true)
    try {
      const res = await ordersApi.getAddresses()
      if (res.success) {
        setAddresses(res.data)
        // Auto-select default address if found
        const defaultAddr = res.data.find((a) => a.is_default)
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id)
        } else if (res.data.length > 0) {
          setSelectedAddressId(res.data[0].id)
        }
      }
    } catch {
      toast.error("Failed to load saved addresses.")
    } finally {
      setFetchingAddresses(false)
    }
  }

  useEffect(() => {
    loadAddresses()
  }, [])

  // Redirect checks
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (items.length === 0) {
    return <Navigate to="/shop" replace />
  }

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      toast.warning("Please choose a shipping address to complete your order.")
      return
    }

    startTransition(async () => {
      try {
        const res = await ordersApi.checkout({
          address_id: selectedAddressId,
          notes: "Checkout from storefront customer app",
          payment_method: paymentMethod,
        })

        if (res.success && res.data) {
          toast.success("Your artisanal silhouette order has been placed successfully!")
          const orderNum = res.data.order_number
          clearCart()
          navigate(`/orders/${orderNum}`)
        } else {
          toast.error(res.message || "Failed to submit checkout order.")
        }
      } catch {
        toast.error("Failed to place order. Please review your checkout information.")
      }
    })
  }

  return (
    <div className="bg-background py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Page Title */}
        <div className="text-left flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">
            Atelier Checkout Flow
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-foreground font-heading">
            Checkout
          </h1>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Configure your delivery destination and confirm your slow fashion order details.
          </p>
        </div>

        <Separator className="my-8" />

        {/* Checkout Split Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Form & Choices Column */}
          <div className="lg:col-span-8 flex flex-col gap-6 w-full">

            {showAddressForm ? (
              <Card className="border border-border/80 shadow-md">
                <CardHeader className="pb-0">
                  <CardTitle className="text-sm font-semibold tracking-tight text-foreground uppercase text-left">
                    Create New Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 pt-4">
                  <AddressForm
                    onSubmitSuccess={() => {
                      setShowAddressForm(false)
                      loadAddresses()
                    }}
                    onCancel={() => setShowAddressForm(false)}
                  />
                </CardContent>
              </Card>
            ) : fetchingAddresses ? (
              <div className="flex justify-center items-center py-12">
                <Spinner className="text-primary" />
              </div>
            ) : (
              <Card className="border border-border/80 shadow-md">
                <CardContent className="p-6 flex flex-col gap-6">
                  <AddressSelector
                    addresses={addresses}
                    selectedAddressId={selectedAddressId}
                    onSelectAddress={setSelectedAddressId}
                    onAddNewTrigger={() => setShowAddressForm(true)}
                  />

                  <PaymentSelector
                    selectedPaymentMethod={paymentMethod}
                    onSelectPaymentMethod={setPaymentMethod}
                  />
                </CardContent>
              </Card>
            )}

          </div>

          {/* Checkout Submit Sidebar Column */}
          <div className="lg:col-span-4 flex flex-col gap-6 w-full">

            {/* Immutable Order Items breakdown */}
            <OrderSummary items={items} subtotal={subtotal} />

            {/* Place Order CTA trigger */}
            <div className="pt-2">
              <Button
                onClick={handlePlaceOrder}
                disabled={isPending || !selectedAddressId || showAddressForm}
                size="lg"
                className="w-full"
              >
                {isPending ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <HugeiconsIcon icon={ShoppingBag01Icon} strokeWidth={1.8} data-icon="inline-start" />
                )}
                {isPending ? "Placing Order..." : "Confirm & Place Order"}
              </Button>
              {(!selectedAddressId && !showAddressForm) && (
                <span className="text-[10px] uppercase tracking-widest text-destructive font-semibold mt-2 block text-left">
                  * Address selection is required to checkout
                </span>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default CheckoutPage
