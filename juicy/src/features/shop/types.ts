export type ProductFilters = {
  category_id?: string
  sort?: string
  search?: string
  page?: number
  per_page?: number
}

export type SortOption = "price_asc" | "price_desc" | "newest" | "rating"

export type GalleryImage = {
  id: string
  url: string
  alt?: string
}
