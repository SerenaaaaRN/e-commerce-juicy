import { ReviewsPage } from "@/features/admin/ReviewsPage"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/admin/_guard/reviews")({
  component: ReviewsPage,
})