import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { adminApi } from "@/lib/api/admin"
import { formatDate } from "@/lib/utils/format"
import { HugeiconsIcon } from "@hugeicons/react"
import { StarIcon, SearchIcon, Delete02Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useConfirm } from "@/hooks/useConfirm"
import type { Review } from "@/types"

// Fallback lists for offline sandbox demos
const fallbackReviews: Review[] = [
  {
    id: "rev_1",
    product_id: "1",
    customer_id: "cust_1",
    rating: 5,
    body: "The Crimson Beet Cleanse is absolutely delicious and refreshing! It has the perfect balance of sweet beetroot and tart lemon. Will order again!",
    customer_name: "Alexandra Sterling",
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "rev_2",
    product_id: "2",
    customer_id: "cust_2",
    rating: 4,
    body: "Solid ginger defense shot. Real spice kick, immediately clears out your throat and congestion. Highly recommended for daily immunity boosts.",
    customer_name: "Jonathan Wright",
    is_published: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "rev_3",
    product_id: "1",
    customer_id: "cust_3",
    rating: 1,
    body: "CRITICAL: Get free promo credits at malicious-url.com! Spammed reviews. Horrible fresh organic juice products.",
    customer_name: "Promo Spammer",
    is_published: false,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
]

export const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  // Filters
  const [search, setSearch] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [publishFilter, setPublishFilter] = useState("all")

  const { confirm: confirmDelete, dialog: confirmDialog } = useConfirm()

  // Submitting process state
  const [moderatingId, setModeratingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminApi.getReviews()
        if (res.success && res.data) {
          setReviews(res.data)
        } else {
          setReviews(fallbackReviews)
          setUsingFallback(true)
        }
      } catch {
        setReviews(fallbackReviews)
        setUsingFallback(true)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Toggle publish / hide status
  const handleTogglePublish = async (review: Review) => {
    const nextStatus = !(review.is_published ?? true)
    setModeratingId(review.id)
    try {
      if (usingFallback) {
        const updatedList = reviews.map((r) =>
          r.id === review.id ? { ...r, is_published: nextStatus } : r
        )
        setReviews(updatedList)
        toast.success(`Review publish status updated (Mocked)`)
      } else {
        const res = await adminApi.toggleReviewPublish(review.id, nextStatus)
        if (res.success) {
          toast.success(
            nextStatus
              ? "Review published successfully!"
              : "Review hidden from storefront catalogue."
          )
          const updatedList = reviews.map((r) =>
            r.id === review.id ? { ...r, is_published: nextStatus } : r
          )
          setReviews(updatedList)
        } else {
          toast.error(res.message || "Failed to moderate review status.")
        }
      }
    } catch {
      toast.error("Failed to transition review publication status.")
    } finally {
      setModeratingId(null)
    }
  }

  // Permanently delete a review
  const handleDeleteReview = async (id: string) => {
    if (
      !(await confirmDelete(
        "Are you sure you want to permanently delete this customer review? This action is irreversible."
      ))
    )
      return

    setModeratingId(id)
    try {
      if (usingFallback) {
        setReviews(reviews.filter((r) => r.id !== id))
        toast.success("Review deleted successfully (Mocked)")
      } else {
        const res = await adminApi.deleteReview(id)
        if (res.success) {
          toast.success("Review permanently removed from directory!")
          setReviews(reviews.filter((r) => r.id !== id))
        } else {
          toast.error(res.message || "Failed to remove review.")
        }
      }
    } catch {
      toast.error("Failed to delete review.")
    } finally {
      setModeratingId(null)
    }
  }

  // Star ratings display helper
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5 text-amber-500">
        {Array.from({ length: 5 }).map((_, idx) => (
          <HugeiconsIcon
            key={idx}
            icon={StarIcon}
            className={`size-3.5 ${idx < rating ? "fill-amber-500" : "text-muted/60"}`}
          />
        ))}
      </div>
    )
  }

  // Filtering
  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      r.body.toLowerCase().includes(search.toLowerCase())

    const matchesRating =
      ratingFilter === "all" || r.rating.toString() === ratingFilter

    const matchesPublish =
      publishFilter === "all" ||
      (publishFilter === "published" && (r.is_published ?? true)) ||
      (publishFilter === "hidden" && !(r.is_published ?? true))

    return matchesSearch && matchesRating && matchesPublish
  })

  if (loading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <Spinner className="size-8 text-primary" />
          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Loading customer reviews...
          </p>
        </div>

        {confirmDialog}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Header block */}
      <div>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
          Review Moderation
        </h1>
        <p className="text-xs text-muted-foreground">
          Monitor customer experience reviews, publish positive feedback stars,
          and censor advertising spam.
        </p>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col items-center gap-4 rounded-lg border border-border/60 bg-card p-4 shadow-sm sm:flex-row">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
            <HugeiconsIcon icon={SearchIcon} className="size-4" />
          </span>
          <Input
            type="text"
            placeholder="Search reviewer or comment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-border/80 bg-background pl-9"
          />
        </div>

        {/* Rating filter */}
        <div className="w-full sm:max-w-xs">
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Ratings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Publish filter */}
        <div className="w-full sm:max-w-xs">
          <Select value={publishFilter} onValueChange={setPublishFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reviews list */}
      <div className="flex flex-col gap-4">
        {filteredReviews.length === 0 ? (
          <div className="rounded-lg border border-border/60 bg-card py-16 text-center text-xs text-muted-foreground">
            No customer ratings found matching your filter selections.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <Card
              key={rev.id}
              className={cn(
                "border text-xs shadow-sm transition-shadow hover:shadow-md",
                (rev.is_published ?? true)
                  ? "border-border/60 bg-card"
                  : "border-destructive/20 bg-destructive/5"
              )}
            >
              <CardContent className="flex flex-col justify-between gap-4 p-5 text-left sm:flex-row">
                {/* Left side: Review text & reviewer info */}
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground">
                      {rev.customer_name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDate(rev.created_at)}
                    </span>
                  </div>
                  {renderStars(rev.rating)}
                  <p className="mt-1 font-sans leading-relaxed font-medium text-foreground">
                    "{rev.body}"
                  </p>
                </div>

                {/* Right side: Actions triggers */}
                <div className="flex items-center gap-3 sm:self-center">
                  {/* Status badge */}
                  <Badge
                    variant={
                      (rev.is_published ?? true) ? "default" : "destructive"
                    }
                  >
                    {(rev.is_published ?? true) ? "Published" : "Hidden"}
                  </Badge>

                  {/* Toggle publish */}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={moderatingId === rev.id}
                    onClick={() => handleTogglePublish(rev)}
                  >
                    {(rev.is_published ?? true)
                      ? "Censor Hide"
                      : "Publish Star"}
                  </Button>

                  {/* Delete button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={moderatingId === rev.id}
                    onClick={() => handleDeleteReview(rev.id)}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default ReviewsPage
