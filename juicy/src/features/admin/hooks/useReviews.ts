import { useEffect, useState, useTransition, useCallback } from "react"
import { adminApi } from "@/lib/api/admin"
import { toast } from "sonner"
import type { AdminReview } from "@/types"

export const useReviews = () => {
  const [reviews, setReviews] = useState<AdminReview[]>([])
  const [isPending, startTransition] = useTransition()

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

  const handleTogglePublish = useCallback(
    (review: AdminReview) => {
      const nextStatus = !review.is_published
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
    },
    []
  )

  const handleDeleteReview = useCallback(
    async (id: string, confirmFn: (msg: string) => Promise<boolean>) => {
      if (
        !(await confirmFn(
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
    },
    []
  )

  return {
    reviews,
    isPending,
    handleTogglePublish,
    handleDeleteReview,
  }
}
