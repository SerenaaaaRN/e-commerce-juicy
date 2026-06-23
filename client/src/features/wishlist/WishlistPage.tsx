import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { ROUTES } from "@/constants/paths"
import { useRemoveWishlistItemMutation } from "@/features/wishlist/hooks/useWishlistMutations"
import { useWishlistQuery } from "@/features/wishlist/hooks/useWishlistQueries"
import { formatPrice } from "@/lib/utils"
import { HeartAddIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

export const WishlistPage = () => {
  const { data: wishlist, isLoading } = useWishlistQuery()
  const removeItemMutation = useRemoveWishlistItemMutation()
  const items = wishlist?.items ?? []

  const handleRemove = async (variantId: string) => {
    removeItemMutation.mutate(variantId, {
      onSuccess: () => toast.success("Removed from wishlist."),
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-20">
        <Spinner size={32} className="text-primary" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
        <Empty className="max-w-md border-none bg-transparent">
          <EmptyHeader>
            <EmptyMedia
              variant="icon"
              className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/5 text-primary"
            >
              <HugeiconsIcon icon={HeartAddIcon} strokeWidth={1.8} className="size-6 text-primary" />
            </EmptyMedia>
            <EmptyTitle className="text-2xl font-bold tracking-tight">Your Wishlist is Empty</EmptyTitle>
            <EmptyDescription className="mt-2 text-sm text-muted-foreground">
              Save your favorite silhouettes and they will appear here.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="mt-6">
            <Button asChild variant="outline">
              <Link to={ROUTES.shop}>Browse Silhouettes</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 pt-24 pb-12 lg:pt-32">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"} saved
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <Card key={item.id} className="group overflow-hidden border-border/50">
            <Link to={`${ROUTES.shop}/${item.product_slug}`}>
              <div className="aspect-3/4 overflow-hidden bg-muted">
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.product_name}
                  className="size-full object-cover transition-transform"
                />
              </div>
            </Link>
            <CardContent className="p-4">
              <p className="mt-1 text-xs text-muted-foreground">
                {item.variant_size} / {item.variant_color}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold">{formatPrice(item.price + item.additional_price)}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(item.variant_id)}
                  className="size-8 text-muted-foreground hover:text-destructive"
                >
                  <HugeiconsIcon icon={HeartAddIcon} data-icon="inline-start" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default WishlistPage
