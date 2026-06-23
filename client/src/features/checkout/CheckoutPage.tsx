import { useState, useEffect, useTransition } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { ROUTES } from "@/constants/routes"
import { useCustomerAuthStore } from "@/stores/customerAuthStore"
import { useCartQuery } from "@/features/cart/hooks/useCartQueries"
import { useClearCartMutation } from "@/features/cart/hooks/useCartMutations"
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
  const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated)
  const { data: cart } = useCartQuery()
  const clearCartMutation = useClearCartMutation()

  const items = cart?.items ?? []
  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)

  // Local state
  const [isPending, startTransition] = useTransition()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [fetchingAddresses, setFetchingAddresses] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)

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
    return <Navigate to={ROUTES.login} replace />
  }

  if (items.length === 0) {
    return <Navigate to={ROUTES.shop} replace />
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
          clearCartMutation.mutate()
          navigate(`${ROUTES.orders}/${orderNum}`)
        } else {
          toast.error(res.message || "Failed to submit checkout order.")
        }
      } catch {
        toast.error("Failed to place order. Please review your checkout information.")
      }
    })
  }

  return (
    <div className="bg-background pt-24 pb-12 lg:pt-32">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <header className="mb-12 flex flex-col gap-2 text-left">
          <span className="text-xs tracking-[0.15em] text-muted-foreground uppercase">Atelier Checkout Flow</span>
          <h1 className="font-serif text-3xl text-foreground">Checkout</h1>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Configure your delivery destination and confirm your slow fashion order details.
          </p>
        </header>

        {/* Checkout Split Grid Layout */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Form & Choices Column */}
          <div className="flex w-full flex-col gap-6 lg:col-span-8">
            {showAddressForm ? (
              <Card className="border border-border/80 shadow-md">
                <CardHeader className="pb-0">
                  <CardTitle className="text-left text-sm font-semibold tracking-tight text-foreground uppercase">
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
              <div className="flex items-center justify-center py-12">
                <Spinner className="text-primary" />
              </div>
            ) : (
              <Card className="border border-border/80 shadow-md">
                <CardContent className="flex flex-col gap-6 p-6">
                  <AddressSelector
                    addresses={addresses}
                    selectedAddressId={selectedAddressId}
                    onSelectAddress={setSelectedAddressId}
                    onAddNewTrigger={() => setShowAddressForm(true)}
                  />

                  <PaymentSelector selectedPaymentMethod={paymentMethod} onSelectPaymentMethod={setPaymentMethod} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Checkout Submit Sidebar Column */}
          <div className="flex w-full flex-col gap-6 lg:col-span-4">
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
              {!selectedAddressId && !showAddressForm && (
                <span className="mt-2 block text-left text-[10px] font-semibold tracking-widest text-destructive uppercase">
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
