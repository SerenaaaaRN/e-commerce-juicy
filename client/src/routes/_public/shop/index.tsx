import { CollectionPage } from "@/features/shop/CollectionPage"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"

export const collectionSearchSchema = z.object({
  category: z.string().optional().catch(""),
  sort: z.enum(["price_asc", "price_desc", "newest", "popular"]).optional().catch(undefined),
  page: z.coerce.number().optional().catch(1),
  sizes: z.string().optional().catch(""),
  search: z.string().optional().catch(""),
})

export type CollectionSearch = z.infer<typeof collectionSearchSchema>

export const Route = createFileRoute("/_public/shop/")({
  validateSearch: collectionSearchSchema,
  component: CollectionPage,
})