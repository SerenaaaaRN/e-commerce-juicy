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
import { Spinner } from "@/components/ui/spinner"
import { useAddCartItemMutation } from "@/features/cart/hooks/useCartMutations"
import { useProductQuery } from "@/features/shop/hooks/useProductQueries"
import {
  useAddWishlistItemMutation,
  useRemoveWishlistItemMutation,
} from "@/features/wishlist/hooks/useWishlistMutations"
import { useWishlistQuery } from "@/features/wishlist/hooks/useWishlistQueries"
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed"
import { useCustomerAuthStore } from "@/stores/customer-auth-store"
import { Link, useNavigate, useParams } from "@tanstack/react-router"
import { HeartAddIcon, ShoppingBag01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useState, type ComponentProps } from "react"
import { toast } from "sonner"
import { ProductImageGallery } from "./components/ProductImageGallery"
import { ProductInfo } from "./components/ProductInfo"
import { ReviewsSection } from "./components/ReviewsSection"
import { VariantSelector } from "./components/VariantSelector"

type AddToCartButtonProps = ComponentProps<"button"> & {
  isLoading?: boolean
  stock: number
}

const AddToCartButton = ({ onClick, disabled = false, isLoading = false, stock }: AddToCartButtonProps) => {
  const isOutOfStock = stock <= 0

  return (
    <Button onClick={onClick} disabled={disabled || isOutOfStock || isLoading} size="lg">
      {isLoading ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <HugeiconsIcon icon={ShoppingBag01Icon} strokeWidth={1.8} data-icon="inline-start" />
      )}
      {isOutOfStock ? "Out of Stock" : isLoading ? "Adding to Cart..." : "Add to Cart"}
    </Button>
  )
}

export const ProductPage = () => {
  const { slug } = useParams({ from: "/_public/shop/$slug" })
  const navigate = useNavigate()
  const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated)
  const { data: currentProduct, isLoading, error } = useProductQuery(slug || "")
  const addCartMutation = useAddCartItemMutation()
  const { data: wishlist } = useWishlistQuery(isAuthenticated)
  const addWishlistMutation = useAddWishlistItemMutation()
  const removeWishlistMutation = useRemoveWishlistItemMutation()
  const { addItem: addToRecentlyViewed } = useRecentlyViewed()

  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")

  useEffect(() => {
    if (currentProduct) {
      setSelectedSize("")
      setSelectedColor("")
      addToRecentlyViewed({
        slug: currentProduct.slug,
        name: currentProduct.name,
        image_url: currentProduct.images?.find((i) => i.is_primary)?.image_url || "",
        price: currentProduct.price,
        category_name: currentProduct.category?.name || "",
      })
    }
  }, [currentProduct, addToRecentlyViewed])

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-20">
        <div className="flex flex-col items-center gap-4">
          <Spinner size={32} className="text-primary" />
          <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Fetching Atelier Silhouette...
          </span>
        </div>
      </div>
    )
  }

  if (error || !currentProduct) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-20">
        <Empty className="max-w-md border-none bg-transparent">
          <EmptyHeader>
            <EmptyMedia
              variant="icon"
              className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/5 text-primary"
            >
              <HugeiconsIcon icon={ShoppingBag01Icon} strokeWidth={1.8} className="size-6 text-primary" />
            </EmptyMedia>
            <EmptyTitle className="text-2xl font-bold tracking-tight">Silhouette Not Found</EmptyTitle>
            <EmptyDescription className="mt-2 text-sm text-muted-foreground">
              We couldn't retrieve the design details you requested. It may have been retired or sold out.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="mt-6">
            <Button asChild variant="outline">
              <Link to="/shop">Back to Shop</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  const variants = currentProduct.variants || []
  const activeVariant = variants.find((v) => v.size === selectedSize && v.color === selectedColor)
  const wishlistVariantId = activeVariant?.id || variants[0]?.id || ""
  const inWishlist = wishlistVariantId ? (wishlist?.wishlistIds.has(wishlistVariantId) ?? false) : false

  const unitPrice = activeVariant ? currentProduct.price + activeVariant.additional_price : currentProduct.price

  const availableStock = activeVariant ? activeVariant.stock : 0
  const hasVariants = variants.length > 0
  const isSelectionComplete = !hasVariants || (selectedSize !== "" && selectedColor !== "")

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate({ to: "/login" })
      toast.error("Please log in to add items to your cart.")
      return
    }

    if (hasVariants && !activeVariant) {
      toast.warning("Please choose your size and color variant options first.")
      return
    }

    const variantId = activeVariant?.id || currentProduct.variants?.[0]?.id
    if (!variantId) {
      toast.error("No active variant found for this product.")
      return
    }

    addCartMutation.mutate(
      { variantId, quantity: 1 },
      {
        onSuccess: () => toast.success(`${currentProduct.name} has been added to your cart.`),
        onError: () => toast.error("Failed to add silhouette to cart. Please try again."),
      }
    )
  }

  const handleToggleWishlist = async () => {
    if (!wishlistVariantId) return
    if (!isAuthenticated) {
      toast.warning("Please log in to save items to your wishlist.")
      return
    }
    if (inWishlist) {
      removeWishlistMutation.mutate(wishlistVariantId, {
        onSuccess: () => toast.success("Removed from wishlist."),
      })
    } else {
      addWishlistMutation.mutate(wishlistVariantId, {
        onSuccess: () => toast.success("Added to wishlist."),
      })
    }
  }

  return (
    <div className="bg-background py-32 md:py-42">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb className="mb-8 text-left text-xs font-bold uppercase">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink to="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink to="/shop">Shop</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage className="max-w-50 truncate font-bold text-primary uppercase sm:max-w-none">
              {currentProduct.name}
            </BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="w-full lg:col-span-6">
            <ProductImageGallery images={currentProduct.images || []} fallbackImage="/placeholder.webp" />
          </div>

          <div className="flex w-full flex-col gap-6 lg:col-span-6">
            <ProductInfo
              name={currentProduct.name}
              categoryName={currentProduct.category?.name || "Apparel"}
              price={unitPrice}
              compareAtPrice={currentProduct.compare_at_price}
              avgRating={currentProduct.avg_rating}
              reviewCount={currentProduct.review_count}
              description={currentProduct.description}
              tags={currentProduct.tags}
            />

            {hasVariants ? (
              <VariantSelector
                variants={variants}
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
              />
            ) : null}

            <div className="flex flex-col gap-3 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <AddToCartButton
                    onClick={handleAddToCart}
                    disabled={!isSelectionComplete}
                    isLoading={addCartMutation.isPending}
                    stock={hasVariants ? availableStock : 99}
                  />
                </div>
                <Button variant="outline" size="icon" onClick={handleToggleWishlist} className="size-12 shrink-0">
                  <HugeiconsIcon icon={HeartAddIcon} data-icon="inline-start" />
                </Button>
              </div>
              {!isSelectionComplete && (
                <span className="text-left text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                  * Select size and color to activate cart action
                </span>
              )}
            </div>
          </div>
        </div>

        <ReviewsSection
          slug={currentProduct.slug}
          avgRating={currentProduct.avg_rating}
          reviewCount={currentProduct.review_count}
        />
      </div>
    </div>
  )
}

export default ProductPage
