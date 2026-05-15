import { useState, useEffect } from "react"
import { productApi } from "@/lib/api/products"
import { ReviewCard } from "./ReviewCard"
import { StarRating } from "./StarRating"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Empty, EmptyHeader, EmptyDescription, EmptyMedia } from "@/components/ui/empty"
import { HugeiconsIcon } from "@hugeicons/react"
import { ShoppingBag01Icon } from "@hugeicons/core-free-icons"
import type { Review } from "@/types"

type ReviewsSectionProps = {
  slug: string
  avgRating: number
  reviewCount: number
}

export const ReviewsSection = ({ slug, avgRating, reviewCount }: ReviewsSectionProps) => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true)
      try {
        const res = await productApi.getProductReviews(slug, { page, per_page: 5 })
        if (res.success) {
          setReviews(res.data)
          if (res.meta) {
            setTotalPages(res.meta.total_pages)
          }
        }
      } catch (err) {
        console.error("Failed to load reviews", err)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [slug, page])

  return (
    <div className="mt-10 flex flex-col gap-6 text-left">
      <Separator />

      {/* Reviews Summary Header Block */}
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
        {/* Aggregated Score Column */}
        <div className="flex flex-col gap-2 md:col-span-4">
          <h3 className="text-sm font-semibold tracking-tight text-foreground uppercase">Customer Reviews</h3>
          <div className="flex items-baseline gap-2 pt-2">
            <span className="text-4xl font-extrabold text-foreground">
              {avgRating > 0 ? avgRating.toFixed(1) : "0.0"}
            </span>
            <span className="text-sm text-muted-foreground">out of 5</span>
          </div>
          <div className="flex items-center gap-2">
            <StarRating rating={avgRating} />
            <span className="text-xs font-medium text-muted-foreground">({reviewCount} reviews)</span>
          </div>
        </div>

        {/* Informative metadata row */}
        <div className="max-w-md font-sans text-xs leading-relaxed text-muted-foreground md:col-span-8">
          <p>
            All verified customer ratings represent authentic order experiences. We encourage honest atelier assessments
            of our raw linen textures and garment construction details.
          </p>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Reviews list render */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Spinner />
        </div>
      ) : reviews.length === 0 ? (
        <Empty className="mx-auto max-w-md border-none bg-transparent py-10">
          <EmptyHeader>
            <EmptyMedia
              variant="icon"
              className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/5 text-primary"
            >
              <HugeiconsIcon icon={ShoppingBag01Icon} strokeWidth={1.8} className="size-6 text-primary" />
            </EmptyMedia>
            <EmptyDescription className="mt-2 text-sm text-muted-foreground">
              No reviews available for this silhouette yet. Be the first to share your experience after purchasing!
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((rev) => (
            <ReviewCard
              key={rev.id}
              customerName={rev.customer_name}
              rating={rev.rating}
              comment={rev.body}
              createdAt={rev.created_at}
            />
          ))}

          {/* Simple Pagination triggers */}
          {totalPages > 1 ? (
            <div className="mt-4 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="cursor-pointer"
              >
                Previous
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="cursor-pointer"
              >
                Next
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default ReviewsSection
