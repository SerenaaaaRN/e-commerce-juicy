import { ProductPage } from "@/features/shop/ProductPage"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_public/shop/$slug")({
  component: ProductPage,
})