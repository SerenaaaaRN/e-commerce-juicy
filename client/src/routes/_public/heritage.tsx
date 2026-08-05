import { HeritagePage } from "@/features/heritage/HeritagePage"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_public/heritage")({
  component: HeritagePage,
})