import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDate } from "@/lib/utils/format"
import { HugeiconsIcon } from "@hugeicons/react"
import { StarIcon, Delete02Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { useConfirm } from "@/hooks/useConfirm"
import { useReviews } from "@/features/admin/hooks/useReviews"
import { useDataTableFilter } from "@/features/admin/hooks/useDataTableFilter"
import { PageHeader } from "@/features/admin/components/PageHeader"
import { EmptyState } from "@/features/admin/components/DataEmpty"
import { DefferedContainer } from "@/features/admin/components/DefferedContainer"
import { FullPageSpinner } from "@/features/admin/components/FullPageSpinner"
import { SearchInput } from "@/features/admin/components/SearchInput"

const STAR_ITERATOR = [0, 1, 2, 3, 4]

const renderStars = (rating: number) => (
  <div className="flex gap-0.5 text-amber-500">
    {STAR_ITERATOR.map((idx) => (
      <HugeiconsIcon
        key={idx}
        icon={StarIcon}
        className={cn("size-3.5", idx < rating ? "fill-amber-500" : "text-muted/60")}
      />
    ))}
  </div>
)

export const ReviewsPage = () => {
  const { reviews, isPending, handleTogglePublish, handleDeleteReview } = useReviews()
  const { confirm: confirmDelete, dialog: confirmDialog } = useConfirm()

  const { search, setSearch, filteredData: searchFiltered, isStale } =
    useDataTableFilter(reviews, (r, s) =>
      r.customer_name.toLowerCase().includes(s) || (r.body?.toLowerCase().includes(s) ?? false)
    )

  const [ratingFilter, setRatingFilter] = useState("all")
  const [publishFilter, setPublishFilter] = useState("all")

  const filtered = searchFiltered.filter((r) => {
    const matchesRating = ratingFilter === "all" || r.rating.toString() === ratingFilter
    const matchesPublish =
      publishFilter === "all" ||
      (publishFilter === "published" && r.is_published) ||
      (publishFilter === "hidden" && !r.is_published)
    return matchesRating && matchesPublish
  })

  if (isPending && reviews.length === 0) {
    return <FullPageSpinner label="Loading customer reviews..." />
  }

  return (
    <div className="flex flex-col gap-8 text-left">
      <PageHeader title="Review Moderation" description="Monitor customer experience reviews, publish positive feedback stars, and censor advertising spam." />

      <div className="flex flex-col items-center gap-4 rounded-lg border border-border/60 bg-card p-4 shadow-sm sm:flex-row">
        <SearchInput placeholder="Search reviewer or comment..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="w-full sm:max-w-xs">
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-full"><SelectValue placeholder="All Ratings" /></SelectTrigger>
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
            <SelectTrigger className="w-full"><SelectValue placeholder="All Statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DefferedContainer isStale={isStale} className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <EmptyState message="No customer ratings found matching your filter selections." variant="card" />
        ) : filtered.map((rev) => (
          <Card key={rev.id} className={cn("border text-xs shadow-sm transition-shadow hover:shadow-md", rev.is_published ? "border-border/60 bg-card" : "border-destructive/20 bg-destructive/5")}>
            <CardContent className="flex flex-col justify-between gap-4 p-5 text-left sm:flex-row">
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-foreground">{rev.customer_name}</span>
                  <span className="text-[10px] text-muted-foreground">{formatDate(rev.created_at)}</span>
                </div>
                {renderStars(rev.rating)}
                <p className="mt-1 font-sans leading-relaxed font-medium text-foreground">"{rev.body}"</p>
              </div>
              <div className="flex items-center gap-3 sm:self-center">
                <Badge variant={rev.is_published ? "default" : "destructive"}>{rev.is_published ? "Published" : "Hidden"}</Badge>
                <Button variant="outline" size="sm" disabled={isPending} onClick={() => handleTogglePublish(rev)}>{rev.is_published ? "Censor Hide" : "Publish Star"}</Button>
                <Button variant="ghost" size="icon" disabled={isPending} onClick={() => handleDeleteReview(rev.id, confirmDelete)} className="hover:bg-destructive/10 hover:text-destructive">
                  <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </DefferedContainer>

      {confirmDialog}
    </div>
  )
}

export default ReviewsPage
