import { useState, useEffect } from "react"
import { Navigate, Link } from "react-router-dom"
import { ROUTES } from "@/constants/routes"
import { useCustomerAuthStore } from "@/stores/customerAuthStore"
import { OrderCard } from "./components/OrderCard"
import { ordersApi } from "@/lib/api/orders"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Separator } from "@/components/ui/separator"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from "@/components/ui/empty"
import { HugeiconsIcon } from "@hugeicons/react"
import { ShoppingBag01Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import type { Order } from "@/types"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export const OrderHistoryPage = () => {
  const { isAuthenticated } = useCustomerAuthStore()

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const res = await ordersApi.getCustomerOrders()
        if (res.success && res.data) {
          setOrders(res.data.items ?? [])
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
    return <Navigate to={ROUTES.login} replace />
  }

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-20">
        <div className="flex flex-col items-center gap-4">
          <Spinner size={32} className="text-primary" />
          <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Retrieving Purchase Files...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background pt-24 pb-12 lg:pt-32">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb className="mb-8 text-left text-xs font-bold uppercase">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={ROUTES.home}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbPage className="font-bold text-primary">Purchase History</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Title Header */}
        <header className="flex flex-col gap-2 text-left">
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">Atelier Account Details</span>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground">My Orders</h1>
          <p className="max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
            Review your historical checkout logs, custom silhouette invoices, and delivery milestones.
          </p>
        </header>

        <Separator className="my-8" />

        {/* Main Orders List Stack */}
        {orders.length === 0 ? (
          <Empty className="mx-auto max-w-md border-none bg-transparent">
            <EmptyHeader>
              <EmptyMedia
                variant="icon"
                className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/5 text-primary"
              >
                <HugeiconsIcon icon={ShoppingBag01Icon} strokeWidth={1.8} className="size-6 text-primary" />
              </EmptyMedia>
              <EmptyTitle className="text-2xl font-bold tracking-tight">No Orders Placed</EmptyTitle>
              <EmptyDescription className="mt-2 text-sm text-muted-foreground">
                You haven't placed any custom silhouette orders yet. Explore our latest designs to build your style
                foundation.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="mt-6">
              <Button asChild size="lg">
                <Link to={ROUTES.shop}>Explore Atelier</Link>
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="flex max-w-3xl flex-col gap-4">
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
