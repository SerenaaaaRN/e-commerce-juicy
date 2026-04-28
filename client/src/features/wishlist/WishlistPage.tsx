import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useWishlistStore } from "@/stores/wishlistStore"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent } from "@/components/ui/card"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from "@/components/ui/empty"
import { HugeiconsIcon } from "@hugeicons/react"
import { HeartAddIcon, ShoppingBag01Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

export const WishlistPage = () => {
  const { items, loading, fetchWishlist, removeItem } = useWishlistStore()

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  const handleRemove = async (variantId: string) => {
    const ok = await removeItem(variantId)
    if (ok) toast.success("Removed from wishlist.")
  }

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center py-20 px-4">
        <Spinner size={32} className="text-primary" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center py-20 px-4">
        <Empty className="border-none max-w-md bg-transparent">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-primary/5 text-primary size-12 rounded-full mb-3 flex items-center justify-center">
              <HugeiconsIcon icon={HeartAddIcon} strokeWidth={1.8} className="size-6 text-primary" />
            </EmptyMedia>
            <EmptyTitle className="text-2xl font-bold tracking-tight">
              Your Wishlist is Empty
            </EmptyTitle>
            <EmptyDescription className="text-sm text-muted-foreground mt-2">
              Save your favorite silhouettes and they will appear here.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="mt-6">
            <Button asChild variant="outline">
              <Link to="/shop">Browse Silhouettes</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
        <p className="text-sm text-muted-foreground mt-2">
          {items.length} {items.length === 1 ? "item" : "items"} saved
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden border-border/50 group">
            <Link to={`/product/${item.product_slug}`}>
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.product_name}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </Link>
            <CardContent className="p-4">
              <Link to={`/product/${item.product_slug}`}>
                <h3 className="font-semibold text-sm truncate">{item.product_name}</h3>
              </Link>
              <p className="text-xs text-muted-foreground mt-1">
                {item.variant_size} / {item.variant_color}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="font-bold text-sm">
                  ${(item.price + item.additional_price).toFixed(2)}
                </span>
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
