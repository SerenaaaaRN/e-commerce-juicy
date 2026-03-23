import { apiClient } from "./client";
import type {
  ApiResponse,
  PaginatedResponse,
  ProductSummary,
  ProductDetail,
  Category,
  Review,
} from "./types";

export async function listProducts(params?: {
  category?: string;
  featured?: string;
  tag?: string;
  sort?: string;
  page?: number;
  per_page?: number;
}): Promise<ProductSummary[]> {
  const res = await apiClient.get<PaginatedResponse<ProductSummary>>("/products", { params });
  return res.data.data;
}

export async function getProductBySlug(slug: string): Promise<ProductDetail> {
  const res = await apiClient.get<ApiResponse<ProductDetail>>(`/products/${slug}`);
  return res.data.data;
}

export async function getProductReviews(
  slug: string,
  params?: { page?: number; per_page?: number },
): Promise<{ reviews: Review[]; meta: { total: number; page: number; per_page: number } }> {
  const res = await apiClient.get<PaginatedResponse<Review>>(`/products/${slug}/reviews`, { params });
  return { reviews: res.data.data, meta: res.data.meta! };
}

export async function listCategories(): Promise<Category[]> {
  const res = await apiClient.get<ApiResponse<Category[]>>("/categories");
  return res.data.data;
}
