import { customerClient } from "./customerClient"
import type { ApiResponse, PaginatedResponse, Category, CatalogProduct, ProductDetail, Review } from "@/types"

export type ProductFiltersParams = {
  category?: string
  featured?: boolean
  tag?: string
  sort?: "price_asc" | "price_desc" | "newest" | "popular" | ""
  page?: number
  per_page?: number
  sizes?: string
  search?: string
}

export const productApi = {
  // Get active categories
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    const response = await customerClient.get<ApiResponse<Category[]>>("/shop/categories")
    return response.data
  },

  // Get products with optional filters and sorting
  getProducts: async (params?: ProductFiltersParams): Promise<PaginatedResponse<CatalogProduct>> => {
    const response = await customerClient.get<PaginatedResponse<CatalogProduct>>("/shop/products", { params })
    return response.data
  },

  // Get single product detail by slug
  getProductBySlug: async (slug: string): Promise<ApiResponse<ProductDetail>> => {
    const response = await customerClient.get<ApiResponse<ProductDetail>>(`/shop/products/${slug}`)
    return response.data
  },

  // Get reviews of a product
  getProductReviews: async (
    slug: string,
    params?: { page?: number; per_page?: number }
  ): Promise<PaginatedResponse<Review>> => {
    const response = await customerClient.get<PaginatedResponse<Review>>(`/shop/products/${slug}/reviews`, { params })
    return response.data
  },
}

export default productApi
