import { DashboardPage } from "@/features/admin/DashboardPage"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/admin/_guard/dashboard")({
  component: DashboardPage,
})