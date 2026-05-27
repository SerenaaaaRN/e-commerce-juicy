import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ROUTES } from "@/constants/routes"
import { useProductStore } from "@/stores/productStore"
import { useCartStore } from "@/stores/cartStore"
import { useWishlistStore } from "@/stores/wishlistStore"
import { useCustomerAuthStore } from "@/stores/customerAuthStore"
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed"
import { ProductImageGallery } from "./components/ProductImageGallery"
import { ProductInfo } from "./components/ProductInfo"
import { VariantSelector } from "./components/VariantSelector"
import { AddToCartButton } from "./components/AddToCartButton"
import { ReviewsSection } from "./components/ReviewsSection"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from "@/components/ui/empty"
import { HugeiconsIcon } from "@hugeicons/react"
import { ShoppingBag01Icon, HeartAddIcon } from "@hugeicons/core-free-icons"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { toast } from "sonner"

export const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const { currentProduct, isLoading, error, fetchProductBySlug, clearCurrentProduct } = useProductStore()
  const { addItem, isLoading: isAddingToCart } = useCartStore()
  const { addItem: addToRecentlyViewed } = useRecentlyViewed()
  const { isAuthenticated } = useCustomerAuthStore()
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore()

  // Selections state
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")

  // Fetch product detail on mount/slug change
  useEffect(() => {
    if (slug) {
      fetchProductBySlug(slug)
    }
    return () => {
      clearCurrentProduct()
    }
  }, [slug, fetchProductBySlug, clearCurrentProduct])

  // Reset selections when product changes
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
      <div className="container mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-20">
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
              <Link to={ROUTES.shop}>Back to Shop</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  // Find currently active variant based on size & color choices
  const variants = currentProduct.variants || []
  const activeVariant = variants.find((v) => v.size === selectedSize && v.color === selectedColor)
  const wishlistVariantId = activeVariant?.id || variants[0]?.id || ""
  const inWishlist = wishlistVariantId ? isInWishlist(wishlistVariantId) : false

  // Settle active unit price (base product price + variant specific surcharge if any)
  const unitPrice = activeVariant ? currentProduct.price + activeVariant.additional_price : currentProduct.price

  // Stock tracking details
  const availableStock = activeVariant ? activeVariant.stock : 0
  const hasVariants = variants.length > 0
  const isSelectionComplete = !hasVariants || (selectedSize !== "" && selectedColor !== "")

  const handleAddToCart = async () => {
    if (hasVariants && !activeVariant) {
      toast.warning("Please choose your size and color variant options first.")
      return
    }

    const variantId = activeVariant?.id || currentProduct.variants?.[0]?.id
    if (!variantId) {
      toast.error("No active variant found for this product.")
      return
    }

    try {
      await addItem(variantId, 1)
      toast.success(`${currentProduct.name} has been added to your cart.`)
    } catch {
      toast.error("Failed to add silhouette to cart. Please try again.")
    }
  }

  const handleToggleWishlist = async () => {
    if (!wishlistVariantId) return
    if (!isAuthenticated) {
      toast.warning("Please log in to save items to your wishlist.")
      return
    }
    if (inWishlist) {
      await removeFromWishlist(wishlistVariantId)
      toast.success("Removed from wishlist.")
    } else {
      await addToWishlist(wishlistVariantId)
      toast.success("Added to wishlist.")
    }
  }

  return (
    <div className="bg-background py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb trail */}
        <Breadcrumb className="mb-8 text-left font-semibold tracking-widest uppercase">
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={ROUTES.home}>Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={ROUTES.shop}>Shop</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-50 truncate uppercase sm:max-w-none">
                {currentProduct.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* PDP Two-Column Split Grid */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Visual Column */}
          <div className="w-full lg:col-span-6">
            <ProductImageGallery images={currentProduct.images || []} fallbackImage="/placeholder.webp" />
          </div>

          {/* Details & Selection Column */}
          <div className="flex w-full flex-col gap-6 lg:col-span-6">
            {/* Base Product Info Details */}
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

            {/* Variant Pills Selector */}
            {hasVariants ? (
              <VariantSelector
                variants={variants}
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
              />
            ) : null}

            {/* Cart trigger block */}
            <div className="flex flex-col gap-3 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <AddToCartButton
                    onClick={handleAddToCart}
                    disabled={!isSelectionComplete}
                    isLoading={isAddingToCart}
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

        {/* Dynamic Reviews and Feedback list */}
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
