import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useProductStore } from "@/stores/productStore"
import { useCartStore } from "@/stores/cartStore"
import { ProductImageGallery } from "./components/ProductImageGallery"
import { ProductInfo } from "./components/ProductInfo"
import { VariantSelector } from "./components/VariantSelector"
import { AddToCartButton } from "./components/AddToCartButton"
import { ReviewsSection } from "./components/ReviewsSection"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty"
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
    }
  }, [currentProduct])

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center py-20 px-4">
        <div className="flex flex-col items-center gap-4">
          <Spinner size={32} className="text-primary" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            Fetching Atelier Silhouette...
          </span>
        </div>
      </div>
    )
  }

  if (error || !currentProduct) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center py-20 px-4">
        <Empty className="border-none max-w-md bg-transparent">
          <EmptyHeader>
            <EmptyTitle className="text-2xl font-bold tracking-tight">
              Silhouette Not Found
            </EmptyTitle>
            <EmptyDescription className="text-sm text-muted-foreground mt-2">
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

  // Find currently active variant based on size & color choices
  const variants = currentProduct.variants || []
  const activeVariant = variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  )

  // Settle active unit price (base product price + variant specific surcharge if any)
  const unitPrice = activeVariant
    ? currentProduct.price + activeVariant.additional_price
    : currentProduct.price

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

  return (
    <div className="bg-background py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Navigation Breadcrumb trail */}
        <Breadcrumb className="mb-8 text-left uppercase tracking-widest font-semibold">
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/shop">Shop</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="truncate max-w-[200px] sm:max-w-none uppercase">
                {currentProduct.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* PDP Two-Column Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* Visual Column */}
          <div className="lg:col-span-6 w-full">
            <ProductImageGallery
              images={currentProduct.images || []}
              fallbackImage="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop"
            />
          </div>

          {/* Details & Selection Column */}
          <div className="lg:col-span-6 flex flex-col gap-6 w-full">

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
            <div className="pt-4 flex flex-col gap-3">
              <AddToCartButton
                onClick={handleAddToCart}
                disabled={!isSelectionComplete}
                isLoading={isAddingToCart}
                stock={hasVariants ? availableStock : 99} // Default fallback stock for pure non-variant apparel
              />
              {!isSelectionComplete && (
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold text-left">
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
