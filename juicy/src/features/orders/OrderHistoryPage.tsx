import { useState, useEffect } from "react"
import { Navigate, Link } from "react-router-dom"
import { useCustomerAuthStore } from "@/stores/customerAuthStore"
import { OrderCard } from "./components/OrderCard"
import { ordersApi } from "@/lib/api/orders"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Separator } from "@/components/ui/separator"
import { Empty, EmptyHeader, EmptyDescription, EmptyContent } from "@/components/ui/empty"
import { toast } from "sonner"
import type { Order } from "@/types"

export const OrderHistoryPage = () => {
  const { isAuthenticated } = useCustomerAuthStore()

  // State
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const res = await ordersApi.getCustomerOrders()
        if (res.success) {
          setOrders(res.data)
        }
      } catch {
        toast.error("Failed to load your purchase history.")
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  // Guest restriction redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center py-20 px-4">
        <div className="flex flex-col items-center gap-4">
          <Spinner size={32} className="text-primary" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            Retrieving Purchase Files...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb trail */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8 text-left uppercase tracking-widest font-semibold">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">Purchase History</span>
        </div>

        {/* Page Title Header */}
        <div className="text-left flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">
            Atelier Account Details
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            My Orders
          </h1>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed font-sans">
            Review your historical checkout logs, custom silhouette invoices, and delivery milestones.
          </p>
        </div>

        <Separator className="my-8" />

        {/* Main Orders List Stack */}
        {orders.length === 0 ? (
          <Empty className="border border-dashed border-border/85 p-8 max-w-md mx-auto bg-transparent">
            <EmptyHeader>
              <EmptyDescription className="text-sm text-muted-foreground">
                You haven't placed any custom silhouette orders yet.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="mt-4">
              <Button asChild size="sm">
                <Link to="/shop">Explore Atelier</Link>
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="flex flex-col gap-4 max-w-3xl">
            {orders.map((ord) => (
              <OrderCard key={ord.id} order={ord} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default OrderHistoryPage
