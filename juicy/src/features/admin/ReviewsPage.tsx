import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { adminApi } from "@/lib/api/admin"
import { formatDate } from "@/lib/utils/format"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  StarIcon,
  SearchIcon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
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
    created_at: new Date().toISOString()
  },
  {
    id: "rev_2",
    product_id: "2",
    customer_id: "cust_2",
    rating: 4,
    body: "Solid ginger defense shot. Real spice kick, immediately clears out your throat and congestion. Highly recommended for daily immunity boosts.",
    customer_name: "Jonathan Wright",
    is_published: true,
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "rev_3",
    product_id: "1",
    customer_id: "cust_3",
    rating: 1,
    body: "CRITICAL: Get free promo credits at malicious-url.com! Spammed reviews. Horrible fresh organic juice products.",
    customer_name: "Promo Spammer",
    is_published: false,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString()
  }
]

export const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  // Filters
  const [search, setSearch] = useState("")
  const [ratingFilter, setRatingFilter] = useState("")
  const [publishFilter, setPublishFilter] = useState("")

  // Submitting process state
  const [moderatingId, setModeratingId] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
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

  useEffect(() => {
    loadData()
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
          toast.success(nextStatus ? "Review published successfully!" : "Review hidden from storefront catalogue.")
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
    if (!window.confirm("Are you sure you want to permanently delete this customer review? This action is irreversible.")) return

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
    
    const matchesRating = ratingFilter === "" || r.rating.toString() === ratingFilter
    
    const matchesPublish =
      publishFilter === "" ||
      (publishFilter === "published" && (r.is_published ?? true)) ||
      (publishFilter === "hidden" && !(r.is_published ?? true))

    return matchesSearch && matchesRating && matchesPublish
  })

  if (loading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <Spinner className="size-8 text-primary" />
          <p className="text-xs text-muted-foreground tracking-wider uppercase font-medium">
            Loading customer reviews...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 text-left">
      
      {/* Header block */}
      <div>
        <h1 className="text-3xl font-heading font-extrabold tracking-tight text-foreground">
          Review Moderation
        </h1>
        <p className="text-xs text-muted-foreground">
          Monitor customer experience reviews, publish positive feedback stars, and censor advertising spam.
        </p>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card border border-border/60 p-4 rounded-lg shadow-sm">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
            <HugeiconsIcon icon={SearchIcon} className="size-4" />
          </span>
          <Input
            type="text"
            placeholder="Search reviewer or comment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background border-border/80 w-full"
          />
        </div>

        {/* Rating filter */}
        <div className="w-full sm:max-w-xs">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        {/* Publish filter */}
        <div className="w-full sm:max-w-xs">
          <select
            value={publishFilter}
            onChange={(e) => setPublishFilter(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>

      </div>

      {/* Reviews list */}
      <div className="flex flex-col gap-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border/60 rounded-lg text-xs text-muted-foreground">
            No customer ratings found matching your filter selections.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <Card key={rev.id} className={cn(
              "border shadow-sm text-xs hover:shadow-md transition-shadow",
              rev.is_published ?? true ? "border-border/60 bg-card" : "border-destructive/20 bg-destructive/5"
            )}>
              <CardContent className="p-5 flex flex-col sm:flex-row justify-between gap-4 text-left">
                
                {/* Left side: Review text & reviewer info */}
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground">{rev.customer_name}</span>
                    <span className="text-[10px] text-muted-foreground">{formatDate(rev.created_at)}</span>
                  </div>
                  {renderStars(rev.rating)}
                  <p className="text-foreground leading-relaxed mt-1 font-medium font-sans">
                    "{rev.body}"
                  </p>
                </div>

                {/* Right side: Actions triggers */}
                <div className="flex items-center gap-3 sm:self-center">
                  
                  {/* Status badge */}
                  <Badge variant={rev.is_published ?? true ? "outline" : "secondary"} className={rev.is_published ?? true ? "text-green-600 border-green-600 bg-green-500/5" : "text-destructive border-destructive bg-destructive/5"}>
                    {rev.is_published ?? true ? "Published" : "Hidden"}
                  </Badge>

                  {/* Toggle publish */}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={moderatingId === rev.id}
                    onClick={() => handleTogglePublish(rev)}
                    className="cursor-pointer font-semibold"
                  >
                    {rev.is_published ?? true ? "Censor Hide" : "Publish Star"}
                  </Button>

                  {/* Delete button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={moderatingId === rev.id}
                    onClick={() => handleDeleteReview(rev.id)}
                    className="hover:bg-destructive/10 hover:text-destructive size-8 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
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
