import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { ROUTES } from "@/constants/paths"
import { useCustomerAuthStore } from "@/stores/customer-auth-store"
import { ShoppingBag01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect } from "react"
import { Link, Navigate } from "react-router-dom"
import { toast } from "sonner"
import { OrderCard } from "./components/OrderCard"
import { useCustomerOrdersQuery } from "./hooks/useOrderQueries"

export const OrderHistoryPage = () => {
  const { isAuthenticated } = useCustomerAuthStore()
  const { data: orders = [], isLoading: loading, error } = useCustomerOrdersQuery()

  useEffect(() => {
    if (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load your purchase history.")
    }
  }, [error])

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
    <div className="container mx-auto max-w-7xl px-4 py-32 md:px-8 md:py-40">
      <Breadcrumb className="mb-4 text-[10px] tracking-wider uppercase sm:text-xs">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink to={ROUTES.home}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage className="text-primary">Purchase History</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mb-8 flex flex-col gap-2 text-left sm:mb-10">
        <span className="text-[10px] tracking-widest text-primary uppercase">Atelier Account Details</span>
        <h1 className="font-heading text-2xl tracking-tight text-foreground sm:text-4xl">My Orders</h1>
        <p className="max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
          Review your historical checkout logs, custom silhouette invoices, and delivery milestones.
        </p>
      </header>

      <Separator className="mb-8" />

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
  )
}

export default OrderHistoryPage
