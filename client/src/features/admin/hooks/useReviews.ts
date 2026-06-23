import { adminApi } from "@/lib/api/admin"
import type { AdminReview } from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useReviews = () => {
  const queryClient = useQueryClient()

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const res = await adminApi.getReviews()
      if (!res.success) throw new Error(res.error?.message || "Failed to load reviews")
      return res.data as AdminReview[]
    },
  })

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      const res = await adminApi.toggleReviewPublish(id, isPublished)
      if (!res.success) throw new Error(res.error?.message || "Failed to toggle review")
    },
    onSuccess: (_data, { isPublished }) => {
      toast.success(isPublished ? "Review published successfully!" : "Review hidden from storefront catalogue.")
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to moderate review status.")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await adminApi.deleteReview(id)
      if (!res.success) throw new Error(res.error?.message || "Failed to delete review")
    },
    onSuccess: () => {
      toast.success("Review permanently removed from directory!")
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete review.")
    },
  })

  const handleTogglePublish = (review: AdminReview) => {
    toggleMutation.mutate({ id: review.id, isPublished: !review.is_published })
  }

  const handleDeleteReview = async (id: string, confirmFn: (msg: string) => Promise<boolean>) => {
    if (
      !(await confirmFn(
        "Are you sure you want to permanently delete this customer review? This action is irreversible."
      ))
    )
      return
    deleteMutation.mutate(id)
  }

  return {
    reviews,
    isPending: toggleMutation.isPending || deleteMutation.isPending || isLoading,
    handleTogglePublish,
    handleDeleteReview,
  }
}
