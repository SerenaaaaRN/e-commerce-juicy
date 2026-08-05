import { CustomersPage } from "@/features/admin/CustomersPage"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/admin/_guard/customers")({
  component: CustomersPage,
})