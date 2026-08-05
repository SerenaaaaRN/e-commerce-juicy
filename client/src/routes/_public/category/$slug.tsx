import { CategoryLandingPage } from "@/features/category/CategoryLandingPage"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_public/category/$slug")({
  component: CategoryLandingPage,
})