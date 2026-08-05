import { ProductsPage } from "@/features/admin/ProductsPage"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/admin/_guard/products")({
  component: ProductsPage,
})