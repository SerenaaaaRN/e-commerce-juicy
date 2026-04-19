import { useEffect, useState, useTransition } from "react"
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
import { useDataTableFilter } from "@/features/admin/hook/useDataTableFilter"
import { PageHeader } from "@/features/admin/components/PageHeader"
import { EmptyState } from "@/features/admin/components/DataEmpty"
import { DefferedContainer } from "@/features/admin/components/DefferedContainer"
import type { Review } from "@/types"

const STAR_ITERATOR = [0, 1, 2, 3, 4]

export const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isPending, startTransition] = useTransition()

  const {
    search,
    setSearch,
    filteredData: searchFilteredReviews,
    isStale,
  } = useDataTableFilter(reviews, (r, searchLower) =>
    r.customer_name.toLowerCase().includes(searchLower) ||
    r.body.toLowerCase().includes(searchLower)
  )
  const [ratingFilter, setRatingFilter] = useState("all")
  const [publishFilter, setPublishFilter] = useState("all")

  const { confirm: confirmDelete, dialog: confirmDialog } = useConfirm()

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await adminApi.getReviews()
        if (res.success && res.data) {
          setReviews(res.data)
        }
      } catch {
        // silent fail
      }
    })
  }, [])

  const handleTogglePublish = (review: Review) => {
    const nextStatus = !(review.is_published ?? true)
    startTransition(async () => {
      try {
        const res = await adminApi.toggleReviewPublish(review.id, nextStatus)
        if (res.success) {
          toast.success(
            nextStatus
              ? "Review published successfully!"
              : "Review hidden from storefront catalogue."
          )
          setReviews((curr) =>
            curr.map((r) =>
              r.id === review.id ? { ...r, is_published: nextStatus } : r
            )
          )
        } else {
          toast.error(res.message || "Failed to moderate review status.")
        }
      } catch {
        toast.error("Failed to transition review publication status.")
      }
    })
  }

  const handleDeleteReview = async (id: string) => {
    if (
      !(await confirmDelete(
        "Are you sure you want to permanently delete this customer review? This action is irreversible."
      ))
    )
      return

    startTransition(async () => {
      try {
        const res = await adminApi.deleteReview(id)
        if (res.success) {
          toast.success("Review permanently removed from directory!")
          setReviews((curr) => curr.filter((r) => r.id !== id))
        } else {
          toast.error(res.message || "Failed to remove review.")
        }
      } catch {
        toast.error("Failed to delete review.")
      }
    })
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5 text-amber-500">
        {STAR_ITERATOR.map((idx) => (
          <HugeiconsIcon
            key={idx}
            icon={StarIcon}
            className={cn(
              "size-3.5",
              idx < rating ? "fill-amber-500" : "text-muted/60"
            )}
          />
        ))}
      </div>
    )
  }

  const filteredReviews = searchFilteredReviews.filter((r) => {
    const matchesRating =
      ratingFilter === "all" || r.rating.toString() === ratingFilter

    const matchesPublish =
      publishFilter === "all" ||
      (publishFilter === "published" && (r.is_published ?? true)) ||
      (publishFilter === "hidden" && !(r.is_published ?? true))

    return matchesRating && matchesPublish
  })

  if (isPending && reviews.length === 0) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <Spinner className="size-8 text-primary" />
          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Loading customer reviews...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 text-left">
      <PageHeader
        title="Review Moderation"
        description="Monitor customer experience reviews, publish positive feedback stars, and censor advertising spam."
      />

      <div className="flex flex-col items-center gap-4 rounded-lg border border-border/60 bg-card p-4 shadow-sm sm:flex-row">
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

      <DefferedContainer
        isStale={isStale}
        className="flex flex-col gap-4"
      >
        {filteredReviews.length === 0 ? (
          <EmptyState
            message="No customer ratings found matching your filter selections."
            variant="card"
          />
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

                <div className="flex items-center gap-3 sm:self-center">
                  <Badge
                    variant={
                      (rev.is_published ?? true) ? "default" : "destructive"
                    }
                  >
                    {(rev.is_published ?? true) ? "Published" : "Hidden"}
                  </Badge>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleTogglePublish(rev)}
                  >
                    {(rev.is_published ?? true)
                      ? "Censor Hide"
                      : "Publish Star"}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isPending}
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
      </DefferedContainer>

      {confirmDialog}
    </div>
  )
}

export default ReviewsPage
